<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

abstract class Controller
{
    /**
     * Resolve the current user from Sanctum token or request headers.
     */
    protected function resolveUser(Request $request): ?User
    {
        // 1. Direct user from request (if Sanctum middleware ran)
        if ($request->user()) {
            return $request->user();
        }

        // 2. Parse Bearer token from Authorization header
        $bearer = $request->bearerToken();
        if ($bearer) {
            $tokenRecord = PersonalAccessToken::findToken($bearer);
            if ($tokenRecord && $tokenRecord->tokenable instanceof User) {
                return $tokenRecord->tokenable;
            }
        }

        // 3. Fallback to X-User-Email header
        if ($request->hasHeader('X-User-Email')) {
            $email = trim($request->header('X-User-Email'));
            if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $user = User::where('email', $email)->first();
                if (!$user) {
                    $namePart = explode('@', $email)[0];
                    $cleanName = ucwords(str_replace(['.', '_', '-'], ' ', $namePart));
                    $code = 'REF-' . strtoupper(\Illuminate\Support\Str::slug($cleanName)) . '-' . rand(1000, 9999);
                    $user = User::create([
                        'name' => $cleanName,
                        'email' => $email,
                        'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                        'role' => str_contains($email, 'admin') ? 'admin' : 'affiliate',
                        'referral_code' => $code,
                        'tier' => str_contains($email, 'admin') ? 'Administrator' : 'Standard Affiliate',
                        'status' => 'Active',
                        'risk_score' => 'Low',
                        'total_earnings' => 0.00,
                        'available_balance' => 0.00,
                        'pending_earnings' => 0.00,
                        'locked_balance' => 0.00,
                        'needs_onboarding' => false,
                    ]);
                }
                return $user;
            }
        }

        // 4. Fallback to X-User-Id header
        if ($request->hasHeader('X-User-Id')) {
            $headerId = $request->header('X-User-Id');
            $numericId = is_numeric($headerId) ? (int) $headerId : (str_starts_with($headerId, 'usr-') ? (int) substr($headerId, 4) : null);
            if ($numericId) {
                $user = User::find($numericId);
                if ($user) return $user;
            }
        }

        return null;
    }
}
