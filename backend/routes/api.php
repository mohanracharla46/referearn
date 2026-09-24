<?php

use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FraudRiskController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReferralController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\TargetController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\WithdrawalController;
use Illuminate\Support\Facades\Route;

// Health Check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'app' => 'ReferEarn API', 'time' => now()]);
});

// v1 API Route Group
Route::prefix('v1')->group(function () {
    // Health Check
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'version' => '1.0', 'time' => now()]);
    });

    // Authentication
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/admin-login', [AuthController::class, 'adminLogin']);
    Route::post('/auth/google-login', [AuthController::class, 'googleLogin']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    // Dashboard & Analytics
    Route::get('/user/stats', [DashboardController::class, 'userStats']);
    Route::get('/admin/stats', [DashboardController::class, 'adminStats']);
    Route::get('/charts/performance', [DashboardController::class, 'chartData']);

    // Products & Marketplace
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Referrals & Tracking
    Route::get('/referrals', [ReferralController::class, 'index']);
    Route::put('/referrals/{id}/status', [ReferralController::class, 'updateStatus']);
    Route::post('/referrals/generate-link', [ReferralController::class, 'generateLink']);
    Route::post('/referrals/track-click', [ReferralController::class, 'recordClick']);

    // Transactions & Commissions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::put('/transactions/{id}/status', [TransactionController::class, 'updateStatus']);

    // Withdrawals & Payouts
    Route::get('/withdrawals', [WithdrawalController::class, 'index']);
    Route::post('/withdrawals/request', [WithdrawalController::class, 'store']);
    Route::put('/withdrawals/{id}/approve', [WithdrawalController::class, 'approve']);
    Route::post('/withdrawals/batch-approve', [WithdrawalController::class, 'batchApprove']);

    // Campaigns
    Route::get('/campaigns', [CampaignController::class, 'index']);
    Route::post('/campaigns', [CampaignController::class, 'store']);

    // Targets
    Route::get('/targets', [TargetController::class, 'index']);
    Route::get('/targets/all', [TargetController::class, 'all']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-read', [NotificationController::class, 'markAllRead']);
    Route::post('/notifications/broadcast', [NotificationController::class, 'broadcast']);

    // Admin Specific APIs
    Route::get('/admin/active-user-tracking', [DashboardController::class, 'activeUserTracking']);
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);
    Route::post('/admin/users/{id}/tier', [AdminUserController::class, 'updateTier']);
    Route::post('/admin/users/{id}/approve-profile', [AdminUserController::class, 'approveProfileUpdate']);
    Route::post('/admin/users/{id}/reject-profile', [AdminUserController::class, 'rejectProfileUpdate']);
    Route::get('/admin/fraud-logs', [FraudRiskController::class, 'index']);
    Route::put('/admin/fraud-logs/{id}/status', [FraudRiskController::class, 'updateStatus']);
    Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
    Route::get('/admin/settings', [SettingController::class, 'index']);
    Route::post('/admin/settings', [SettingController::class, 'update']);
});
