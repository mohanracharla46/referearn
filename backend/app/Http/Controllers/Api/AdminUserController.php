<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'affiliate');

        if ($request->filled('search')) {
            $s = strtolower($request->search);
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$s}%"]);
            });
        }

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->filled('sortBy')) {
            switch ($request->sortBy) {
                case 'highest_balance':
                    $query->orderBy('available_balance', 'desc');
                    break;
                case 'highest_earnings':
                    $query->orderBy('total_earnings', 'desc');
                    break;
                case 'lowest_balance':
                    $query->orderBy('available_balance', 'asc');
                    break;
                case 'most_referrals':
                    $query->orderBy('referrals_count', 'desc');
                    break;
                default:
                    $query->orderBy('id', 'asc');
                    break;
            }
        } else {
            $query->orderBy('id', 'asc');
        }

        $users = $query->get()->map(function ($u) {
            return [
                'id' => 'usr-' . $u->id,
                'db_id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone ?? 'Not Provided',
                'upiId' => $u->upi_id ?? null,
                'bankAccount' => $u->bank_account ?? null,
                'status' => $u->status,
                'rejection_reason' => $u->rejection_reason,
                'tier' => $u->tier,
                'totalEarnings' => (float) $u->total_earnings,
                'availableBalance' => (float) $u->available_balance,
                'pendingEarnings' => (float) $u->pending_earnings,
                'referralsCount' => (int) $u->referrals_count,
                'riskScore' => $u->risk_score,
                'joined' => $u->created_at ? $u->created_at->format('Y-m-d') : '2026-01-01',
            ];
        });

        return response()->json($users);
    }

    public function toggleStatus(Request $request, string $id): JsonResponse
    {
        $dbId = str_starts_with($id, 'usr-') ? (int) substr($id, 4) : (int) $id;
        $user = User::findOrFail($dbId);

        $nextStatus = $user->status === 'Active' ? 'Suspended' : 'Active';
        $user->status = $nextStatus;
        $rejectionReason = $request->input('rejection_reason') ?? $request->input('rejectionReason');
        if ($nextStatus === 'Suspended' && $rejectionReason) {
            $user->rejection_reason = $rejectionReason;
            \App\Models\Notification::create([
                'user_id' => $user->id,
                'title' => 'Account Suspended',
                'message' => "Your account has been suspended by admin. Reason: {$rejectionReason}",
                'type' => 'alert',
                'is_read' => false,
            ]);
        } elseif ($nextStatus === 'Active') {
            $user->rejection_reason = null;
        }
        $user->save();

        AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Toggled User Status',
            'details' => "Affiliate user {$user->name} ({$user->email}) status changed to {$nextStatus}",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => "User status updated to {$nextStatus}",
            'user' => $user,
        ]);
    }

    public function updateTier(Request $request, string $id): JsonResponse
    {
        $dbId = str_starts_with($id, 'usr-') ? (int) substr($id, 4) : (int) $id;
        $user = User::findOrFail($dbId);

        $validated = $request->validate([
            'tier' => 'required|string',
        ]);

        $user->tier = $validated['tier'];
        $user->save();

        AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Updated Affiliate Tier',
            'details' => "User {$user->name} assigned to {$user->tier}",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => "Affiliate tier updated to {$user->tier}",
            'user' => $user,
        ]);
    }

    public function approveProfileUpdate(Request $request, string $id): JsonResponse
    {
        $dbId = str_starts_with($id, 'usr-') ? (int) substr($id, 4) : (int) $id;
        $user = User::findOrFail($dbId);

        $validated = $request->validate([
            'upi_id' => 'nullable|string',
            'bank_account' => 'nullable|string',
            'name' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        if (!empty($validated['upi_id'])) $user->upi_id = $validated['upi_id'];
        if (!empty($validated['bank_account'])) $user->bank_account = $validated['bank_account'];
        if (!empty($validated['name'])) $user->name = $validated['name'];
        if (!empty($validated['phone'])) $user->phone = $validated['phone'];
        $user->save();

        AuditLog::create([
            'admin' => 'Super Administrator',
            'action' => 'Approved User Profile Update',
            'details' => "Approved account/payout detail updates for {$user->name} ({$user->email})",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => "Profile and payout details approved and updated for {$user->name}",
            'user' => $user,
        ]);
    }

    public function rejectProfileUpdate(Request $request, string $id): JsonResponse
    {
        $dbId = str_starts_with($id, 'usr-') ? (int) substr($id, 4) : (int) $id;
        $user = User::findOrFail($dbId);
        $rejectionReason = $request->input('rejection_reason') ?? $request->input('rejectionReason');
        if ($rejectionReason) {
            $user->rejection_reason = $rejectionReason;
            $user->save();

            \App\Models\Notification::create([
                'user_id' => $user->id,
                'title' => 'Profile Edits Rejected',
                'message' => "Your profile detail changes were rejected. Reason: {$rejectionReason}",
                'type' => 'alert',
                'is_read' => false,
            ]);
        }

        AuditLog::create([
            'admin' => 'Super Administrator',
            'action' => 'Rejected User Profile Update',
            'details' => "Rejected requested account/payout updates for {$user->name} ({$user->email})",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => "Requested changes for {$user->name} have been rejected",
            'user' => $user,
        ]);
    }
}
