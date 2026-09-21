import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../context/ToastContext';

export const AdminSettings = () => {
  const { addToast } = useToast();
  const [minWithdrawal, setMinWithdrawal] = useState('500');
  const [refundHoldDays, setRefundHoldDays] = useState('14');
  const [riskSensitivity, setRiskSensitivity] = useState('Medium');

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: affiliateApi.getSettings,
  });

  useEffect(() => {
    if (settings) {
      if (settings.min_withdrawal_threshold) setMinWithdrawal(settings.min_withdrawal_threshold);
      if (settings.refund_hold_days) setRefundHoldDays(settings.refund_hold_days);
      if (settings.risk_sensitivity) setRiskSensitivity(settings.risk_sensitivity);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: affiliateApi.updateSettings,
    onSuccess: () => {
      addToast({ title: 'Platform Config Updated', message: 'System global parameters saved in Laravel.', type: 'success' });
    },
    onError: (err) => {
      addToast({ title: 'Update Failed', message: err.message, type: 'error' });
    }
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      min_withdrawal_threshold: minWithdrawal,
      refund_hold_days: refundHoldDays,
      risk_sensitivity: riskSensitivity,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Global Settings"
        subtitle="Configure system-wide payout minimums, risk thresholds, and default commission policies."
      />

      <div className="max-w-2xl">
        <Card header={<h3 className="text-sm font-semibold text-zinc-900">System Parameters</h3>}>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Minimum Payout Withdrawal Threshold (₹)"
              type="number"
              value={minWithdrawal}
              onChange={(e) => setMinWithdrawal(e.target.value)}
              helperText="Affiliates cannot request withdrawals below this cleared balance."
            />

            <Input
              label="Commission Hold Period (Days)"
              type="number"
              value={refundHoldDays}
              onChange={(e) => setRefundHoldDays(e.target.value)}
              helperText="Standard customer refund window before earnings clear."
            />

            <Select
              label="Anti-Fraud Engine Sensitivity"
              value={riskSensitivity}
              onChange={(e) => setRiskSensitivity(e.target.value)}
              options={[
                { value: 'Low', label: 'Low - Flag obvious botnets' },
                { value: 'Medium', label: 'Medium - Balanced AI heuristics' },
                { value: 'Strict', label: 'Strict - Flag duplicate subnet IPs & fast clicks' },
              ]}
            />

            <Button variant="primary" type="submit" isLoading={updateMutation.isPending}>
              Save Global Configuration
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
