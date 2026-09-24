import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Sparkles, Phone } from 'lucide-react';

import { checkIsPhoneDuplicate, registerUserPhone } from '../../utils/validation';
import { handlePostAuthRedirect, PRIMARY_REFERRAL_REDIRECT_URL } from '../../utils/navigation';

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [referrerCode, setReferrerCode] = useState('');

  useEffect(() => {
    const directUrlRef = searchParams.get('ref') || params.code;
    const urlRef = directUrlRef || localStorage.getItem('referearn_referrer_code') || '';
    if (urlRef) {
      setReferrerCode(urlRef);
      localStorage.setItem('referearn_referrer_code', urlRef);
    }
    if (directUrlRef) {
      if (!localStorage.getItem('referearn_target_product_link')) {
        localStorage.setItem('referearn_target_product_link', PRIMARY_REFERRAL_REDIRECT_URL);
      }
    }
  }, [searchParams, params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone && checkIsPhoneDuplicate(phone)) {
      addToast({
        title: 'Phone Number Already Exists',
        message: 'Phone number is already exist.',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        phone,
        password,
        referral_code: referrerCode || undefined,
      });
      registerUserPhone(phone);
      addToast({
        title: 'Account Created',
        message: referrerCode
          ? `Welcome to Referitup! Linked to partner ${referrerCode}.`
          : 'Welcome to Referitup! Your affiliate dashboard is ready.',
        type: 'success',
      });
      await handlePostAuthRedirect(navigate);
    } catch (err) {
      addToast({
        title: 'Registration Error',
        message: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white border border-zinc-200/90 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Editorial Branding Panel */}
        <div className="lg:col-span-5 bg-zinc-950 text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="Referitup Logo" className="w-9 h-9 rounded-lg bg-white p-0.5 object-contain shrink-0" />
              <div>
                <span className="font-bold text-lg text-white block leading-none">Referitup</span>
                <span className="text-[10px] text-zinc-400 font-mono tracking-widest block mt-1 uppercase font-semibold">
                  Publisher Signup
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Start Earning High Recurring Commissions
              </h1>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Promote top-tier enterprise SaaS, payment gateways, and cloud software with 90-day tracking windows.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Payout Activation</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Create Publisher Account</h2>
              <p className="text-xs text-zinc-600 mt-1 font-medium">
                Fill in your details to get your instant referral link and access the marketplace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {referrerCode && (
                <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-in fade-in">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Referred by Partner: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">{referrerCode}</span>
                  </span>
                </div>
              )}

              <Input
                label="Full Name / Company Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohit Sharma"
                icon={User}
                required
              />

              <Input
                label="Work Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohit@example.com"
                icon={Mail}
                required
              />

              <Input
                label="Mobile Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                icon={Phone}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                required
              />

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero registration fees. Instant access to all marketplace products.</span>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-full mt-2 h-10 text-sm font-semibold"
                isLoading={loading}
                icon={ArrowRight}
              >
                Complete Registration
              </Button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-200 text-center text-xs text-zinc-600 font-medium">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-bold text-zinc-950 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
