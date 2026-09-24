import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { DollarSign, Search, UserCheck, X, Wallet, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const REASON_OPTIONS = [
  { value: 'Bonus Amount', label: '🎁 Bonus Amount' },
  { value: 'Promotional Reward', label: '🚀 Promotional Reward' },
  { value: 'Manual Adjustment', label: '⚙️ Manual Adjustment' },
  { value: 'Referral Correction', label: '🔄 Referral Correction' },
  { value: 'Other Admin Credits', label: '🛡️ Other Admin Credits' },
];

export const AddMoneyModal = ({
  isOpen,
  onClose,
  users = [],
  onConfirm,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('Bonus Amount');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Filter users by User ID or Email ID
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const uid = (u.id || '').toLowerCase();
    const uemail = (u.email || '').toLowerCase();
    const uname = (u.name || '').toLowerCase();
    return uid.includes(query) || uemail.includes(query) || uname.includes(query);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onConfirm({
      userId: selectedUser.db_id || selectedUser.id,
      userObj: selectedUser,
      amount: parsedAmount,
      reason,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center font-bold shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Add Money Manually to Wallet
              </h3>
              <p className="text-xs text-emerald-300/80">
                Search user by ID or Email to credit funds & log transaction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Step 1: User Search by ID or Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              1. Search & Select User (User ID or Gmail)
            </label>

            {!selectedUser ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    placeholder="Search by User ID (e.g. usr-1) or Registered Email ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 text-xs"
                    autoFocus
                  />
                </div>

                {/* User Results list */}
                <div className="max-h-40 overflow-y-auto border border-zinc-200 rounded-lg divide-y divide-zinc-100 bg-zinc-50/50">
                  {filteredUsers.length === 0 ? (
                    <div className="p-3 text-xs text-zinc-500 text-center">No user found matching search terms.</div>
                  ) : (
                    filteredUsers.slice(0, 10).map((u) => (
                      <div
                        key={u.id}
                        onClick={() => setSelectedUser(u)}
                        className="p-2.5 hover:bg-emerald-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <span className="font-bold text-zinc-950 block">{u.name}</span>
                          <span className="text-[11px] font-mono text-zinc-500">{u.email}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[10px] bg-zinc-200 text-zinc-800 font-bold px-1.5 py-0.5 rounded block">
                            ID: {u.id}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600">
                            Bal: {formatCurrency(u.availableBalance ?? u.available_balance ?? 0)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Selected User Card */
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950 text-sm">{selectedUser.name}</div>
                    <div className="text-xs text-emerald-700 font-mono">{selectedUser.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-emerald-800 font-mono font-bold">ID: {selectedUser.id}</div>
                    <div className="text-xs font-extrabold text-emerald-700">
                      Bal: {formatCurrency(selectedUser.availableBalance ?? selectedUser.available_balance ?? 0)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="text-xs text-rose-600 hover:text-rose-800 underline font-semibold ml-2"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Amount to Add */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              2. Amount to Add (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-zinc-500 text-sm">₹</span>
              <Input
                type="number"
                step="0.01"
                placeholder="100.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 font-mono text-sm font-bold"
                required
              />
            </div>
          </div>

          {/* Step 3: Purpose / Reason Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              3. Purpose / Reason for Credit
            </label>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              options={REASON_OPTIONS}
              className="w-full text-xs font-semibold"
            />
          </div>

          {/* Step 4: Notes / Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
              4. Admin Remarks / Notes (Optional)
            </label>
            <Input
              placeholder="e.g. Campaign referral performance reward"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!selectedUser || !amount || parseFloat(amount) <= 0}
              isLoading={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Credit Wallet & Log Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
