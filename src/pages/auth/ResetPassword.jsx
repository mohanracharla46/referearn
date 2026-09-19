import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { Lock, ArrowLeft } from 'lucide-react';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      addToast({ title: 'Mismatch', message: 'Passwords do not match.', type: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addToast({ title: 'Password Updated', message: 'Sign in with your new password.', type: 'success' });
      navigate('/auth/login');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950">Set New Password</h2>
          <p className="text-xs text-zinc-500 mt-1">Choose a secure password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <Button variant="primary" type="submit" className="w-full mt-2" isLoading={loading}>
            Update Password
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
          <Link to="/auth/login" className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-950 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
