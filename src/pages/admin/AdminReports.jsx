import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../context/ToastContext';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

export const AdminReports = () => {
  const { addToast } = useToast();

  const handleDownload = (reportName) => {
    addToast({ title: 'Report Generated', message: `${reportName} exported to CSV successfully.`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Financial Reports"
        subtitle="Generate platform GMV summaries, tax audit ledgers, and affiliate commission reports."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card header={<h3 className="text-sm font-semibold text-zinc-900">GMV & Revenue Report</h3>}>
          <div className="space-y-4">
            <p className="text-xs text-zinc-600">Complete summary of order GMV, platform retention, and net profit margins.</p>
            <Select label="Date Range" options={[{ value: 'sep-2026', label: 'September 2026' }, { value: 'q3-2026', label: 'Q3 2026' }]} />
            <Button variant="primary" className="w-full" onClick={() => handleDownload('GMV_Revenue_Sep2026')} icon={Download}>
              Export GMV Ledger (CSV)
            </Button>
          </div>
        </Card>

        <Card header={<h3 className="text-sm font-semibold text-zinc-900">Affiliate Payout & Tax Audit</h3>}>
          <div className="space-y-4">
            <p className="text-xs text-zinc-600">Disbursal audit log containing TDS deductions, UPI transaction IDs, and bank refs.</p>
            <Select label="Disbursal Quarter" options={[{ value: 'q3', label: 'Q3 FY26' }]} />
            <Button variant="primary" className="w-full" onClick={() => handleDownload('Payout_Tax_Audit_Q3')} icon={Download}>
              Export Tax Audit (CSV)
            </Button>
          </div>
        </Card>

        <Card header={<h3 className="text-sm font-semibold text-zinc-900">Anti-Fraud & Risk Digest</h3>}>
          <div className="space-y-4">
            <p className="text-xs text-zinc-600">Complete history of blocked botnet IPs, self-referral flags, and risk incidents.</p>
            <Select label="Filter Risk Level" options={[{ value: 'high', label: 'High Risk (Score >80)' }]} />
            <Button variant="primary" className="w-full" onClick={() => handleDownload('Fraud_Risk_Log')} icon={Download}>
              Export Risk Log (PDF)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
