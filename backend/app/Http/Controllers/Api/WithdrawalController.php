<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);

        if (!$user) {
            return response()->json([]);
        }

        $query = Withdrawal::with('user');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $withdrawals = $query->orderBy('requested_at', 'desc')->get()->map(function ($w) {
            return [
                'id' => 'wd-' . $w->id,
                'db_id' => $w->id,
                'requestedAt' => $w->requested_at ? $w->requested_at->toISOString() : $w->created_at->toISOString(),
                'affiliate' => $w->user ? $w->user->name : 'Publisher',
                'amount' => (float) $w->amount,
                'method' => $w->method,
                'destination' => $w->destination,
                'status' => $w->status,
                'reference' => $w->reference,
            ];
        });

        return response()->json($withdrawals);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:100',
            'method' => 'required|string',
            'destination' => 'required|string',
        ]);

        $user = $this->resolveUser($request);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $amount = (float) $validated['amount'];

        if ($amount < 100.00) {
            return response()->json([
                'message' => 'Minimum withdrawal amount is ₹100.00.',
            ], 422);
        }

        if ($amount > $user->available_balance) {
            return response()->json([
                'message' => 'Requested amount exceeds available balance.',
            ], 422);
        }

        // Deduct from available balance, add to pending earnings
        $user->decrement('available_balance', $amount);
        $user->increment('pending_earnings', $amount);

        $methodPrefix = strtoupper(substr($validated['method'], 0, 3));
        $ref = "{$methodPrefix}/" . rand(100000000, 999999999);

        $wd = Withdrawal::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'method' => $validated['method'],
            'destination' => $validated['destination'],
            'status' => 'Pending Approval',
            'reference' => $ref,
            'requested_at' => now(),
        ]);

        Notification::create([
            'user_id' => $user->id,
            'title' => 'Withdrawal Requested',
            'message' => "Withdrawal request of ₹" . number_format($amount, 2) . " has been submitted for approval.",
            'type' => 'withdrawal',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Withdrawal requested successfully',
            'withdrawal' => [
                'id' => 'wd-' . $wd->id,
                'db_id' => $wd->id,
                'requestedAt' => $wd->requested_at->toISOString(),
                'affiliate' => $user->name,
                'amount' => (float) $wd->amount,
                'method' => $wd->method,
                'destination' => $wd->destination,
                'status' => $wd->status,
                'reference' => $wd->reference,
            ],
        ], 201);
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $wd = Withdrawal::with('user')->findOrFail($id);
        $wd->status = 'Completed';
        $wd->processed_at = now();
        $wd->save();

        if ($wd->user) {
            $wd->user->decrement('pending_earnings', min($wd->user->pending_earnings, $wd->amount));
            Notification::create([
                'user_id' => $wd->user->id,
                'title' => 'Withdrawal Processed',
                'message' => "Your payout of ₹" . number_format($wd->amount, 2) . " via {$wd->method} has been completed.",
                'type' => 'withdrawal',
                'is_read' => false,
            ]);
        }

        AuditLog::create([
            'admin' => 'Operations Admin',
            'action' => 'Approved Payout',
            'details' => "Disbursed ₹{$wd->amount} for withdrawal #{$wd->id} ({$wd->reference})",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Withdrawal approved and disbursed',
            'withdrawal' => $wd,
        ]);
    }

    public function batchApprove(Request $request): JsonResponse
    {
        $pending = Withdrawal::where('status', 'Pending Approval')->get();
        $count = 0;
        $total = 0;

        foreach ($pending as $wd) {
            $wd->status = 'Completed';
            $wd->processed_at = now();
            $wd->save();

            if ($wd->user) {
                $wd->user->decrement('pending_earnings', min($wd->user->pending_earnings, $wd->amount));
                Notification::create([
                    'user_id' => $wd->user->id,
                    'title' => 'Withdrawal Processed',
                    'message' => "Your payout of ₹" . number_format($wd->amount, 2) . " has been completed.",
                    'type' => 'withdrawal',
                    'is_read' => false,
                ]);
            }
            $count++;
            $total += $wd->amount;
        }

        AuditLog::create([
            'admin' => 'Super Admin',
            'action' => 'Batch Payout Execution',
            'details' => "Processed {$count} payouts totaling ₹" . number_format($total, 2),
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => "Batch approved {$count} payouts",
            'processed_count' => $count,
            'total_amount' => $total,
        ]);
    }
}
