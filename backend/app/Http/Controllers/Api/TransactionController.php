<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\Referral;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);

        if (!$user) {
            return response()->json([]);
        }

        $query = Transaction::query();

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $q = strtolower($request->search);
            $query->where(function ($sub) use ($q) {
                $sub->whereRaw('LOWER(product) LIKE ?', ["%{$q}%"])
                    ->orWhereRaw('LOWER(buyer) LIKE ?', ["%{$q}%"]);
            });
        }

        $transactions = $query->orderBy('transaction_date', 'desc')->get()->map(function ($t) {
            return [
                'id' => 'tx-' . $t->id,
                'db_id' => $t->id,
                'date' => $t->transaction_date ? $t->transaction_date->toISOString() : $t->created_at->toISOString(),
                'product' => $t->product,
                'buyer' => $t->buyer,
                'amount' => (float) $t->amount,
                'commission' => (float) $t->commission,
                'status' => $t->status,
                'rejection_reason' => $t->rejection_reason,
                'type' => $t->type,
            ];
        });

        return response()->json($transactions);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Approved,Pending,Reversed',
            'rejection_reason' => 'nullable|string',
            'rejectionReason' => 'nullable|string',
        ]);

        $tx = Transaction::findOrFail($id);
        $oldStatus = $tx->status;
        $newStatus = $validated['status'];
        $rejectionReason = $validated['rejection_reason'] ?? $validated['rejectionReason'] ?? null;

        if ($rejectionReason) {
            $tx->rejection_reason = $rejectionReason;
        }

        if ($oldStatus === $newStatus) {
            return response()->json([
                'message' => "Transaction status is already {$newStatus}",
                'transaction' => $tx,
            ]);
        }

        $tx->status = $newStatus;
        if ($newStatus === 'Approved') {
            $tx->rejection_reason = null;
        }
        $tx->save();

        $user = User::find($tx->user_id);
        $commission = (float) $tx->commission;

        if ($user) {
            // Scenario 1: Transitioning to Approved from Pending
            if ($oldStatus === 'Pending' && $newStatus === 'Approved') {
                // Deduct from pending earnings and credit to available balance & total earnings
                $user->decrement('pending_earnings', min((float) $user->pending_earnings, $commission));
                $user->increment('available_balance', $commission);
                $user->increment('total_earnings', $commission);
                $user->increment('conversions_count', 1);

                // Update corresponding Referral status
                Referral::where('user_id', $user->id)
                    ->where(function ($q) use ($tx) {
                        $q->where('name', $tx->buyer)
                          ->orWhere('email', $tx->buyer);
                    })
                    ->update([
                        'status' => 'Converted (₹10 Credited)',
                        'rejection_reason' => null,
                        'total_earned' => $commission,
                    ]);

                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Commission Approved (+₹' . number_format($commission, 2) . ')',
                    'message' => "Admin approved your commission for {$tx->product}! ₹" . number_format($commission, 2) . " has been credited to your available balance.",
                    'type' => 'commission',
                    'is_read' => false,
                ]);
            }
            // Scenario 2: Transitioning to Approved from Reversed
            elseif ($oldStatus === 'Reversed' && $newStatus === 'Approved') {
                $user->increment('available_balance', $commission);
                $user->increment('total_earnings', $commission);
                $user->increment('conversions_count', 1);

                Referral::where('user_id', $user->id)
                    ->where(function ($q) use ($tx) {
                        $q->where('name', $tx->buyer)
                          ->orWhere('email', $tx->buyer);
                    })
                    ->update([
                        'status' => 'Converted (₹10 Credited)',
                        'rejection_reason' => null,
                        'total_earned' => $commission,
                    ]);

                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Commission Approved (+₹' . number_format($commission, 2) . ')',
                    'message' => "Your commission of ₹" . number_format($commission, 2) . " for {$tx->product} has been approved and credited.",
                    'type' => 'commission',
                    'is_read' => false,
                ]);
            }
            // Scenario 3: Transitioning from Approved to Reversed
            elseif ($oldStatus === 'Approved' && $newStatus === 'Reversed') {
                $user->decrement('available_balance', min((float) $user->available_balance, $commission));
                $user->decrement('total_earnings', min((float) $user->total_earnings, $commission));
                if ($user->conversions_count > 0) {
                    $user->decrement('conversions_count', 1);
                }

                Referral::where('user_id', $user->id)
                    ->where(function ($q) use ($tx) {
                        $q->where('name', $tx->buyer)
                          ->orWhere('email', $tx->buyer);
                    })
                    ->update([
                        'status' => 'Reversed',
                        'total_earned' => 0.00,
                    ]);

                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Commission Reversed (-₹' . number_format($commission, 2) . ')',
                    'message' => "Your commission of ₹" . number_format($commission, 2) . " for {$tx->product} was reversed by admin.",
                    'type' => 'commission',
                    'is_read' => false,
                ]);
            }
            // Scenario 4: Transitioning from Approved to Pending
            elseif ($oldStatus === 'Approved' && $newStatus === 'Pending') {
                $user->decrement('available_balance', min((float) $user->available_balance, $commission));
                $user->decrement('total_earnings', min((float) $user->total_earnings, $commission));
                $user->increment('pending_earnings', $commission);
                if ($user->conversions_count > 0) {
                    $user->decrement('conversions_count', 1);
                }

                Referral::where('user_id', $user->id)
                    ->where(function ($q) use ($tx) {
                        $q->where('name', $tx->buyer)
                          ->orWhere('email', $tx->buyer);
                    })
                    ->update([
                        'status' => 'Pending Approval',
                        'total_earned' => 0.00,
                    ]);
            }
            // Scenario 5: Transitioning from Pending to Reversed
            elseif ($oldStatus === 'Pending' && $newStatus === 'Reversed') {
                $user->decrement('pending_earnings', min((float) $user->pending_earnings, $commission));

                Referral::where('user_id', $user->id)
                    ->where(function ($q) use ($tx) {
                        $q->where('name', $tx->buyer)
                          ->orWhere('email', $tx->buyer);
                    })
                    ->update([
                        'status' => 'Rejected',
                        'total_earned' => 0.00,
                    ]);

                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Commission Rejected',
                    'message' => "Pending commission for {$tx->product} was not approved.",
                    'type' => 'commission',
                    'is_read' => false,
                ]);
            }
        }

        AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Updated Transaction Status',
            'details' => "Transaction #{$tx->id} ({$tx->buyer} - ₹{$tx->commission}) changed from {$oldStatus} to {$newStatus}",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => "Transaction status updated to {$newStatus}. Affiliate wallet synced.",
            'transaction' => $tx,
        ]);
    }
}
