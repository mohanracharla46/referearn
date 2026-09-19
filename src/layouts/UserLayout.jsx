import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../services/api';
import { NotificationPopover } from '../components/common/NotificationPopover';
import { QuickWithdrawalModal } from '../components/common/QuickWithdrawalModal';
import { LinkGeneratorModal } from '../components/common/LinkGeneratorModal';
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
} from 'lucide-react';

export const UserLayout = () => {
  const { user, activePortal, switchPortal, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['userStats'],
    queryFn: affiliateApi.getUserStats,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: affiliateApi.getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: affiliateApi.markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const mainNavItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Available Marketplace', path: '/app/marketplace', icon: Store },
    { label: 'Refer & Earn', path: '/app/refer', icon: Share2 },
  ];

  const financialNavItems = [
    { label: 'Earnings', path: '/app/earnings', icon: DollarSign },
    { label: 'Targets', path: '/app/targets', icon: Target },
    { label: 'Analytics', path: '/app/analytics', icon: BarChart3 },
    { label: 'Wallet', path: '/app/wallet', icon: Wallet },
    { label: 'Withdrawals', path: '/app/withdrawals', icon: ArrowUpRight },
  ];

  const accountNavItems = [
    { label: 'Notifications', path: '/app/notifications', icon: Bell },
    { label: 'Profile', path: '/app/profile', icon: User },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-100/90 flex flex-col font-sans text-zinc-950">
      {/* Top Banner Ticker & Switcher */}
      <div className="bg-zinc-950 text-white text-xs px-4 py-2 flex items-center justify-between border-b border-zinc-800 sticky top-0 z-40">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-tight">REFEREARN PLATFORM</span>
          <span className="hidden sm:inline text-zinc-400">| Affiliate Publisher Workspace</span>
        </div>

        {/* Portal Switcher Button */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 text-[11px] hidden md:inline font-mono font-medium">CONSOLE MODE:</span>
          <div className="flex bg-zinc-900 p-0.5 rounded-md border border-zinc-800">
            <button
              onClick={() => {
                switchPortal('user');
                navigate('/app/dashboard');
              }}
              className={`px-3 py-1 text-xs font-bold rounded transition-subtle ${
                activePortal === 'user' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Affiliate Portal
            </button>
            <button
              onClick={() => {
                switchPortal('admin');
                navigate('/admin/dashboard');
              }}
              className={`px-3 py-1 text-xs font-bold rounded transition-subtle flex items-center gap-1.5 ${
                activePortal === 'admin' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-zinc-700" />
              Admin Console
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Desktop Sidebar (~240px) */}
        <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-zinc-200/90 shrink-0 select-none">
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-sm tracking-tight border border-zinc-950">
                RE
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-zinc-950 block leading-none">
                  ReferEarn
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
                {formatCurrency(stats?.availableBalance || 7500.0)}
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
              onClick={() => {
                logout();
                navigate('/auth/login');
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-zinc-700 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-subtle mt-2"
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
            <div className="relative w-72 bg-white h-full border-r border-zinc-200 flex flex-col p-4 z-50 animate-in slide-in-from-left duration-150">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200">
                <span className="font-extrabold text-base text-zinc-950">ReferEarn Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto">
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
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLinkModalOpen(true)}
                  icon={Sparkles}
                  className="text-xs font-semibold"
                >
                  Generate Link
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
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border border-zinc-300 object-cover"
                />
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-zinc-950 block leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono font-semibold block">
                    {user?.tier}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <QuickWithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={stats?.availableBalance || 7500.0}
        onSuccess={() => queryClient.invalidateQueries()}
      />
      <LinkGeneratorModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
      <UserOnboardingModal />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};
