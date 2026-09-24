import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../services/api';
import { NotificationPopover } from '../components/common/NotificationPopover';
import { QuickWithdrawalModal } from '../components/common/QuickWithdrawalModal';
import { UserOnboardingModal } from '../components/common/UserOnboardingModal';
import { ToastContainer } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import {
  LayoutDashboard,
  Store,
  Share2,
  DollarSign,
  Target,
  BarChart3,
  Wallet,
  ArrowUpRight,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Building2,
  BookOpen,
  Phone,
  ShieldAlert,
} from 'lucide-react';

export const UserLayout = () => {
  const { user, activePortal, switchPortal, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const { data: stats } = useQuery({
    queryKey: ['userStats', user?.email],
    queryFn: affiliateApi.getUserStats,
    refetchInterval: 3000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: affiliateApi.getNotifications,
    refetchInterval: 5000,
  });

  const markReadMutation = useMutation({
    mutationFn: affiliateApi.markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const mainNavItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Refer & Earn', path: '/app/refer', icon: Share2 },
    { label: 'User Guide', path: '/app/guide', icon: BookOpen },
  ];

  const financialNavItems = [
    { label: 'Earnings', path: '/app/earnings', icon: DollarSign },
    { label: 'Wallet', path: '/app/wallet', icon: Wallet },
    { label: 'Withdrawals', path: '/app/withdrawals', icon: ArrowUpRight },
  ];

  const accountNavItems = [
    { label: 'Notifications', path: '/app/notifications', icon: Bell },
    { label: 'Profile', path: '/app/profile', icon: User },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  if (user?.status === 'Suspended') {
    const suspensionReason = user.rejection_reason || user.rejectionReason || 'Terms & conditions violation or security review';
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-zinc-900 border border-rose-900/60 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-center text-white relative animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-red-500 to-rose-600" />
          
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500 shadow-inner">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded-full text-rose-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Account Suspended
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Publisher Access Restricted</h2>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Your affiliate account ({user.email}) has been suspended by a system administrator.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 border border-rose-900/40 rounded-xl text-left space-y-1.5 shadow-inner">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
              Reason for Suspension
            </div>
            <p className="text-xs font-semibold text-white leading-relaxed">
              {suspensionReason}
            </p>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            All feature permissions (referral links, tracking, wallet withdrawals) are locked. If you believe this action was taken in error, contact support.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://wa.me/919160442966"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Support</span>
            </a>
            <button
              onClick={async () => {
                await logout();
                navigate('/auth/login', { replace: true });
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-all border border-zinc-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100/90 flex flex-col font-sans text-zinc-950">
      {/* Top Banner Ticker */}
      <div className="bg-zinc-950 text-white text-xs px-4 py-2 flex items-center justify-between gap-2 border-b border-zinc-800 sticky top-0 z-40">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-bold tracking-tight">REFERITUP PLATFORM</span>
          <span className="hidden sm:inline text-zinc-400">| Affiliate Publisher Workspace</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <span>STATUS: OPERATIONAL</span>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Desktop Sidebar (~240px) */}
        <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-zinc-200/90 shrink-0 select-none">
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Referitup Logo" className="w-8 h-8 rounded-lg object-contain bg-zinc-950 p-1 border border-zinc-950 shrink-0" />
              <div>
                <span className="font-extrabold text-base tracking-tight text-zinc-950 block leading-none">
                  Referitup
                </span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider block mt-1 uppercase font-semibold">
                  Publisher OS
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items grouped */}
          <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
            {/* Main Nav */}
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider px-3 mb-1.5 block">
                MAIN NAVIGATION
              </span>
              <div className="space-y-0.5">
                {mainNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-subtle ${
                          isActive
                            ? 'bg-zinc-950 text-white font-bold shadow-xs'
                            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Financial Nav */}
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider px-3 mb-1.5 block">
                FINANCIALS & GROWTH
              </span>
              <div className="space-y-0.5">
                {financialNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-subtle ${
                          isActive
                            ? 'bg-zinc-950 text-white font-bold shadow-xs'
                            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Account Nav */}
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider px-3 mb-1.5 block">
                PREFERENCES
              </span>
              <div className="space-y-0.5">
                {accountNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-subtle ${
                          isActive
                            ? 'bg-zinc-950 text-white font-bold shadow-xs'
                            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Sidebar Footer Balance Box */}
          <div className="p-3 border-t border-zinc-200 bg-zinc-50/70">
            <div className="p-3 rounded-lg border border-zinc-200 bg-white shadow-2xs space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-wider block">
                Cleared Balance
              </span>
              <span className="financial-num text-lg font-black text-zinc-950 block">
                {formatCurrency(stats?.availableBalance ?? user?.available_balance ?? 0)}
              </span>
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs font-bold mt-1"
                onClick={() => setIsWithdrawModalOpen(true)}
              >
                Withdraw Funds
              </Button>
            </div>

            <button
              onClick={async () => {
                await logout();
                navigate('/auth/login', { replace: true });
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-zinc-700 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-subtle mt-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white h-[100dvh] max-h-screen border-r border-zinc-200 flex flex-col p-4 z-50 overflow-hidden animate-in slide-in-from-left duration-150">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200 shrink-0">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Referitup" className="w-6 h-6 object-contain" />
                  <span className="font-extrabold text-base text-zinc-950">Referitup Menu</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto min-h-0 pr-1 select-none">
                {[...mainNavItems, ...financialNavItems, ...accountNavItems].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${
                        isActive
                          ? 'bg-zinc-950 text-white font-bold'
                          : 'text-zinc-700 hover:bg-zinc-100'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Mobile Drawer Footer: User Profile & Logout Button */}
              <div className="pt-3 mt-3 border-t border-zinc-200 shrink-0 space-y-2">
                <div className="flex items-center gap-2.5 p-2 bg-zinc-50 rounded-md border border-zinc-200">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || 'Publisher'}
                      className="w-8 h-8 rounded-full border border-zinc-300 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold font-mono border border-zinc-800 shrink-0">
                      {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'PU'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-zinc-950 block truncate">
                      {user?.name || 'Publisher'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono font-semibold block truncate">
                      {user?.tier || 'Standard Tier'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    navigate('/auth/login', { replace: true });
                  }}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-md text-xs font-bold transition-subtle cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Main Top Header */}
          <header className="bg-white border-b border-zinc-200/90 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-8 z-30 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2.5">
                <a
                  href="https://wa.me/919160442966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-subtle"
                  title="Contact Support on WhatsApp"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Support: +91 91604 42966</span>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/app/guide')}
                  icon={BookOpen}
                  className="text-xs font-semibold text-zinc-800 hover:bg-zinc-100 border-zinc-300"
                >
                  User Guide
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsWithdrawModalOpen(true)}
                  icon={ArrowUpRight}
                  className="text-xs font-semibold"
                >
                  Withdraw
                </Button>
              </div>
            </div>

            {/* Notification & User Profile Pill */}
            <div className="flex items-center gap-3">
              <NotificationPopover
                notifications={notifications}
                onMarkRead={() => markReadMutation.mutate()}
              />

              <div className="h-4 w-px bg-zinc-200" />

              <div className="flex items-center gap-2.5 pl-1">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || 'Publisher'}
                    className="w-8 h-8 rounded-full border border-zinc-300 object-cover shrink-0 shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold font-mono border border-zinc-800 shrink-0 shadow-2xs">
                    {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'PU'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-zinc-950 block leading-tight">
                    {user?.name || 'Publisher'}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono font-semibold block">
                    {user?.tier || 'Standard Affiliate'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Global Footer */}
          <footer className="border-t border-zinc-200 bg-white py-4 px-6 text-center text-xs text-zinc-500 font-medium mt-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
              <div>
                © {new Date().getFullYear()} <span className="font-bold text-zinc-900">Referitup</span>. All rights reserved.
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/919160442966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Customer Support: +91 91604 42966
                </a>
                <span>•</span>
                <span>
                  Product of{' '}
                  <a
                    href="https://nkxus.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-zinc-900 hover:underline"
                  >
                    NKXUS Pvt. Ltd. (nkxus.com)
                  </a>
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Modals */}
      <QuickWithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={stats?.availableBalance ?? user?.available_balance ?? 0}
        onSuccess={() => queryClient.invalidateQueries()}
      />
      <UserOnboardingModal />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};
