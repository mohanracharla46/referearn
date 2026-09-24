<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        $admin = User::where('role', 'admin')->orWhere('email', 'admin@referearn.io')->first();
        if ($admin) {
            $admin->update([
                'name' => 'Super Administrator',
                'email' => 'admin@referearn.io',
                'password' => Hash::make('ReferearnAdmin#2026!Secure'),
                'role' => 'admin',
                'status' => 'Active',
            ]);
        } else {
            User::create([
                'name' => 'Super Administrator',
                'email' => 'admin@referearn.io',
                'password' => Hash::make('ReferearnAdmin#2026!Secure'),
                'role' => 'admin',
                'phone' => '9160442966',
                'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
                'referral_code' => 'REF-ADMIN-0001',
                'tier' => 'Administrator',
                'status' => 'Active',
                'risk_score' => 'Zero',
                'total_earnings' => 0.00,
                'available_balance' => 0.00,
                'pending_earnings' => 0.00,
                'locked_balance' => 0.00,
                'needs_onboarding' => false,
            ]);
        }
    }

    public function down(): void
    {
        //
    }
};
