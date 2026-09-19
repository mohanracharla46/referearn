import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const UserOnboardingModal = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.needsOnboarding && user.role === 'affiliate') {
      setName(user.name || 'Kishore Kumar');
      setEmail(user.email || 'kishore@referearn.io');
      setPhone(user.phone || '9876543210');
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      addToast({ title: 'Incomplete Details', message: 'Please fill in all user details.', type: 'error' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('referearn_onboarding_completed', 'true');
      }

      updateUserProfile({
        name,
        email,
        phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      });

      addToast({
        title: 'Publisher Profile Saved',
        message: 'Your onboarding details (Name, Email, Phone) have been saved.',
        type: 'success',
      });
      setLoading(false);
      setIsOpen(false);
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Complete Your Publisher Profile"
      subtitle="Please verify your personal details to enable payout disbursals and link tracking."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>Your details are saved permanently and required for IMPS & UPI payout disbursals.</span>
        </div>

        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kishore Kumar"
          icon={User}
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="kishore@referearn.io"
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
            className="w-full h-10 text-sm font-bold"
            isLoading={loading}
            icon={ArrowRight}
          >
            Save Details & Enter Portal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
