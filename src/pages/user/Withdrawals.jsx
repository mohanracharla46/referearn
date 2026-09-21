import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { QuickWithdrawalModal } from '../../components/common/QuickWithdrawalModal';
import { ArrowUpRight, Wallet, AlertCircle, CheckCircle2, Landmark } from 'lucide-react';

export const UserWithdrawals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['userStats'],
    queryFn: affiliateApi.getUserStats,
  });

  const { data: withdrawals = [] } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: affiliateApi.getWithdrawals,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payout Withdrawals"
        subtitle="Request instant payouts to your bank account or review past withdrawal history."
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={ArrowUpRight}>
            New Withdrawal Request
          </Button>
        }
      />

      {/* Threshold & Available Balance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Available Balance"
          value={stats?.availableBalance}
          subtitle="Ready to withdraw"
          icon={Wallet}
        />
        <Card className="flex flex-col justify-between">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Minimum Threshold</span>
          <div className="financial-num text-2xl font-bold text-zinc-950 mt-1">₹500.00</div>
          <span className="text-xs text-zinc-500 mt-2">Zero platform fees on standard UPI</span>
        </Card>
        <Card className="flex flex-col justify-between">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Payout Processing SLA</span>
          <div className="text-lg font-bold text-zinc-950 mt-1">Instant to 4 Hours</div>
          <span className="text-xs text-emerald-700 font-semibold mt-2">100% Payout Reliability SLA</span>
        </Card>
      </div>

      {/* Withdrawal History Table */}
      <Card header={<h3 className="text-sm font-semibold text-zinc-900">Withdrawal Request History</h3>}>
        <Table headers={['Request ID', 'Date & Time', 'Method', 'Destination', 'Amount', 'Reference', 'Status']}>
          {withdrawals.map((wd) => (
            <TableRow key={wd.id}>
              <TableCell className="font-mono text-xs font-semibold text-zinc-900">{wd.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(wd.requestedAt, true)}</TableCell>
              <TableCell className="font-medium text-zinc-900">{wd.method}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-600">{wd.destination}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">
                {formatCurrency(wd.amount)}
              </TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{wd.reference}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    wd.status === 'Completed'
                      ? 'success'
                      : wd.status === 'Pending'
                      ? 'warning'
                      : 'danger'
                  }
                  dot
                >
                  {wd.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <QuickWithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableBalance={stats?.availableBalance ?? 0}
      />
    </div>
  );
};
