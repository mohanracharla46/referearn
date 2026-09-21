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

        $users = $query->orderBy('id', 'asc')->get()->map(function ($u) {
            return [
                'id' => 'usr-' . $u->id,
                'db_id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'status' => $u->status,
                'tier' => $u->tier,
                'totalEarnings' => (float) $u->total_earnings,
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
}
