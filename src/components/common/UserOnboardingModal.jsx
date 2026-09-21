import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export const UserOnboardingModal = () => {
  const { user, updateUserProfile, login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [referrerCode, setReferrerCode] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      if (refCode) {
        localStorage.setItem('referearn_referrer_code', refCode);
        setReferrerCode(refCode);
        setIsOpen(true);
        return;
      }
    }

    const isCompleted =
      typeof window !== 'undefined' &&
      localStorage.getItem('referearn_onboarding_completed') === 'true';

    if (!isCompleted || (user && user.needsOnboarding && user.role === 'affiliate')) {
      setName(user?.name && user.name !== 'Kishore Kumar' ? user.name : '');
      setEmail(user?.email && user.email !== 'kishore@referearn.io' ? user.email : '');
      setPhone(user?.phone ? user.phone.replace('+91 ', '') : '');
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name || !email || !phone) {
      addToast({
        title: 'Incomplete Details',
        message: 'Please fill in all user details (Name, Email, and Phone).',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const refCode = referrerCode || localStorage.getItem('referearn_referrer_code') || undefined;
      const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone.trim()}`;

      // Register or login with the popup entered details
      let activeUser = null;
      try {
        activeUser = await register({
          name,
          email,
          phone: formattedPhone,
          password: 'password123',
          referral_code: refCode,
        });
      } catch (regErr) {
        activeUser = await login(email, 'password123');
        if (activeUser) {
          await updateUserProfile({
            name,
            email,
            phone: formattedPhone,
          });
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('referearn_onboarding_completed', 'true');
      }

      // Reset all query caches so the new user's dashboard and sidebar reflect their data
      queryClient.clear();
      queryClient.invalidateQueries();

      addToast({
        title: 'Publisher Account Ready',
        message: `Welcome, ${name}! Your publisher account and referral dashboard are activated.`,
        type: 'success',
      });

      setIsOpen(false);
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      if (typeof window !== 'undefined') {
        localStorage.setItem('referearn_onboarding_completed', 'true');
      }
      setIsOpen(false);
      navigate('/app/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      showCloseButton={false}
      title="Complete Your Publisher Profile"
      subtitle="Enter your details to create your affiliate account and access your dashboard."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
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
          <span>Your details are saved permanently and required for IMPS & UPI payout disbursals.</span>
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
          >
            Save Details & Enter Portal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
