import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const AdminWithdrawals = () => {
  const { addToast } = useToast();
  const [withdrawals, setWithdrawals] = useState([
    { id: 'wd-805', requestedAt: '2026-09-18T16:00:00Z', affiliate: 'Kishore Kumar', amount: 2500.0, method: 'UPI Instant Payout', destination: 'kishore@okaxis', status: 'Pending Approval' },
    { id: 'wd-801', requestedAt: '2026-09-15T10:00:00Z', affiliate: 'Aditya Rao', amount: 15000.0, method: 'HDFC IMPS', destination: 'HDFC0001234 •••• 9841', status: 'Completed' },
    { id: 'wd-802', requestedAt: '2026-09-01T14:30:00Z', affiliate: 'Sneha Kulkarni', amount: 10000.0, method: 'UPI Payout', destination: 'sneha@okicici', status: 'Completed' },
  ]);

  const handleApprovePayout = (id) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'Completed' } : w))
    );
    addToast({ title: 'Payout Processed', message: `Withdrawal ${id} executed via gateway API.`, type: 'success' });
  };

  const handleBatchExecution = () => {
    setWithdrawals((prev) => prev.map((w) => ({ ...w, status: 'Completed' })));
    addToast({ title: 'Batch Payout Executed', message: 'All pending withdrawal payouts dispatched.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payout Execution & Disbursal Queue"
        subtitle="Process pending affiliate withdrawal requests, trigger gateway disbursals, and handle bank IMPS queues."
        actions={
          <Button variant="primary" size="sm" onClick={handleBatchExecution} icon={ArrowUpRight} className="w-full sm:w-auto text-xs font-bold">
            Execute Pending Batch Disbursal
          </Button>
        }
      />

      <Card>
        <Table headers={['Request ID', 'Timestamp', 'Affiliate Publisher', 'Method & Destination', 'Amount', 'Status', 'Actions']}>
          {withdrawals.map((wd) => (
            <TableRow key={wd.id}>
              <TableCell className="font-mono text-xs font-semibold">{wd.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500 whitespace-nowrap">{formatDate(wd.requestedAt, true)}</TableCell>
              <TableCell className="font-bold text-zinc-950 whitespace-nowrap">{wd.affiliate}</TableCell>
              <TableCell className="min-w-[180px]">
                <div className="font-medium text-zinc-900 text-xs sm:text-sm">{wd.method}</div>
                <div className="text-[11px] font-mono text-zinc-500 truncate">{wd.destination}</div>
              </TableCell>
              <TableCell className="financial-num font-bold text-zinc-950 whitespace-nowrap">{formatCurrency(wd.amount)}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={wd.status === 'Completed' ? 'success' : 'warning'} dot>
                  {wd.status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {wd.status === 'Pending Approval' && (
                  <Button variant="primary" size="sm" onClick={() => handleApprovePayout(wd.id)} className="text-xs font-semibold">
                    Approve & Disburse
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
