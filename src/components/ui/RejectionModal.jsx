import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Select } from './Select';
import { REFERRAL_REJECTION_REASONS } from '../../constants/rejectionReasons';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const RejectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Reject Referral / Account',
  subtitle = 'Select a referral rejection reason to notify the user.',
  targetName = '',
  isLoading = false,
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedReason('');
      setNotes('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReason) {
      setError('Please select a rejection reason before confirming.');
      return;
    }
    setError('');
    const fullReason = notes.trim() ? `${selectedReason} - ${notes.trim()}` : selectedReason;
    onConfirm(fullReason);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-rose-600 font-bold">
          <ShieldAlert className="w-5 h-5" />
          <span>{title}</span>
        </div>
      }
      subtitle={subtitle}
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!selectedReason || isLoading}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
          >
            Confirm Rejection
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {targetName && (
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-700 font-medium">
            Rejecting target: <strong className="text-zinc-900">{targetName}</strong>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-zinc-900 mb-1.5">
            Referral Rejection Reasons <span className="text-rose-500">*</span>
          </label>
          <Select
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              if (e.target.value) setError('');
            }}
            options={[
              { value: '', label: '-- Select Rejection Reason --' },
              ...REFERRAL_REJECTION_REASONS.map((r) => ({
                value: r,
                label: r,
              })),
            ]}
            className="w-full text-xs"
          />
          {error && <p className="text-[11px] text-rose-600 mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">
            Additional Admin Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal or clarifying remarks for the affiliate..."
            rows={2}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        {selectedReason && (
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Visible to User</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              This rejection reason will be stored on the referral status and displayed directly to the affiliate in their dashboard & notifications.
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
};
