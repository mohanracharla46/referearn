import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserOnboardingModal } from '../../components/common/UserOnboardingModal';
import { ToastContainer } from '../../components/ui/Toast';
import { Lock, Building2, User } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e, customEmail = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetEmail = (customEmail || email).trim();
    if (!targetEmail) {
      addToast({ title: 'Email Required', message: 'Please enter your email address to log in.', type: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const loggedUser = await login(targetEmail, 'password123');
      // Wipe old session query caches
      queryClient.clear();
      queryClient.invalidateQueries();

      addToast({
        title: 'Welcome Back',
        message: `Signed in as ${loggedUser?.role === 'admin' || targetEmail.includes('admin') ? 'Enterprise Administrator' : 'Affiliate Publisher'}.`,
        type: 'success',
      });
      if (loggedUser?.role === 'admin' || targetEmail.includes('admin')) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/app/dashboard', { replace: true });
      }
    } catch (err) {
      addToast({ title: 'Login Error', message: err.message || 'Unable to log in.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fillAffiliateDemo = () => {
    setEmail('kishore@referearn.io');
    addToast({ title: 'Affiliate Demo Selected', message: 'Filled publisher email.', type: 'info' });
  };

  const fillAdminDemo = () => {
    setEmail('admin@referearn.io');
    addToast({ title: 'Admin Demo Selected', message: 'Filled enterprise admin email.', type: 'info' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans text-zinc-950 relative overflow-hidden">
      {/* Left Form Panel (6 Cols) */}
      <div className="flex-1 bg-white bg-grid-pattern flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 border-r border-zinc-200/80 min-h-screen">
        {/* Animated Moving Ambient Background Lights (Blue & Pink) */}
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none animate-glow-blue z-0" />
        <div className="absolute top-1/2 -right-32 w-[420px] h-[420px] bg-pink-400/20 rounded-full blur-3xl pointer-events-none animate-glow-pink z-0" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl pointer-events-none animate-glow-blue z-0" />

        {/* Top Dub-style Logo */}
        <div className="flex justify-center pt-2 pb-6 relative z-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white font-black text-sm flex items-center justify-center tracking-tighter shadow-sm">
              re
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-zinc-950 lowercase">
              referearn
            </span>
          </div>
        </div>

        {/* Main Center Auth Form */}
        <div className="w-full max-w-sm mx-auto space-y-6 relative z-10">
          <div className="text-center space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
              Log in to your ReferEarn account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-zinc-700">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="panic@thedis.co"
                className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-lg text-sm text-zinc-900 bg-white/90 backdrop-blur-xs placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-subtle"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-zinc-950 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 active:bg-black transition-subtle shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Log in with email</span>
              )}
            </button>
          </form>

          {/* OR Divider (Centered Perfectly) */}
          <div className="relative flex items-center justify-center w-full my-5">
            <div className="w-full border-t border-zinc-200 absolute inset-0 my-auto" />
            <span className="bg-white px-3.5 text-[11px] font-mono text-zinc-400 uppercase font-semibold relative z-10 rounded">
              OR
            </span>
          </div>

          {/* Social / SSO Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                const target = email.trim() || 'google.publisher@example.com';
                setEmail(target);
                handleSubmit(null, target);
              }}
              className="w-full py-2.5 px-4 bg-white/90 backdrop-blur-xs border border-zinc-200/90 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 transition-subtle flex items-center justify-center gap-2.5 shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const target = email.trim() || 'github.publisher@example.com';
                setEmail(target);
                handleSubmit(null, target);
              }}
              className="w-full py-2.5 px-4 bg-white/90 backdrop-blur-xs border border-zinc-200/90 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 transition-subtle flex items-center justify-center gap-2.5 shadow-2xs"
            >
              <svg className="w-4 h-4 fill-zinc-900" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const target = email.trim() || 'sso.publisher@example.com';
                setEmail(target);
                handleSubmit(null, target);
              }}
              className="w-full py-2.5 px-4 bg-white/90 backdrop-blur-xs border border-zinc-200/90 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 transition-subtle flex items-center justify-center gap-2.5 shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-600" />
              <span>Continue with SAML SSO</span>
            </button>
          </div>

          <p className="text-center text-xs text-zinc-600 font-medium">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-bold text-zinc-950 hover:underline">
              Sign up
            </Link>
          </p>

          {/* Dotted Partner Account Box */}
          <div className="p-4 rounded-xl border border-dashed border-zinc-300 bg-white/60 backdrop-blur-xs bg-dots-pattern text-center space-y-2">
            <span className="text-xs text-zinc-600 font-medium block">
              Looking for your 1-Click Demo accounts?
            </span>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={fillAffiliateDemo}
                className="px-3 py-1.5 bg-white border border-zinc-200 rounded-md text-xs font-bold text-zinc-900 hover:bg-zinc-100 transition-subtle shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3 h-3 text-zinc-600" />
                Affiliate Demo
              </button>
              <button
                type="button"
                onClick={fillAdminDemo}
                className="px-3 py-1.5 bg-zinc-950 text-white border border-zinc-950 rounded-md text-xs font-bold hover:bg-zinc-800 transition-subtle shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Building2 className="w-3 h-3 text-white" />
                Admin Console
              </button>
            </div>
          </div>
        </div>

        {/* Footer Terms */}
        <div className="text-center text-[11px] text-zinc-400 font-medium pt-6 relative z-10">
          By continuing, you agree to ReferEarn's Terms of Service and Privacy Policy
        </div>
      </div>

      {/* Right Showcase Panel (6 Cols - Dub.co Card & Logo Grid with Ambient Glow) */}
      <div className="hidden lg:flex flex-1 bg-zinc-50/80 p-10 lg:p-16 flex-col justify-between items-center relative overflow-hidden">
        {/* Animated Moving Ambient Background Lights on Right Panel */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-300/25 rounded-full blur-3xl pointer-events-none animate-glow-blue" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-300/25 rounded-full blur-3xl pointer-events-none animate-glow-pink" />

        {/* Floating Testimonial Showcase Card */}
        <div className="relative z-10 w-full max-w-lg h-[430px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 bg-zinc-950 text-white p-8 flex flex-col justify-between group cursor-pointer my-auto">
          {/* Card Background Image with Overlay */}
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
            alt="Wispr Flow Case Study"
            className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

          {/* Card Content Top */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-black text-xl tracking-tight">
              <span className="text-emerald-400">|||</span> Flow
            </div>
          </div>

          {/* Card Content Bottom */}
          <div className="relative z-10 space-y-4">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug max-w-sm">
              Learn how Wispr Flow reached millions more users with ReferEarn
            </h3>
            <button className="px-4 py-2 bg-white text-zinc-950 text-xs font-bold rounded-full hover:bg-zinc-100 transition-subtle shadow-md cursor-pointer">
              Read story
            </button>

            {/* Horizontal Slider Progress Bar */}
            <div className="flex items-center gap-2 pt-2">
              <div className="h-1 flex-1 rounded-full bg-white" />
              <div className="h-1 flex-1 rounded-full bg-zinc-700/60" />
              <div className="h-1 flex-1 rounded-full bg-zinc-700/60" />
              <div className="h-1 flex-1 rounded-full bg-zinc-700/60" />
            </div>
          </div>
        </div>

        {/* Partner Logo Grid */}
        <div className="relative z-10 w-full max-w-lg pt-8 grid grid-cols-3 gap-6 items-center text-center opacity-70">
          <div className="font-extrabold text-sm tracking-tight text-zinc-800 font-mono">beehiiv</div>
          <div className="font-bold text-sm tracking-tight text-zinc-800">||| Flow</div>
          <div className="font-bold text-sm tracking-tight text-zinc-800 font-serif italic">granola</div>
          <div className="font-black text-xs tracking-widest text-zinc-700 uppercase">SUPERHUMAN</div>
          <div className="font-bold text-xs tracking-tight text-zinc-800 font-mono">Polymarket</div>
          <div className="font-bold text-xs tracking-wider text-zinc-800 uppercase">Viktor</div>
        </div>
      </div>

      {/* First Time Onboarding Modal */}
      <UserOnboardingModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
