import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { affiliateApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { Landmark, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const QuickWithdrawalModal = ({ isOpen, onClose, availableBalance = 0, onSuccess }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [amount, setAmount] = useState('10');
  const [method, setMethod] = useState('UPI Instant Payout');
  const [destination, setDestination] = useState(user?.upi_id || user?.upiId || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.upi_id || user?.upiId) {
      setDestination(user.upi_id || user.upiId);
    }
  }, [user]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      addToast({ title: 'Invalid Amount', message: 'Please enter a valid numeric amount.', type: 'error' });
      return;
    }
    if (numAmount < 10) {
      addToast({ title: 'Minimum Threshold', message: 'Minimum withdrawal amount is ₹10.00', type: 'warning' });
      return;
    }
    if (numAmount > availableBalance) {
      addToast({ title: 'Insufficient Balance', message: 'Requested amount exceeds available balance.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await affiliateApi.requestWithdrawal({
        amount: numAmount,
        method,
        destination,
      });

      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      addToast({
        title: 'Payout Request Submitted',
        message: `₹${numAmount.toFixed(2)} has been queued for payout.`,
        type: 'success',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      addToast({ title: 'Payout Error', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Payout Withdrawal"
      subtitle="Transfer your cleared affiliate earnings directly to your verified bank account or UPI."
    >
      <form onSubmit={handleWithdraw} className="space-y-4">
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Available for Payout</span>
            <div className="financial-num text-xl font-bold text-zinc-950 mt-0.5">
              {formatCurrency(availableBalance)}
            </div>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>

        <Input
          label="Withdrawal Amount (₹)"
          type="number"
          prefix="₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          helperText="Minimum withdrawal: ₹10.00"
          required
        />

        <Select
          label="Payment Payout Method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          options={[
            { value: 'UPI Instant Payout', label: 'UPI Instant Payout (Zero fee, instant)' },
            { value: 'HDFC Bank IMPS', label: 'HDFC Bank IMPS (Direct IMPS Transfer)' },
            { value: 'NEFT Payout', label: 'Standard Bank NEFT (Same day batch)' },
          ]}
        />

        <Input
          label="Destination VPA / Account Number"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. username@okicici or Bank Account Number"
          icon={Landmark}
          required
        />

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-200">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={loading} icon={ArrowUpRight}>
            Confirm Payout Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
