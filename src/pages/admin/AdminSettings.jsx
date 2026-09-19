import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../context/ToastContext';
import { Sliders, ShieldCheck } from 'lucide-react';

export const AdminSettings = () => {
  const { addToast } = useToast();
  const [minWithdrawal, setMinWithdrawal] = useState('500');
  const [refundHoldDays, setRefundHoldDays] = useState('14');
  const [riskSensitivity, setRiskSensitivity] = useState('Medium');

  const handleSave = (e) => {
    e.preventDefault();
    addToast({ title: 'Platform Config Updated', message: 'System global parameters updated.', type: 'success' });
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

            <Button variant="primary" type="submit">
              Save Global Configuration
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
