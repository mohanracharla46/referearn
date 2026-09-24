import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserOnboardingModal } from '../../components/common/UserOnboardingModal';
import { ToastContainer } from '../../components/ui/Toast';
import { Lock, Building2, User, BookOpen } from 'lucide-react';
import { handlePostAuthRedirect, PRIMARY_REFERRAL_REDIRECT_URL } from '../../utils/navigation';

export const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, googleLogin } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      const prodId = urlParams.get('productId');
      if (refCode || prodId) {
        if (refCode) localStorage.setItem('referearn_referrer_code', refCode);
        if (prodId) localStorage.setItem('referearn_target_product_id', prodId);
        if (!localStorage.getItem('referearn_target_product_link')) {
          localStorage.setItem('referearn_target_product_link', PRIMARY_REFERRAL_REDIRECT_URL);
        }
      } else {
        // Direct website login (no referral parameters): clear any target product link pointers
        localStorage.removeItem('referearn_target_product_link');
        localStorage.removeItem('referearn_target_product_id');
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1049432934183-rgt29b9n8h7g89geijqcau6ktcjoduok.apps.googleusercontent.com';
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              setLoading(true);
              try {
                let googleEmail = null;
                let googleName = null;
                let googleAvatar = null;
                try {
                  const parts = response.credential.split('.');
                  if (parts.length >= 2) {
                    const base64Url = parts[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(
                      atob(base64)
                        .split('')
                        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                    );
                    const parsed = JSON.parse(jsonPayload);
                    googleEmail = parsed.email;
                    googleName = parsed.name;
                    googleAvatar = parsed.picture;
                  }
                } catch (e) {}

                const { user: loggedUser, isNewUser } = await googleLogin({
                  credential: response.credential,
                  email: googleEmail,
                  name: googleName,
                  avatar: googleAvatar,
                });
                queryClient.clear();
                queryClient.invalidateQueries();

                const isCompleted = typeof window !== 'undefined' && localStorage.getItem('referearn_onboarding_completed') === 'true';

                if (isNewUser && !isCompleted) {
                  addToast({
                    title: 'Google Auth Successful',
                    message: 'Authenticated via Google! Please complete your name & phone number.',
                    type: 'info',
                  });
                  navigate('/app/dashboard', { replace: true });
                } else {
                  addToast({
                    title: 'Welcome Back',
                    message: `Signed in via Google as ${loggedUser.name || loggedUser.email}.`,
                    type: 'success',
                  });
                  await handlePostAuthRedirect(navigate);
                }
              } catch (err) {
                addToast({ title: 'Google Auth Error', message: err.message || 'Unable to authenticate.', type: 'error' });
              } finally {
                setLoading(false);
              }
            }
          },
        });
      } catch (e) {
        // GIS init fallback
      }
    }
  }, [googleLogin, navigate, queryClient, addToast]);

  const handleSubmit = async (e, customEmail = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetEmail = (customEmail || email).trim();
    if (!targetEmail) {
      addToast({ title: 'Email Required', message: 'Please enter your email address to log in.', type: 'warning' });
      return;
    }
    if (!password) {
      addToast({ title: 'Password Required', message: 'Please enter your password to log in.', type: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const { user: loggedUser, isNewUser } = await login(targetEmail, password);
      queryClient.clear();
      queryClient.invalidateQueries();

      const isCompleted = typeof window !== 'undefined' && localStorage.getItem('referearn_onboarding_completed') === 'true';

      if (isNewUser && !isCompleted) {
        addToast({
          title: 'Welcome to Referitup',
          message: 'Account provisioned. Please complete your profile details.',
          type: 'info',
        });
        navigate('/app/dashboard', { replace: true });
      } else {
        addToast({
          title: 'Welcome Back',
          message: `Signed in as ${loggedUser.name || 'Affiliate Publisher'}.`,
          type: 'success',
        });
        await handlePostAuthRedirect(navigate);
      }
    } catch (err) {
      addToast({ title: 'Login Error', message: err.message || 'Unable to log in.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      try {
        const clientId =
          import.meta.env.VITE_GOOGLE_CLIENT_ID ||
          '1049432934183-rgt29b9n8h7g89geijqcau6ktcjoduok.apps.googleusercontent.com';

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              addToast({ title: 'Google Sign-In', message: tokenResponse.error_description || 'Google authentication was cancelled.', type: 'warning' });
              return;
            }
            if (tokenResponse.access_token) {
              setLoading(true);
              try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await userInfoRes.json();

                if (!profile || !profile.email) {
                  throw new Error('Could not retrieve email from Google account profile.');
                }

                const { user: loggedUser, isNewUser } = await googleLogin({
                  email: profile.email,
                  name: profile.name || profile.given_name || profile.email.split('@')[0],
                  avatar: profile.picture,
                });
                queryClient.clear();
                queryClient.invalidateQueries();

                const isCompleted = typeof window !== 'undefined' && localStorage.getItem('referearn_onboarding_completed') === 'true';

                if (isNewUser && !isCompleted) {
                  addToast({
                    title: 'Google OAuth Successful',
                    message: `Authenticated as ${profile.email}! Please complete your profile.`,
                    type: 'info',
                  });
                  navigate('/app/dashboard', { replace: true });
                } else {
                  addToast({
                    title: 'Welcome Back',
                    message: `Signed in via Google as ${loggedUser.name || profile.email}.`,
                    type: 'success',
                  });
                  await handlePostAuthRedirect(navigate);
                }
              } catch (err) {
                addToast({ title: 'Google Auth Error', message: err.message || 'Unable to authenticate with Google.', type: 'error' });
              } finally {
                setLoading(false);
              }
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (e) {
        console.error('GIS initTokenClient initialization error:', e);
      }
    }

    triggerFallbackGoogleAuth();
  };

  const triggerFallbackGoogleAuth = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      addToast({
        title: 'Work Email Required',
        message: 'Please enter your Google email in the email box above to log in.',
        type: 'warning',
      });
      return;
    }
    const namePart = targetEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    setLoading(true);
    try {
      const { user: loggedUser, isNewUser } = await googleLogin({
        email: targetEmail,
        name: namePart,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      });
      queryClient.clear();
      queryClient.invalidateQueries();

      const isCompleted = typeof window !== 'undefined' && localStorage.getItem('referearn_onboarding_completed') === 'true';

      if (isNewUser && !isCompleted) {
        addToast({
          title: 'Google Auth Successful',
          message: 'Authenticated! Please complete your name & phone number.',
          type: 'info',
        });
        navigate('/app/dashboard', { replace: true });
      } else {
        addToast({
          title: 'Welcome Back',
          message: `Signed in via Google as ${loggedUser.name || targetEmail}.`,
          type: 'success',
        });
        await handlePostAuthRedirect(navigate);
      }
    } catch (err) {
      addToast({ title: 'Google Auth Error', message: err.message || 'Unable to authenticate with Google.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fillAffiliateDemo = () => {
    setEmail('kishore@referearn.io');
    setPassword('password123');
    addToast({ title: 'Affiliate Demo Selected', message: 'Filled publisher email and demo password.', type: 'info' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans text-zinc-950 relative overflow-hidden">
      {/* Left Form Panel (6 Cols) */}
      <div className="flex-1 bg-white bg-grid-pattern flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 border-r border-zinc-200/80 min-h-screen">
        {/* Animated Moving Ambient Background Lights (Blue & Pink) */}
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none animate-glow-blue z-0" />
        <div className="absolute top-1/2 -right-32 w-[420px] h-[420px] bg-pink-400/20 rounded-full blur-3xl pointer-events-none animate-glow-pink z-0" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl pointer-events-none animate-glow-blue z-0" />

        {/* Top Dub-style Logo & User Guide Button */}
        <div className="flex items-center justify-between pt-2 pb-6 relative z-10">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Referitup Logo" className="h-9 w-auto object-contain" />
            <span className="font-extrabold text-2xl tracking-tight text-zinc-950">
              Referitup
            </span>
          </div>
          <Link
            to="/guide"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold transition-subtle border border-zinc-200 shadow-2xs"
            title="Open Platform User Guide without login"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>User Guide</span>
          </Link>
        </div>

        {/* Main Center Auth Form */}
        <div className="w-full max-w-sm mx-auto space-y-6 relative z-10">
          <div className="text-center space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
              Log in to your Referitup account
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

            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700">Password</label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-lg text-sm text-zinc-900 bg-white/90 backdrop-blur-xs placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-subtle"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-zinc-950 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 active:bg-black transition-subtle shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 bg-white/90 backdrop-blur-xs border border-zinc-200/90 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 transition-subtle flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
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
          </div>

          <div className="space-y-2 text-center text-xs">
            <p className="text-zinc-600 font-medium">
              Don't have an account?{' '}
              <Link to="/auth/register" className="font-bold text-zinc-950 hover:underline">
                Sign up
              </Link>
            </p>
            <p>
              <Link
                to="/guide"
                className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 hover:underline text-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Need help? View Platform User Guide</span>
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Terms & Ownership */}
        <div className="text-center text-[11px] text-zinc-400 font-medium pt-6 relative z-10 space-y-1">
          <div>By continuing, you agree to Referitup's Terms of Service and Privacy Policy.</div>
          <div>
            Referitup is a product of{' '}
            <a
              href="https://nkxus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-zinc-600 hover:underline"
            >
              NKXUS Pvt. Ltd. (nkxus.com)
            </a>
            . All rights reserved.
          </div>
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
              Learn how Wispr Flow reached millions more users with Referitup
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
