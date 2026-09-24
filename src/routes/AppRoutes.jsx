import React from 'react';
import { Routes, Route, Navigate, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { affiliateApi } from '../services/api';
import { handlePostAuthRedirect, PRIMARY_REFERRAL_REDIRECT_URL } from '../utils/navigation';

// Layouts
import { UserLayout } from '../layouts/UserLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { AdminLogin } from '../pages/auth/AdminLogin';
import { Register } from '../pages/auth/Register';
import { JoinReferral } from '../pages/auth/JoinReferral';
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
import { UserGuide } from '../pages/user/UserGuide';

// Admin Portal Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminActiveUsers } from '../pages/admin/AdminActiveUsers';
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

// Guard for routes requiring authentication
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/auth/login'} replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Guard for login / register (if already logged in, handle target product redirect or dashboard)
const PublicAuthRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
        return;
      }
      if (user.needsOnboarding || !user.phone) {
        navigate('/app/dashboard', { replace: true });
        return;
      }
      handlePostAuthRedirect(navigate);
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated && user) {
    return null;
  }

  return children;
};

// Referral Link Entry Handler
const ReferralHandler = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const handleReferral = async () => {
      if (typeof window !== 'undefined') {
        const code = searchParams.get('ref') || params.code;
        if (code) {
          localStorage.setItem('referearn_referrer_code', code);
        }

        const prodId = params.id || searchParams.get('productId');
        if (prodId) {
          localStorage.setItem('referearn_target_product_id', prodId);
          try {
            const prod = await affiliateApi.getProductById(prodId);
            const link = prod?.product_link || prod?.productLink;
            if (link) {
              localStorage.setItem('referearn_target_product_link', link);
            } else {
              localStorage.setItem('referearn_target_product_link', PRIMARY_REFERRAL_REDIRECT_URL);
            }
          } catch (e) {
            localStorage.setItem('referearn_target_product_link', PRIMARY_REFERRAL_REDIRECT_URL);
          }
          affiliateApi.trackClick(prodId).catch(() => {});
        } else {
          localStorage.setItem('referearn_target_product_link', PRIMARY_REFERRAL_REDIRECT_URL);
        }
      }

      if (isAuthenticated && user && !user.needsOnboarding && user.phone) {
        await handlePostAuthRedirect(navigate);
      } else {
        setLoading(false);
      }
    };

    handleReferral();
  }, [searchParams, params, isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <Navigate to="/auth/login" replace />;
};

// Root route handler
const RootRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/app/dashboard'} replace />;
};

// Public User Guide Wrapper (No login required)
const PublicUserGuideWrapper = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col font-sans">
      <header className="bg-white border-b border-zinc-200/90 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Referitup Logo" className="h-8 w-auto object-contain" />
          <span className="font-extrabold text-xl tracking-tight text-zinc-950">
            Referitup <span className="text-xs font-mono text-zinc-500 font-normal">| Platform Guide</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          {isAuthenticated && user ? (
            <button
              onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/app/dashboard')}
              className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-subtle shadow-xs cursor-pointer"
            >
              Go to Workspace
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth/login')}
                className="px-3.5 py-1.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 rounded-lg text-xs font-semibold transition-subtle cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-subtle shadow-xs cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <UserGuide />
      </main>
      <footer className="border-t border-zinc-200 bg-white py-4 px-6 text-center text-xs text-zinc-500 font-medium">
        © {new Date().getFullYear()} <strong className="text-zinc-900">Referitup</strong>. All rights reserved. Product of NKXUS Pvt. Ltd. (nkxus.com)
      </footer>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public User Guide Routes (Accessible Without Login) */}
      <Route path="/guide" element={<PublicUserGuideWrapper />} />
      <Route path="/user-guide" element={<PublicUserGuideWrapper />} />

      {/* Auth Routes */}
      <Route
        path="/auth/login"
        element={
          <PublicAuthRoute>
            <Login />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/admin/login"
        element={
          <PublicAuthRoute>
            <AdminLogin />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicAuthRoute>
            <Register />
          </PublicAuthRoute>
        }
      />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      {/* Referral Link Entry Routes - Store referral code and show default login page */}
      <Route path="/join" element={<ReferralHandler />} />
      <Route path="/p/:id" element={<ReferralHandler />} />
      <Route path="/ref/:code" element={<ReferralHandler />} />

      {/* User Affiliate Portal Shell (Protected) */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="marketplace" element={<Navigate to="/app/refer" replace />} />
        <Route path="product/:id" element={<UserProductDetails />} />
        <Route path="refer" element={<UserReferAndEarn />} />
        <Route path="earnings" element={<UserEarnings />} />
        <Route path="targets" element={<Navigate to="/app/refer" replace />} />
        <Route path="analytics" element={<Navigate to="/app/refer" replace />} />
        <Route path="wallet" element={<UserWallet />} />
        <Route path="withdrawals" element={<UserWithdrawals />} />
        <Route path="notifications" element={<UserNotifications />} />
        <Route path="profile" element={<UserProfileSettings />} />
        <Route path="settings" element={<UserProfileSettings />} />
        <Route path="guide" element={<UserGuide />} />
        <Route path="user-guide" element={<UserGuide />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Enterprise Admin Portal Shell (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="active-users" element={<AdminActiveUsers />} />
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
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};
