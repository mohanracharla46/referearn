import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      addToast({
        title: 'Reset Instructions Sent',
        message: 'Password reset link sent to your email inbox.',
        type: 'success',
      });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950">Reset Password</h2>
          <p className="text-xs text-zinc-500 mt-1">Enter your email to receive recovery instructions</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              We've dispatched a password reset link to <span className="font-semibold text-zinc-900">{email}</span>. Please check your inbox.
            </p>
            <Link to="/auth/login" className="inline-block text-xs font-semibold text-zinc-950 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Account Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              icon={Mail}
              required
            />
            <Button variant="primary" type="submit" className="w-full mt-2" isLoading={loading}>
              Send Recovery Link
            </Button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
          <Link to="/auth/login" className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-950 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
