import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ToastContainer } from '../../components/ui/Toast';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Gift,
  CheckCircle2,
} from 'lucide-react';

export const JoinReferral = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, login, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const [referrerCode, setReferrerCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get('ref') || params.code || localStorage.getItem('referearn_referrer_code') || 'REF-KISHORE-2026';
    setReferrerCode(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('referearn_referrer_code', code);
    }
  }, [searchParams, params]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      addToast({
        title: 'Details Required',
        message: 'Please provide your Name, Email, and Phone number.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+91') ? phone.trim() : `+91 ${phone.trim()}`;
      const code = referrerCode || localStorage.getItem('referearn_referrer_code') || undefined;

      let activeUser = null;
      try {
        activeUser = await register({
          name: name.trim(),
          email: email.trim(),
          phone: formattedPhone,
          password: 'password123',
          referral_code: code,
        });
      } catch (regErr) {
        activeUser = await login(email.trim(), 'password123');
        if (activeUser) {
          await updateUserProfile({
            name: name.trim(),
            email: email.trim(),
            phone: formattedPhone,
          });
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('referearn_onboarding_completed', 'true');
      }

      // Wipe old session query caches
      queryClient.clear();
      queryClient.invalidateQueries();

      addToast({
        title: 'Account Activated!',
        message: `Welcome, ${name}! Your partner dashboard is ready.`,
        type: 'success',
      });

      setIsModalOpen(false);
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      addToast({
        title: 'Signup Failed',
        message: err.message || 'Unable to complete referral registration.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute -top-32 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none animate-glow-blue z-0" />
      <div className="absolute top-1/2 -right-32 w-[420px] h-[420px] bg-pink-500/20 rounded-full blur-3xl pointer-events-none animate-glow-pink z-0" />

      {/* Header */}
      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 font-black text-sm flex items-center justify-center tracking-tighter shadow-sm">
            re
          </div>
          <span className="font-extrabold text-2xl tracking-tighter text-white lowercase">
            referearn
          </span>
        </div>

        <button
          onClick={() => navigate('/auth/login')}
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-subtle"
        >
          Sign in to existing account →
        </button>
      </header>

      {/* Center Landing Hero */}
      <main className="max-w-2xl mx-auto text-center space-y-6 relative z-10 py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive VIP Invitation Link</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          You've been invited to join ReferEarn
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Access high-payout SaaS affiliate campaigns, track link conversions with 90-day cookies, and earn instant ₹10.00 referral commissions.
        </p>

        {referrerCode && (
          <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl max-w-md mx-auto flex items-center justify-between text-xs text-zinc-300">
            <span className="text-zinc-400">Referred by Partner:</span>
            <span className="font-mono font-bold bg-zinc-800 text-white px-2.5 py-1 rounded border border-zinc-700">
              {referrerCode}
            </span>
          </div>
        )}

        <div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            icon={ArrowRight}
            className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold px-8 shadow-lg"
          >
            Open Registration Popup
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-zinc-500 relative z-10">
        © 2026 ReferEarn Platform. Zero registration fee. Instant wallet activation.
      </footer>

      {/* Referral Onboarding Modal Popup */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showCloseButton={true}
        title="Claim Your Partner Account"
        subtitle="Enter your details below to activate your publisher workspace."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-zinc-950">
          {referrerCode && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Joining via Referral: <span className="font-mono font-bold">{referrerCode}</span>
              </span>
            </div>
          )}

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Enter your name, email, and phone to complete instant onboarding.</span>
          </div>

          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            icon={User}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. rahul@example.com"
            icon={Mail}
            required
          />

          <Input
            label="Mobile Phone Number"
            type="tel"
            prefix="+91"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98765 43210"
            icon={Phone}
            required
          />

          <div className="pt-2">
            <Button
              variant="primary"
              type="submit"
              className="w-full h-10 text-sm font-bold cursor-pointer"
              isLoading={loading}
              icon={ArrowRight}
            >
              Save Details & Enter Portal
            </Button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
};
