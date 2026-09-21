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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string',
            'referral_code' => 'nullable|string',
        ]);

        $existing = User::where('email', $validated['email'])->first();
        if ($existing) {
            $existing->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'] ?? $existing->phone,
            ]);
            $user = $existing;
        } else {
            $slugName = Str::slug($validated['name']);
            if (empty($slugName)) $slugName = 'USER';
            $code = 'REF-' . strtoupper($slugName) . '-' . rand(1000, 9999);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password'] ?? 'password123'),
                'phone' => $validated['phone'] ?? null,
                'role' => 'affiliate',
                'referral_code' => $code,
                'tier' => 'Standard Affiliate',
                'status' => 'Active',
                'risk_score' => 'Low',
                'total_earnings' => 0.00,
                'available_balance' => 0.00,
                'pending_earnings' => 0.00,
                'locked_balance' => 0.00,
                'needs_onboarding' => false,
            ]);
        }

        // Link to referring affiliate if referral_code is provided and record ₹10 pending commission
        $referrerCode = $validated['referral_code'] ?? null;
        if ($referrerCode) {
            $cleanCode = strtolower(trim($referrerCode));
            $referrer = User::whereRaw('LOWER(referral_code) = ?', [$cleanCode])->first();
            if ($referrer && $referrer->id !== $user->id) {
                // Check if already referred to prevent duplicate payout for same email
                $alreadyReferred = Referral::where('user_id', $referrer->id)
                    ->where('email', $user->email)
                    ->exists();

                if (!$alreadyReferred) {
                    $commissionAmount = 10.00;

                    // At first, money is PENDING. Increment pending_earnings only (NOT available_balance or total_earnings).
                    $referrer->increment('pending_earnings', $commissionAmount);
                    $referrer->increment('referrals_count', 1);

                    // Create Pending transaction record awaiting admin approval
                    Transaction::create([
                        'user_id' => $referrer->id,
                        'product_id' => null,
                        'product' => 'Referral Commission - ' . $user->name,
                        'buyer' => $user->name,
                        'amount' => $commissionAmount,
                        'commission' => $commissionAmount,
                        'status' => 'Pending',
                        'type' => 'Referral Commission',
                        'transaction_date' => now(),
                    ]);

                    // Create referral record with Pending Approval status
                    Referral::create([
                        'user_id' => $referrer->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'product' => 'Platform Referral Signup',
                        'clicks' => 1,
                        'status' => 'Pending Approval',
                        'total_earned' => 0.00,
                    ]);

                    // Send notification informing user of pending commission
                    Notification::create([
                        'user_id' => $referrer->id,
                        'title' => 'New Referral Registered (Pending Approval)',
                        'message' => "New referral: {$user->name} ({$user->email}) joined! ₹10.00 is pending admin approval before being credited to your balance.",
                        'type' => 'commission',
                        'is_read' => false,
                    ]);
                }
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => $existing ? 'Profile updated and signed in' : 'Registration successful',
            'user' => $user,
            'token' => $token,
        ], $existing ? 200 : 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        // If user does not exist in database yet, dynamically provision clean account
        if (!$user) {
            $namePart = explode('@', $request->email)[0];
            $cleanName = ucwords(str_replace(['.', '_', '-'], ' ', $namePart));
            $code = 'REF-' . strtoupper(Str::slug($cleanName)) . '-' . rand(1000, 9999);

            $user = User::create([
                'name' => $cleanName,
                'email' => $request->email,
                'password' => Hash::make($request->password ?? 'password123'),
                'role' => str_contains($request->email, 'admin') ? 'admin' : 'affiliate',
                'referral_code' => $code,
                'tier' => str_contains($request->email, 'admin') ? 'Administrator' : 'Standard Affiliate',
                'status' => 'Active',
                'risk_score' => 'Low',
                'total_earnings' => 0.00,
                'available_balance' => 0.00,
                'pending_earnings' => 0.00,
                'locked_balance' => 0.00,
                'needs_onboarding' => false,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditLog::create([
            'admin' => $user->role === 'admin' ? $user->name : 'System',
            'action' => 'User Login',
            'details' => "User {$user->email} logged in ({$user->role})",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request) ?? User::first();
        return response()->json($user);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);
        if (!$user) {
            $user = User::first();
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string',
            'upi_id' => 'sometimes|nullable|string',
            'bank_account' => 'sometimes|nullable|string',
            'avatar' => 'sometimes|nullable|string',
            'needs_onboarding' => 'sometimes|boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);
        if ($user) {
            $user->currentAccessToken()?->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
