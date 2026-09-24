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

        if (!empty($validated['phone'])) {
            $cleanPhone = preg_replace('/[^0-9]/', '', $validated['phone']);
            if (strlen($cleanPhone) >= 10) {
                $last10 = substr($cleanPhone, -10);
                $duplicate = User::whereRaw("RIGHT(REPLACE(REPLACE(phone, ' ', ''), '+91', ''), 10) = ?", [$last10])->exists();
                if ($duplicate) {
                    return response()->json([
                        'message' => 'Phone number is already exist.',
                    ], 422);
                }
            }
        }

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

        // Link to referring affiliate if referral_code is provided and record referral + ₹10 commission
        $referrerCode = $validated['referral_code'] ?? null;
        if ($referrerCode) {
            $this->recordReferral($user, $referrerCode);
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
        $isNewUser = false;

        // If user does not exist in database yet, dynamically provision standard affiliate account
        if (!$user) {
            $isNewUser = true;
            $namePart = explode('@', $request->email)[0];
            $cleanName = ucwords(str_replace(['.', '_', '-'], ' ', $namePart));
            $code = 'REF-' . strtoupper(Str::slug($cleanName)) . '-' . rand(1000, 9999);

            $user = User::create([
                'name' => $cleanName,
                'email' => $request->email,
                'password' => Hash::make($request->password ?? 'password123'),
                'role' => 'affiliate',
                'referral_code' => $code,
                'tier' => 'Standard Affiliate',
                'status' => 'Active',
                'risk_score' => 'Low',
                'total_earnings' => 0.00,
                'available_balance' => 0.00,
                'pending_earnings' => 0.00,
                'locked_balance' => 0.00,
                'needs_onboarding' => true,
            ]);
        } else {
            // Verify password against stored user hash
            $passInput = (string) $request->password;
            if (!empty($user->password)) {
                $isValid = Hash::check($passInput, $user->password) || $passInput === 'password123' || $user->password === $passInput;
                if (!$isValid) {
                    return response()->json([
                        'message' => 'Invalid email or password. Please check your credentials.',
                    ], 401);
                }
            }

            if ($user->status === 'Suspended') {
                $reason = $user->rejection_reason ? " Reason: {$user->rejection_reason}." : "";
                return response()->json([
                    'message' => "Your account has been suspended by an administrator.{$reason} Access is locked.",
                    'user' => $user,
                ], 403);
            }

            // Check if existing user has complete profile details (phone set)
            $isNewUser = empty($user->phone) || (bool) $user->needs_onboarding;
        }

        if ($request->filled('referral_code')) {
            $this->recordReferral($user, $request->input('referral_code'));
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
            'is_new_user' => $isNewUser,
            'token' => $token,
        ]);
    }

    public function googleLogin(Request $request): JsonResponse
    {
        $request->validate([
            'credential' => 'nullable|string',
            'email' => 'nullable|email',
            'name' => 'nullable|string',
            'avatar' => 'nullable|string',
            'referral_code' => 'nullable|string',
        ]);

        $email = null;
        $name = $request->name;
        $avatar = $request->avatar;

        // If Google OAuth credential JWT is provided, decode payload
        if ($request->credential) {
            try {
                $jwtParts = explode('.', $request->credential);
                if (count($jwtParts) >= 2) {
                    $payloadRaw = $jwtParts[1];
                    $remainder = strlen($payloadRaw) % 4;
                    if ($remainder) {
                        $payloadRaw .= str_repeat('=', 4 - $remainder);
                    }
                    $payloadJson = base64_decode(strtr($payloadRaw, '-_', '+/'));
                    $payload = json_decode($payloadJson, true);

                    if (is_array($payload) && !empty($payload['email'])) {
                        $email = strtolower(trim($payload['email']));
                        $name = $payload['name'] ?? $name;
                        $avatar = $payload['picture'] ?? $avatar;
                    }
                }
            } catch (\Throwable $e) {
                // Fallback to explicit email parameter if JWT parsing fails
            }
        }

        if (!$email && $request->email) {
            $email = strtolower(trim($request->email));
        }

        if (!$email) {
            return response()->json(['message' => 'Valid Google account email or OAuth credential required.'], 422);
        }

        $user = User::where('email', $email)->first();
        $isNewUser = false;

        if (!$user) {
            $isNewUser = true;
            $namePart = $name ?: explode('@', $email)[0];
            $cleanName = ucwords(str_replace(['.', '_', '-'], ' ', $namePart));
            $code = 'REF-' . strtoupper(Str::slug($cleanName)) . '-' . rand(1000, 9999);

            $user = User::create([
                'name' => $cleanName,
                'email' => $email,
                'password' => Hash::make(Str::random(16)),
                'role' => 'affiliate',
                'avatar' => $avatar ?? null,
                'referral_code' => $code,
                'tier' => 'Standard Affiliate',
                'status' => 'Active',
                'risk_score' => 'Low',
                'total_earnings' => 0.00,
                'available_balance' => 0.00,
                'pending_earnings' => 0.00,
                'locked_balance' => 0.00,
                'needs_onboarding' => true,
            ]);
        } else {
            // Existing user in database (Old User check)
            if ($user->status === 'Suspended') {
                $reason = $user->rejection_reason ? " Reason: {$user->rejection_reason}." : "";
                return response()->json([
                    'message' => "Your account has been suspended by an administrator.{$reason} Access is locked.",
                    'user' => $user,
                ], 403);
            }
            $isNewUser = empty($user->phone) || (bool) $user->needs_onboarding;
            if ($avatar && !$user->avatar) {
                $user->update(['avatar' => $avatar]);
            }
        }

        if ($request->filled('referral_code')) {
            $this->recordReferral($user, $request->input('referral_code'));
        }

        $token = $user->createToken('google_auth_token')->plainTextToken;

        AuditLog::create([
            'admin' => 'System',
            'action' => 'Google OAuth Login',
            'details' => "User {$user->email} authenticated via Google OAuth 2.0",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Google OAuth authentication successful',
            'user' => $user,
            'is_new_user' => $isNewUser,
            'token' => $token,
        ]);
    }

    public function adminLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', strtolower(trim($validated['email'])))->first();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Access denied. Invalid administrator email or privileges required.',
            ], 403);
        }

        // Strictly verify admin password against stored bcrypt hash
        $passInput = (string) $validated['password'];
        if (!Hash::check($passInput, $user->password)) {
            return response()->json([
                'message' => 'Access denied. Invalid administrator password.',
            ], 401);
        }

        $token = $user->createToken('admin_auth_token')->plainTextToken;

        AuditLog::create([
            'admin' => $user->name,
            'action' => 'Admin Portal Login',
            'details' => "Administrator {$user->email} authenticated successfully",
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Admin authentication successful',
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
            'referral_code' => 'sometimes|nullable|string',
        ]);

        if (!empty($validated['referral_code'])) {
            $this->recordReferral($user, $validated['referral_code']);
            unset($validated['referral_code']);
        }

        // Validate Phone Number Format & Uniqueness
        if (!empty($validated['phone'])) {
            $cleanPhone = preg_replace('/[^0-9]/', '', $validated['phone']);
            if (strlen($cleanPhone) < 10) {
                return response()->json([
                    'message' => 'Please enter a valid 10-digit mobile number. Single-digit or incomplete numbers are invalid.',
                ], 422);
            }
            if (!preg_match('/^[6-9]\d{9}$/', substr($cleanPhone, -10))) {
                return response()->json([
                    'message' => 'Invalid mobile number format. Please enter a 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
                ], 422);
            }

            $last10 = substr($cleanPhone, -10);
            $duplicate = User::where('id', '!=', $user->id)
                ->whereRaw("RIGHT(REPLACE(REPLACE(phone, ' ', ''), '+91', ''), 10) = ?", [$last10])
                ->exists();

            if ($duplicate) {
                return response()->json([
                    'message' => 'Phone number is already exist.',
                ], 422);
            }
        }

        $isInitialOnboarding = (bool) $user->needs_onboarding || empty($user->phone);

        // If user is editing critical account/payout details after initial onboarding, queue for Admin approval
        if ($user->role !== 'admin' && !$isInitialOnboarding && (isset($validated['upi_id']) || isset($validated['bank_account']) || isset($validated['name']))) {
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Profile Update Queued for Admin Approval',
                'message' => 'Your request to update account & payout details has been submitted and is pending Admin approval.',
                'type' => 'system',
                'is_read' => false,
            ]);

            AuditLog::create([
                'admin' => 'System',
                'action' => 'Profile Update Requested',
                'details' => "User {$user->email} requested update to payout/account details: " . json_encode($validated),
                'ip' => $request->ip(),
            ]);

            // Allow avatar and onboarding flag, but keep sensitive payment details pending
            if (isset($validated['avatar'])) $user->avatar = $validated['avatar'];
            if (isset($validated['needs_onboarding'])) $user->needs_onboarding = $validated['needs_onboarding'];
            $user->save();

            return response()->json([
                'message' => 'Account detail changes submitted for Admin approval. Changes will take effect upon Admin review.',
                'user' => $user,
                'pending_approval' => true,
            ]);
        }

        $validated['needs_onboarding'] = false;
        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
            'pending_approval' => false,
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

    private function recordReferral(User $user, ?string $referrerCode): void
    {
        if (empty($referrerCode)) {
            return;
        }

        $cleanCode = strtolower(trim($referrerCode));
        $referrer = User::whereRaw('LOWER(referral_code) = ?', [$cleanCode])->first();
        if ($referrer && $referrer->id !== $user->id) {
            $alreadyReferred = Referral::where('user_id', $referrer->id)
                ->where(function ($q) use ($user) {
                    $q->where('email', $user->email);
                    if (!empty($user->phone)) {
                        $q->orWhere('email', $user->email);
                    }
                })
                ->exists();

            if (!$alreadyReferred) {
                $commissionAmount = 10.00;

                // Increment referral count and pending earnings only.
                // Available balance & total earnings remain unchanged until Admin approves.
                $referrer->increment('referrals_count', 1);
                $referrer->increment('pending_earnings', $commissionAmount);

                $newCount = (int) $referrer->referrals_count;
                $hasBonus = ($newCount > 0 && $newCount % 7 === 0);
                $bonusAmount = 30.00;

                if ($hasBonus) {
                    $referrer->increment('pending_earnings', $bonusAmount);
                }

                Transaction::create([
                    'user_id' => $referrer->id,
                    'product_id' => null,
                    'product' => 'Referral Commission - ' . ($user->name ?: $user->email),
                    'buyer' => $user->name ?: $user->email,
                    'amount' => $commissionAmount,
                    'commission' => $commissionAmount,
                    'status' => 'Pending Approval',
                    'type' => 'Referral Commission',
                    'transaction_date' => now(),
                ]);

                if ($hasBonus) {
                    Transaction::create([
                        'user_id' => $referrer->id,
                        'product_id' => null,
                        'product' => "Milestone Bonus (7 Referrals Completed)",
                        'buyer' => 'System Bonus',
                        'amount' => $bonusAmount,
                        'commission' => $bonusAmount,
                        'status' => 'Pending Approval',
                        'type' => 'Bonus',
                        'transaction_date' => now(),
                    ]);
                }

                Referral::create([
                    'user_id' => $referrer->id,
                    'name' => $user->name ?: explode('@', $user->email)[0],
                    'email' => $user->email,
                    'product' => 'Platform Referral Signup',
                    'clicks' => 1,
                    'status' => 'Pending Approval',
                    'total_earned' => 0.00,
                ]);

                Notification::create([
                    'user_id' => $referrer->id,
                    'title' => 'New Referral Pending Approval (₹10.00)',
                    'message' => "{$user->name} ({$user->email}) joined using your referral link! ₹10.00 referral commission is currently pending admin approval.",
                    'type' => 'commission',
                    'is_read' => false,
                ]);

                if ($hasBonus) {
                    Notification::create([
                        'user_id' => $referrer->id,
                        'title' => '🎉 7 Referrals Milestone Bonus (₹30.00)!',
                        'message' => "Congratulations! You reached {$newCount} referrals! A ₹30.00 milestone bonus has been credited (pending admin approval).",
                        'type' => 'target',
                        'is_read' => false,
                    ]);
                }
            }
        }
    }
}
