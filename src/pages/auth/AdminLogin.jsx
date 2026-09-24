import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ToastContainer } from '../../components/ui/Toast';
import { ShieldCheck, Lock, Building2, KeyRound, ArrowRight } from 'lucide-react';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { adminLogin } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e, customEmail = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetEmail = (customEmail || email).trim();
    if (!targetEmail) {
      addToast({ title: 'Email Required', message: 'Please enter your administrator email address.', type: 'warning' });
      return;
    }
    if (!password) {
      addToast({ title: 'Password Required', message: 'Please enter your administrator security password.', type: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const loggedUser = await adminLogin(targetEmail, password);
      queryClient.clear();
      queryClient.invalidateQueries();

      addToast({
        title: 'Authentication Successful',
        message: `Authenticated as Enterprise Administrator (${loggedUser.name || targetEmail}).`,
        type: 'success',
      });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      addToast({
        title: 'Access Denied',
        message: err.message || 'Administrator privileges required to access this portal.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-between p-4 sm:p-8 font-sans text-zinc-100 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto relative z-10 py-2">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1.5 shadow-md">
            <img src="/logo.png" alt="Referitup Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
              Referitup Admin
            </span>
            <span className="text-[10px] text-emerald-400 font-mono tracking-wider block mt-1 uppercase font-bold">
              Secure Control Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-mono font-semibold text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PORTAL VER 2.4 • ENCRYPTED</span>
        </div>
      </header>

      {/* Main Admin Auth Form Card */}
      <main className="w-full max-w-md mx-auto my-auto relative z-10 py-8">
        <div className="bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
          {/* Card Badge & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/80 mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Administrator Login
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Restricted portal. Authenticate with enterprise admin credentials.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@referearn.io"
                className="w-full px-3.5 py-2.5 border border-zinc-800 rounded-lg text-sm text-white bg-zinc-950/90 placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-subtle font-mono"
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                  Security Key / Password
                </span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 border border-zinc-800 rounded-lg text-sm text-white bg-zinc-950/90 placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-subtle font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-rose-600 text-white text-sm font-semibold rounded-lg hover:bg-rose-500 active:bg-rose-700 transition-subtle shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Admin Access</span>
                </>
              )}
            </button>
          </form>

          {/* Link back to User Login */}
          <div className="pt-2 text-center border-t border-zinc-800">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-subtle font-medium"
            >
              <span>Not an administrator? Return to Publisher Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-zinc-500 font-mono relative z-10 py-2">
        Referitup System Control & Governance Panel • All Administrative actions are logged & audited
      </footer>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
