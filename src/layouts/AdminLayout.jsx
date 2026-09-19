import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import {
  ShieldAlert,
  Users,
  Package,
  FolderTree,
  Megaphone,
  Share2,
  CheckCircle2,
  BadgePercent,
  Wallet,
  ArrowUpRight,
  Target,
  FileSpreadsheet,
  Bell,
  ShieldCheck,
  History,
  SlidersHorizontal,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  UserCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, activePortal, switchPortal, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Campaigns', path: '/admin/campaigns', icon: Megaphone },
    { label: 'Referrals', path: '/admin/referrals', icon: Share2 },
    { label: 'Conversions', path: '/admin/conversions', icon: CheckCircle2 },
    { label: 'Commissions', path: '/admin/commissions', icon: BadgePercent },
    { label: 'Wallets', path: '/admin/wallets', icon: Wallet },
    { label: 'Withdrawals', path: '/admin/withdrawals', icon: ArrowUpRight },
    { label: 'Targets', path: '/admin/targets', icon: Target },
    { label: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Fraud / Risk', path: '/admin/fraud-risk', icon: ShieldAlert, alert: true },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
    { label: 'Settings', path: '/admin/settings', icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col font-sans text-zinc-900">
      {/* Top Banner Ticker / Switcher */}
      <div className="bg-zinc-950 text-white text-xs px-4 py-2 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>ADMINISTRATIVE CONTROL PORTAL</span>
          <span className="hidden sm:inline text-zinc-400">| System Governance & Audit Engine</span>
        </div>

        {/* Portal Switcher Button */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 hidden md:inline">Switch Portal:</span>
          <div className="flex bg-zinc-900 p-0.5 rounded border border-zinc-800">
            <button
              onClick={() => {
                switchPortal('user');
                navigate('/app/dashboard');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-subtle ${
                activePortal === 'user' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Affiliate Portal
            </button>
            <button
              onClick={() => {
                switchPortal('admin');
                navigate('/admin/dashboard');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-subtle flex items-center gap-1 ${
                activePortal === 'admin' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3 h-3" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Desktop Admin Sidebar (~250px) */}
        <aside className="hidden lg:flex flex-col w-64 bg-zinc-950 text-zinc-100 border-r border-zinc-900 shrink-0 select-none">
          {/* Admin Header */}
          <div className="p-5 border-b border-zinc-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-white text-zinc-950 flex items-center justify-center font-bold text-xs tracking-tight">
              ADM
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-none">
                Platform Admin
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider block mt-1">
                SECURE CONSOLE v2.4
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-subtle ${
                      isActive
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-4 h-4 shrink-0 ${item.alert ? 'text-rose-400' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.alert && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      4
                    </span>
                  )}
                  {isActive && !item.alert && <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
                </NavLink>
              );
            })}
          </nav>

          {/* Admin User Footer */}
          <div className="p-4 border-t border-zinc-900 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-white block leading-tight">Admin User</span>
                <span className="text-[10px] text-emerald-400 font-mono">Superuser</span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/auth/login');
              }}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-subtle"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Mobile Admin Nav */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-zinc-950 text-white h-full border-r border-zinc-900 flex flex-col p-4 z-50">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-900">
                <span className="font-bold text-base text-white">Admin Console</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:bg-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto">
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-zinc-800 text-white font-semibold'
                          : 'text-zinc-400 hover:bg-zinc-900'
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

        {/* Admin Main Body */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Global System Status:
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Operational
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono font-semibold text-zinc-900 block">
                  GMV: ₹4,890,000.00
                </span>
                <span className="text-[10px] text-zinc-500 block">Payout Engine Active</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
