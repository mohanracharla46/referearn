import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { UserLayout } from '../layouts/UserLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// User Portal Pages
import { UserDashboard } from '../pages/user/Dashboard';
import { UserMarketplace } from '../pages/user/Marketplace';
import { UserProductDetails } from '../pages/user/ProductDetails';
import { UserReferAndEarn } from '../pages/user/ReferAndEarn';
import { UserEarnings } from '../pages/user/Earnings';
import { UserWallet } from '../pages/user/Wallet';
import { UserWithdrawals } from '../pages/user/Withdrawals';
import { UserTargets } from '../pages/user/Targets';
import { UserAnalytics } from '../pages/user/Analytics';
import { UserNotifications } from '../pages/user/Notifications';
import { UserProfileSettings } from '../pages/user/ProfileSettings';

// Admin Portal Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminProducts } from '../pages/admin/AdminProducts';
import { AdminCategories } from '../pages/admin/AdminCategories';
import { AdminCampaigns } from '../pages/admin/AdminCampaigns';
import { AdminReferrals } from '../pages/admin/AdminReferrals';
import { AdminConversions } from '../pages/admin/AdminConversions';
import { AdminCommissions } from '../pages/admin/AdminCommissions';
import { AdminWallets } from '../pages/admin/AdminWallets';
import { AdminWithdrawals } from '../pages/admin/AdminWithdrawals';
import { AdminTargets } from '../pages/admin/AdminTargets';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminNotifications } from '../pages/admin/AdminNotifications';
import { AdminFraudRisk } from '../pages/admin/AdminFraudRisk';
import { AdminAuditLogs } from '../pages/admin/AdminAuditLogs';
import { AdminSettings } from '../pages/admin/AdminSettings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      {/* User Affiliate Portal Shell */}
      <Route path="/app" element={<UserLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="marketplace" element={<UserMarketplace />} />
        <Route path="product/:id" element={<UserProductDetails />} />
        <Route path="refer" element={<UserReferAndEarn />} />
        <Route path="earnings" element={<UserEarnings />} />
        <Route path="targets" element={<UserTargets />} />
        <Route path="analytics" element={<UserAnalytics />} />
        <Route path="wallet" element={<UserWallet />} />
        <Route path="withdrawals" element={<UserWithdrawals />} />
        <Route path="notifications" element={<UserNotifications />} />
        <Route path="profile" element={<UserProfileSettings />} />
        <Route path="settings" element={<UserProfileSettings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Enterprise Admin Portal Shell */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="campaigns" element={<AdminCampaigns />} />
        <Route path="referrals" element={<AdminReferrals />} />
        <Route path="conversions" element={<AdminConversions />} />
        <Route path="commissions" element={<AdminCommissions />} />
        <Route path="wallets" element={<AdminWallets />} />
        <Route path="withdrawals" element={<AdminWithdrawals />} />
        <Route path="targets" element={<AdminTargets />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="fraud-risk" element={<AdminFraudRisk />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
};
