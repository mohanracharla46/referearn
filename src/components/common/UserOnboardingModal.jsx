import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { handlePostAuthRedirect } from '../../utils/navigation';
import { checkIsPhoneDuplicate, registerUserPhone } from '../../utils/validation';

export const UserOnboardingModal = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
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
      } else {
        const storedTarget = localStorage.getItem('referearn_target_product_link');
        const storedCode = localStorage.getItem('referearn_referrer_code');
        if (storedTarget && storedCode) {
          setReferrerCode(storedCode);
        } else {
          setReferrerCode('');
        }
      }
    }

    const isCompleted =
      typeof window !== 'undefined' &&
      localStorage.getItem('referearn_onboarding_completed') === 'true';

    // Show pop-up only if profile onboarding is NOT completed or user explicitly needs onboarding
    if (!isCompleted && user && (user.needsOnboarding || !user.phone) && user.role === 'affiliate') {
      setName(user?.name && !user.name.toLowerCase().includes('publisher') ? user.name : '');
      setPhone(user?.phone ? user.phone.replace('+91 ', '') : '');
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const isValidPhone = cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name.trim()) {
      addToast({
        title: 'Incomplete Details',
        message: 'Please enter your Full Name.',
        type: 'error',
      });
      return;
    }

    if (!isValidPhone) {
      addToast({
        title: 'Invalid Mobile Number',
        message: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.',
        type: 'error',
      });
      return;
    }

    if (checkIsPhoneDuplicate(cleanPhone, user?.id)) {
      addToast({
        title: 'Phone Number Already Exists',
        message: 'Phone number is already exist.',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+91 ${cleanPhone}`;
      const code = referrerCode || (typeof window !== 'undefined' ? localStorage.getItem('referearn_referrer_code') : null);

      await updateUserProfile({
        name: name.trim(),
        phone: formattedPhone,
        referral_code: code || undefined,
      });

      registerUserPhone(formattedPhone, user?.id);

      if (typeof window !== 'undefined') {
        localStorage.setItem('referearn_onboarding_completed', 'true');
      }

      queryClient.clear();
      queryClient.invalidateQueries();

      addToast({
        title: 'Profile Activated',
        message: `Welcome, ${name}! Your publisher account is activated.`,
        type: 'success',
      });

      setIsOpen(false);
      await handlePostAuthRedirect(navigate);
    } catch (err) {
      addToast({
        title: 'Registration Error',
        message: err.message || 'Unable to update profile.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const authenticatedEmail = user?.email || 'authenticated.user@google.com';

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      showCloseButton={false}
      title="Complete Your Publisher Profile"
      subtitle="Enter your name and 10-digit mobile number to activate your publisher account."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Pre-filled & Verified Google Email Banner */}
        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block leading-none">
                Authenticated Account Email
              </span>
              <span className="text-xs font-bold text-zinc-900 truncate block mt-0.5 font-mono">
                {authenticatedEmail}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono shrink-0">
            ✓ Verified
          </span>
        </div>

        {referrerCode && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Joining via Referral: <span className="font-mono font-bold">{referrerCode}</span>
            </span>
          </div>
        )}

        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rahul Sharma"
          icon={User}
          required
        />

        {/* Direct Mobile Phone Number Input (No Dummy OTP) */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-zinc-700 block">
            Mobile Phone Number (10 Digits)
          </label>
          <Input
            type="tel"
            prefix="+91"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98765 43210"
            icon={Phone}
            required
          />
          {phone && !isValidPhone && (
            <p className="text-[11px] text-rose-600 font-medium">
              Must be a 10-digit Indian mobile number starting with 6, 7, 8, or 9.
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            type="submit"
            className="w-full h-10 text-sm font-bold cursor-pointer"
            isLoading={loading}
            disabled={!name.trim() || !isValidPhone}
          >
            Save Details & Enter Portal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
