<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Campaign;
use App\Models\Category;
use App\Models\FraudLog;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Referral;
use App\Models\Setting;
use App\Models\Target;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign keys and wipe all existing dummy data for a 100% fresh clean system
        Schema::disableForeignKeyConstraints();
        AuditLog::truncate();
        FraudLog::truncate();
        Notification::truncate();
        Target::truncate();
        Campaign::truncate();
        Withdrawal::truncate();
        Transaction::truncate();
        Referral::truncate();
        Product::truncate();
        Category::truncate();
        Setting::truncate();
        User::truncate();
        Schema::enableForeignKeyConstraints();

        // 1. Create Super Administrator Account ONLY
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
            'referrals_count' => 0,
            'conversions_count' => 0,
            'needs_onboarding' => false,
            'created_at' => now(),
        ]);

        // 2. System Settings & Customer Support Details
        Setting::create(['key' => 'platform_name', 'value' => 'ReferEarn Enterprise', 'group' => 'general']);
        Setting::create(['key' => 'min_withdrawal_threshold', 'value' => '100', 'group' => 'payouts']);
        Setting::create(['key' => 'auto_payout_enabled', 'value' => 'true', 'group' => 'payouts']);
        Setting::create(['key' => 'fraud_risk_cutoff', 'value' => '75', 'group' => 'security']);
        Setting::create(['key' => 'customer_support_phone', 'value' => '+91 91604 42966', 'group' => 'general']);
        Setting::create(['key' => 'customer_support_whatsapp', 'value' => 'https://wa.me/919160442966', 'group' => 'general']);
    }
}
