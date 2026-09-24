<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Referral;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);

        if (!$user) {
            return response()->json([]);
        }

        $query = Referral::with('user');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $referrals = $query->orderBy('id', 'desc')->get()->map(function ($r) {
            $referrerName = $r->user ? $r->user->name : 'User A';
            $referrerEmail = $r->user ? $r->user->email : '';

            return [
                'id' => 'ref-' . $r->id,
                'db_id' => $r->id,
                'name' => $r->name,
                'email' => $r->email,
                'date' => $r->created_at ? $r->created_at->format('Y-m-d') : date('Y-m-d'),
                'product' => $r->product ?? 'General Platform',
                'clicks' => (int) $r->clicks,
                'status' => $r->status,
                'rejection_reason' => $r->rejection_reason,
                'totalEarned' => (float) $r->total_earned,
                'referrer_id' => $r->user_id,
                'referrer_name' => $referrerName,
                'referrer_email' => $referrerEmail,
                'referred_by' => "Referred by {$referrerName}",
            ];
        });

        return response()->json($referrals);
    }

    public function generateLink(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'productId' => 'nullable|string',
            'campaignCode' => 'nullable|string',
            'utmSource' => 'nullable|string',
        ]);

        $user = $this->resolveUser($request);
        $code = $validated['campaignCode'] ?? ($user ? $user->referral_code : 'REF-COMMISSION');
        $productId = $validated['productId'] ?? 'prod-1';
        $utmSource = $validated['utmSource'] ?? 'direct';

        $dbId = str_starts_with($productId, 'prod-') ? (int) substr($productId, 5) : (int) $productId;
        $prod = Product::find($dbId);
        $origin = $request->header('Origin') ?: ($request->getSchemeAndHttpHost() ?: 'http://localhost:5173');
        $link = "{$origin}/p/{$productId}?ref={$code}&utm_source={$utmSource}";

        return response()->json([
            'link' => $link,
            'referralCode' => $code,
            'product' => $prod ? $prod->name : 'General Platform',
        ]);
    }

    public function recordClick(Request $request): JsonResponse
    {
        $productId = $request->input('productId');
        if ($productId) {
            $dbId = str_starts_with($productId, 'prod-') ? (int) substr($productId, 5) : (int) $productId;
            Product::where('id', $dbId)->increment('conversions');
        }

        return response()->json(['message' => 'Click tracked']);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'rejection_reason' => 'nullable|string',
            'rejectionReason' => 'nullable|string',
        ]);

        $referral = Referral::findOrFail($id);
        $oldStatus = $referral->status;
        $newStatus = $validated['status'];
        $rejectionReason = $validated['rejection_reason'] ?? $validated['rejectionReason'] ?? null;

        $referral->status = $newStatus;
        if (str_contains($newStatus, 'Converted') || str_contains($newStatus, 'Approved')) {
            $referral->total_earned = 10.00;
            $referral->rejection_reason = null;
        } elseif (str_contains($newStatus, 'Rejected') || str_contains($newStatus, 'Reversed') || str_contains($newStatus, 'Declined')) {
            $referral->total_earned = 0.00;
            if ($rejectionReason) {
                $referral->rejection_reason = $rejectionReason;
            }
        }
        $referral->save();

        // Also find matching Transaction and update it
        $tx = Transaction::where('user_id', $referral->user_id)
            ->where(function ($q) use ($referral) {
                $q->where('name', $referral->name)
                  ->orWhere('buyer', $referral->name)
                  ->orWhere('email', $referral->email)
                  ->orWhere('buyer', $referral->email);
            })->first();

        $user = User::find($referral->user_id);

        if ((str_contains($newStatus, 'Converted') || str_contains($newStatus, 'Approved')) && !str_contains($oldStatus, 'Converted') && !str_contains($oldStatus, 'Approved')) {
            if ($tx) {
                $tx->status = 'Approved';
                $tx->rejection_reason = null;
                $tx->save();
            }
            if ($user) {
                $commission = 10.00;
                $user->decrement('pending_earnings', min((float) $user->pending_earnings, $commission));
                $user->increment('available_balance', $commission);
                $user->increment('total_earnings', $commission);
                $user->increment('conversions_count', 1);

                \App\Models\Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Referral Commission Approved (+₹10.00)',
                    'message' => "Admin approved referral for {$referral->name}! ₹10.00 has been credited to your available balance.",
                    'type' => 'commission',
                    'is_read' => false,
                ]);
            }
        } elseif ((str_contains($newStatus, 'Rejected') || str_contains($newStatus, 'Declined')) && !str_contains($oldStatus, 'Rejected')) {
            if ($tx) {
                $tx->status = 'Rejected';
                if ($rejectionReason) {
                    $tx->rejection_reason = $rejectionReason;
                }
                $tx->save();
            }
            if ($user) {
                $commission = 10.00;
                if ($user->pending_earnings >= $commission) {
                    $user->decrement('pending_earnings', $commission);
                }
                $reasonMsg = $rejectionReason ? " Reason: {$rejectionReason}" : ".";
                \App\Models\Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Referral Submission Rejected',
                    'message' => "Admin rejected referral submission for {$referral->name}.{$reasonMsg}",
                    'type' => 'alert',
                    'is_read' => false,
                ]);
            }
        }

        \App\Models\AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Updated Referral Status',
            'details' => "Referral #{$referral->id} ({$referral->name}) marked as {$newStatus}",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Referral status updated successfully',
            'referral' => $referral,
        ]);
    }
}
