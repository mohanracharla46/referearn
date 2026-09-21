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
        // Disable foreign keys and wipe existing demo data for clean idempotent seeding
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

        // 1. Create Users
        $kishore = User::create([
            'name' => 'Kishore Kumar',
            'email' => 'kishore@referearn.io',
            'password' => Hash::make('password'),
            'role' => 'affiliate',
            'phone' => '9876543210',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
            'referral_code' => 'REF-KISHORE-2026',
            'upi_id' => 'kishore@okaxis',
            'bank_account' => 'HDFC Bank •••• 4092',
            'tier' => 'Platinum Affiliate',
            'status' => 'Active',
            'risk_score' => 'Low',
            'total_earnings' => 42850.00,
            'available_balance' => 7500.00,
            'pending_earnings' => 3200.00,
            'locked_balance' => 1000.00,
            'referrals_count' => 148,
            'conversions_count' => 38,
            'needs_onboarding' => false,
            'created_at' => '2025-10-14 10:00:00',
        ]);

        $admin = User::create([
            'name' => 'Super Administrator',
            'email' => 'admin@referearn.io',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'phone' => '9988776655',
            'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
            'referral_code' => 'REF-ADMIN-0001',
            'tier' => 'Administrator',
            'status' => 'Active',
            'risk_score' => 'Zero',
            'total_earnings' => 0.00,
            'available_balance' => 0.00,
            'needs_onboarding' => false,
            'created_at' => '2025-01-01 00:00:00',
        ]);

        $aditya = User::create([
            'name' => 'Aditya Rao',
            'email' => 'aditya.r@affiliatepro.io',
            'password' => Hash::make('password'),
            'role' => 'affiliate',
            'phone' => '9123456780',
            'avatar' => 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80',
            'referral_code' => 'REF-ADITYA-8812',
            'upi_id' => 'aditya@okhdfc',
            'bank_account' => 'ICICI Bank •••• 9102',
            'tier' => 'Platinum (25%)',
            'status' => 'Active',
            'risk_score' => 'Low',
            'total_earnings' => 142500.00,
            'available_balance' => 24000.00,
            'pending_earnings' => 8500.00,
            'referrals_count' => 312,
            'conversions_count' => 84,
            'created_at' => '2025-11-12 11:20:00',
        ]);

        $sneha = User::create([
            'name' => 'Sneha Kulkarni',
            'email' => 'sneha@growthmarketers.in',
            'password' => Hash::make('password'),
            'role' => 'affiliate',
            'phone' => '9871234560',
            'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
            'referral_code' => 'REF-SNEHA-4102',
            'upi_id' => 'sneha@okicici',
            'bank_account' => 'SBI •••• 5519',
            'tier' => 'Gold (20%)',
            'status' => 'Active',
            'risk_score' => 'Low',
            'total_earnings' => 89400.00,
            'available_balance' => 12500.00,
            'pending_earnings' => 4500.00,
            'referrals_count' => 198,
            'conversions_count' => 52,
            'created_at' => '2026-01-05 09:15:00',
        ]);

        $rajesh = User::create([
            'name' => 'Rajesh Gupta',
            'email' => 'rajesh.g@spamclick.xyz',
            'password' => Hash::make('password'),
            'role' => 'affiliate',
            'phone' => '9898989898',
            'referral_code' => 'REF-RAJESH-9901',
            'tier' => 'Standard (15%)',
            'status' => 'Flagged',
            'risk_score' => 'High (Duplicate IP)',
            'total_earnings' => 12000.00,
            'available_balance' => 0.00,
            'pending_earnings' => 12000.00,
            'referrals_count' => 45,
            'conversions_count' => 6,
            'created_at' => '2026-08-01 14:00:00',
        ]);

        $meera = User::create([
            'name' => 'Meera Deshmukh',
            'email' => 'meera.d@contenthub.org',
            'password' => Hash::make('password'),
            'role' => 'affiliate',
            'phone' => '9765432109',
            'referral_code' => 'REF-MEERA-3310',
            'tier' => 'Gold (20%)',
            'status' => 'Active',
            'risk_score' => 'Low',
            'total_earnings' => 64200.00,
            'available_balance' => 9800.00,
            'referrals_count' => 130,
            'conversions_count' => 39,
            'created_at' => '2026-02-19 16:40:00',
        ]);

        $sunil = User::create([
            'name' => 'Sunil Malhotra',
            'email' => 'sunil@techblog.in',
            'password' => Hash::make('password'),
            'role' => 'affiliate',
            'phone' => '9654321098',
            'referral_code' => 'REF-SUNIL-7712',
            'tier' => 'Standard (15%)',
            'status' => 'Suspended',
            'risk_score' => 'Medium',
            'total_earnings' => 4500.00,
            'available_balance' => 0.00,
            'referrals_count' => 12,
            'conversions_count' => 2,
            'created_at' => '2026-06-30 18:10:00',
        ]);

        // 2. Categories
        $catCloud = Category::create(['name' => 'Cloud Infrastructure', 'slug' => 'cloud', 'description' => 'Enterprise server hosting, cloud nodes & container orchestration', 'icon' => 'Cloud']);
        $catFintech = Category::create(['name' => 'Fintech & Payments', 'slug' => 'fintech', 'description' => 'Payment gateways, billing APIs and financial tools', 'icon' => 'CreditCard']);
        $catSoftware = Category::create(['name' => 'SaaS Software', 'slug' => 'software', 'description' => 'Productivity, CRM and marketing software platforms', 'icon' => 'LayoutGrid']);
        $catDev = Category::create(['name' => 'Developer Tools', 'slug' => 'dev-tools', 'description' => 'APIs, security scanners, event streaming engines', 'icon' => 'Terminal']);
        $catMkt = Category::create(['name' => 'Marketing & Growth', 'slug' => 'marketing', 'description' => 'SEO suites, social growth trackers and ad analytics', 'icon' => 'TrendingUp']);

        // 3. Products (₹10 flat commission across entire platform)
        $p1 = Product::create([
            'name' => 'StackCloud Enterprise Hosting',
            'category' => 'Cloud',
            'category_id' => $catCloud->id,
            'price' => 14999.00,
            'commission' => '₹10',
            'commission_value' => 10.00,
            'commission_type' => 'Flat Rate',
            'status' => 'Active',
            'rating' => 4.9,
            'conversions' => 42,
            'description' => 'Managed Kubernetes and enterprise cloud infrastructure hosting.',
            'image' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
            'rules' => 'Cookie length: 90 days. Flat ₹10 instant referral commission per conversion.',
            'assets' => [
                ['name' => 'Banner 728x90', 'size' => '120 KB', 'type' => 'Image'],
                ['name' => 'Email Copy Template', 'size' => '15 KB', 'type' => 'DOCX'],
            ],
        ]);

        $p2 = Product::create([
            'name' => 'PayFlow Payment Gateway API',
            'category' => 'Fintech',
            'category_id' => $catFintech->id,
            'price' => 9999.00,
            'commission' => '₹10',
            'commission_value' => 10.00,
            'commission_type' => 'Flat Rate',
            'status' => 'Active',
            'rating' => 4.8,
            'conversions' => 67,
            'description' => 'Developer-friendly unified checkout API for merchant payments.',
            'image' => 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80',
            'rules' => 'Flat ₹10 instant referral commission granted upon successful conversion.',
            'assets' => [
                ['name' => 'Integration Guide', 'size' => '2.4 MB', 'type' => 'PDF'],
                ['name' => 'Logo Pack SVG', 'size' => '850 KB', 'type' => 'ZIP'],
            ],
        ]);

        $p3 = Product::create([
            'name' => 'GrowthCRM Automation Suite',
            'category' => 'Software',
            'category_id' => $catSoftware->id,
            'price' => 7499.00,
            'commission' => '₹10',
            'commission_value' => 10.00,
            'commission_type' => 'Flat Rate',
            'status' => 'Active',
            'rating' => 4.7,
            'conversions' => 29,
            'description' => 'AI-driven pipeline management and customer messaging suite.',
            'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
            'rules' => 'Flat ₹10 referral commission on verified product referrals.',
            'assets' => [
                ['name' => 'Product Demo Reel', 'size' => '14 MB', 'type' => 'MP4'],
            ],
        ]);

        $p4 = Product::create([
            'name' => 'CyberShield Endpoint Security',
            'category' => 'Developer Tools',
            'category_id' => $catDev->id,
            'price' => 18999.00,
            'commission' => '₹10',
            'commission_value' => 10.00,
            'commission_type' => 'Flat Rate',
            'status' => 'Active',
            'rating' => 4.9,
            'conversions' => 18,
            'description' => 'Zero-trust network protection and automated malware detection.',
            'image' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80',
            'rules' => 'Flat ₹10 referral commission per enterprise account referral.',
            'assets' => [
                ['name' => 'Security One-Pager', 'size' => '450 KB', 'type' => 'PDF'],
            ],
        ]);

        $p5 = Product::create([
            'name' => 'OmniSEO Keyword Tracker',
            'category' => 'Marketing',
            'category_id' => $catMkt->id,
            'price' => 4999.00,
            'commission' => '₹10',
            'commission_value' => 10.00,
            'commission_type' => 'Flat Rate',
            'status' => 'Active',
            'rating' => 4.6,
            'conversions' => 55,
            'description' => 'Real-time SERP ranking tracker and competitor content auditor.',
            'image' => 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80',
            'rules' => 'Cookie length: 60 days. Flat ₹10 referral payout.',
            'assets' => [
                ['name' => 'Social Banner Pack', 'size' => '5.1 MB', 'type' => 'ZIP'],
            ],
        ]);

        $p6 = Product::create([
            'name' => 'DataPulse Analytics Engine',
            'category' => 'Developer Tools',
            'category_id' => $catDev->id,
            'price' => 12499.00,
            'commission' => '₹10',
            'commission_value' => 10.00,
            'commission_type' => 'Flat Rate',
            'status' => 'Active',
            'rating' => 4.8,
            'conversions' => 22,
            'description' => 'High-speed event stream processor and real-time dashboard.',
            'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
            'rules' => 'Flat ₹10 commission credited immediately.',
            'assets' => [
                ['name' => 'Case Study Deck', 'size' => '3.2 MB', 'type' => 'PDF'],
            ],
        ]);

        // 4. Transactions (₹10 commission each)
        Transaction::create(['user_id' => $kishore->id, 'product_id' => $p1->id, 'product' => $p1->name, 'buyer' => 'Vikram Mehta', 'amount' => 14999.00, 'commission' => 10.00, 'status' => 'Approved', 'type' => 'Sale', 'transaction_date' => '2026-09-18 14:32:00']);
        Transaction::create(['user_id' => $kishore->id, 'product_id' => $p2->id, 'product' => $p2->name, 'buyer' => 'Anita Sharma', 'amount' => 9999.00, 'commission' => 10.00, 'status' => 'Approved', 'type' => 'Sale', 'transaction_date' => '2026-09-17 11:15:00']);
        Transaction::create(['user_id' => $kishore->id, 'product_id' => $p3->id, 'product' => $p3->name, 'buyer' => 'Suresh Patel', 'amount' => 7499.00, 'commission' => 10.00, 'status' => 'Pending', 'type' => 'Sale', 'transaction_date' => '2026-09-16 19:40:00']);
        Transaction::create(['user_id' => $kishore->id, 'product_id' => $p4->id, 'product' => $p4->name, 'buyer' => 'Rohan Verma', 'amount' => 18999.00, 'commission' => 10.00, 'status' => 'Approved', 'type' => 'Sale', 'transaction_date' => '2026-09-15 09:20:00']);
        Transaction::create(['user_id' => $kishore->id, 'product_id' => $p5->id, 'product' => $p5->name, 'buyer' => 'Pooja Nair', 'amount' => 4999.00, 'commission' => 10.00, 'status' => 'Approved', 'type' => 'Sale', 'transaction_date' => '2026-09-14 16:05:00']);
        Transaction::create(['user_id' => $kishore->id, 'product_id' => $p1->id, 'product' => $p1->name, 'buyer' => 'Karan Singhania', 'amount' => 14999.00, 'commission' => 10.00, 'status' => 'Reversed', 'type' => 'Refund', 'transaction_date' => '2026-09-12 13:45:00']);
        Transaction::create(['user_id' => $kishore->id, 'product_id' => $p2->id, 'product' => $p2->name, 'buyer' => 'Deepak Joshi', 'amount' => 9999.00, 'commission' => 10.00, 'status' => 'Approved', 'type' => 'Sale', 'transaction_date' => '2026-09-10 08:10:00']);

        // 5. Withdrawals
        Withdrawal::create(['user_id' => $kishore->id, 'amount' => 20.00, 'method' => 'UPI Instant Payout', 'destination' => 'kishore@okaxis', 'status' => 'Pending Approval', 'reference' => 'UPI/982019482104', 'requested_at' => '2026-09-18 16:00:00']);
        Withdrawal::create(['user_id' => $kishore->id, 'amount' => 50.00, 'method' => 'UPI Instant Payout', 'destination' => 'kishore@okaxis', 'status' => 'Completed', 'reference' => 'UPI/692019482104', 'requested_at' => '2026-09-15 10:00:00', 'processed_at' => '2026-09-15 10:05:00']);
        Withdrawal::create(['user_id' => $aditya->id, 'amount' => 100.00, 'method' => 'HDFC Bank IMPS', 'destination' => 'HDFC0001234 •••• 9841', 'status' => 'Completed', 'reference' => 'IMPS/9812401928', 'requested_at' => '2026-09-01 14:30:00', 'processed_at' => '2026-09-01 14:35:00']);
        Withdrawal::create(['user_id' => $sneha->id, 'amount' => 50.00, 'method' => 'UPI Instant Payout', 'destination' => 'sneha@okicici', 'status' => 'Completed', 'reference' => 'UPI/1092830192', 'requested_at' => '2026-08-15 11:20:00', 'processed_at' => '2026-08-15 11:25:00']);

        // 6. Referrals (₹10 earned each)
        Referral::create(['user_id' => $kishore->id, 'product_id' => $p1->id, 'name' => 'Vikram Mehta', 'email' => 'vikram.m@techcorp.in', 'product' => $p1->name, 'clicks' => 14, 'status' => 'Converted', 'total_earned' => 10.00, 'created_at' => '2026-09-18']);
        Referral::create(['user_id' => $kishore->id, 'product_id' => $p2->id, 'name' => 'Anita Sharma', 'email' => 'anita.s@finventures.com', 'product' => $p2->name, 'clicks' => 8, 'status' => 'Converted', 'total_earned' => 10.00, 'created_at' => '2026-09-17']);
        Referral::create(['user_id' => $kishore->id, 'product_id' => $p3->id, 'name' => 'Devendra Kumar', 'email' => 'dev.kumar@gmail.com', 'product' => $p3->name, 'clicks' => 22, 'status' => 'Active (Trial)', 'total_earned' => 0.00, 'created_at' => '2026-09-17']);
        Referral::create(['user_id' => $kishore->id, 'product_id' => $p3->id, 'name' => 'Suresh Patel', 'email' => 'suresh@patellabs.io', 'product' => $p3->name, 'clicks' => 5, 'status' => 'Converted', 'total_earned' => 10.00, 'created_at' => '2026-09-16']);
        Referral::create(['user_id' => $kishore->id, 'product_id' => $p5->id, 'name' => 'Priya Sundaram', 'email' => 'priya@designstudio.co', 'product' => $p5->name, 'clicks' => 3, 'status' => 'Pending Payment', 'total_earned' => 0.00, 'created_at' => '2026-09-15']);

        // 7. Target
        Target::create([
            'user_id' => $kishore->id,
            'title' => 'September Elite Sprint',
            'target_conversions' => 50,
            'current_conversions' => 38,
            'reward_amount' => 500.00,
            'deadline' => '2026-09-30 23:59:59',
            'completed' => false,
        ]);

        Target::create([
            'user_id' => $kishore->id,
            'title' => 'August Founder Challenge',
            'target_conversions' => 25,
            'current_conversions' => 25,
            'reward_amount' => 250.00,
            'deadline' => '2026-08-31 23:59:59',
            'completed' => true,
        ]);

        // 8. Campaigns
        Campaign::create(['name' => 'Q3 Enterprise Cloud Boost', 'type' => 'Bonus Multiplier', 'budget' => 25000.00, 'status' => 'Active', 'conversions' => 184, 'start_date' => '2026-07-01', 'end_date' => '2026-09-30']);
        Campaign::create(['name' => 'Fintech API Referral Sprint', 'type' => 'Flat Cash Incentive', 'budget' => 15000.00, 'status' => 'Active', 'conversions' => 92, 'start_date' => '2026-08-01', 'end_date' => '2026-09-25']);
        Campaign::create(['name' => 'Autumn SaaS Growth Surge', 'type' => 'Tier Upgrade', 'budget' => 10000.00, 'status' => 'Scheduled', 'conversions' => 0, 'start_date' => '2026-10-01', 'end_date' => '2026-10-31']);

        // 9. Notifications
        Notification::create(['user_id' => $kishore->id, 'title' => 'Commission Approved', 'message' => 'You earned ₹10.00 referral commission from StackCloud sale.', 'type' => 'commission', 'is_read' => false, 'created_at' => '2026-09-18 14:32:00']);
        Notification::create(['user_id' => $kishore->id, 'title' => 'Withdrawal Processed', 'message' => 'Your payout of ₹50.00 to user@okicici was successful.', 'type' => 'withdrawal', 'is_read' => false, 'created_at' => '2026-09-15 10:05:00']);
        Notification::create(['user_id' => $kishore->id, 'title' => 'Target Milestone Alert', 'message' => 'You are 12 conversions away from unlocking the milestone bonus.', 'type' => 'target', 'is_read' => true, 'created_at' => '2026-09-14 09:00:00']);
        Notification::create(['user_id' => $kishore->id, 'title' => 'New Marketing Assets', 'message' => 'GrowthCRM added 3 new banner assets to the marketplace.', 'type' => 'system', 'is_read' => true, 'created_at' => '2026-09-10 12:00:00']);

        // 10. Fraud Logs
        FraudLog::create(['user_id' => $rajesh->id, 'affiliate' => 'Rajesh Gupta (usr-103)', 'trigger' => 'Self-Referral IP Match', 'ip_address' => '49.207.182.11', 'target_product' => 'StackCloud Enterprise', 'risk_score' => 92, 'status' => 'Under Review', 'incident_time' => '2026-09-18 16:22:00']);
        FraudLog::create(['affiliate' => 'Unknown Botnet (42 IPs)', 'trigger' => 'Rapid Click Velocity (>50 clicks/min)', 'ip_address' => '103.22.180.4', 'target_product' => 'PayFlow API', 'risk_score' => 88, 'status' => 'Blocked', 'incident_time' => '2026-09-17 04:10:00']);
        FraudLog::create(['user_id' => $sunil->id, 'affiliate' => 'Sunil Malhotra (usr-105)', 'trigger' => 'Cookie Stuffing Pattern', 'ip_address' => '157.33.91.205', 'target_product' => 'GrowthCRM Suite', 'risk_score' => 78, 'status' => 'Suspended', 'incident_time' => '2026-09-14 21:45:00']);

        // 11. Audit Logs
        AuditLog::create(['admin' => 'Super Admin (System)', 'action' => 'Batch Payout Execution', 'details' => 'Processed ₹450.00 across 6 affiliates.', 'ip' => '127.0.0.1', 'created_at' => '2026-09-18 18:00:00']);
        AuditLog::create(['admin' => 'Security Module', 'action' => 'Flagged User Account', 'details' => 'Automated flag placed on user Rajesh Gupta (usr-103).', 'ip' => 'System', 'created_at' => '2026-09-18 16:22:00']);
        AuditLog::create(['admin' => 'Operations Admin', 'action' => 'Modified Product Commission', 'details' => 'StackCloud commission updated to ₹10 flat.', 'ip' => '182.73.19.4', 'created_at' => '2026-09-15 11:30:00']);

        // 12. Settings
        Setting::create(['key' => 'platform_name', 'value' => 'ReferEarn Enterprise', 'group' => 'general']);
        Setting::create(['key' => 'min_withdrawal_threshold', 'value' => '10', 'group' => 'payouts']);
        Setting::create(['key' => 'auto_payout_enabled', 'value' => 'true', 'group' => 'payouts']);
        Setting::create(['key' => 'fraud_risk_cutoff', 'value' => '75', 'group' => 'security']);
    }
}
