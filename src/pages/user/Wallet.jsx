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
import { Wallet as WalletIcon, Clock, Lock, ArrowUpRight, ShieldCheck, CreditCard } from 'lucide-react';

export const UserWallet = () => {
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
        title="Affiliate Wallet & Funds"
        subtitle="Manage your cleared funds, pending holds, and connected payout accounts."
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={ArrowUpRight}>
            Withdraw Available Funds
          </Button>
        }
      />

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Available Balance"
          value={stats?.availableBalance}
          subtitle="Ready for instant payout"
          icon={WalletIcon}
        />
        <StatCard
          title="Pending Balance"
          value={stats?.pendingEarnings}
          subtitle="Clearance in progress"
          icon={Clock}
        />
        <StatCard
          title="Locked Security Hold"
          value={stats?.lockedBalance || 1000.0}
          subtitle="Standard security reserve"
          icon={Lock}
        />
      </div>

      {/* Connected Payout Accounts Section */}
      <Card header={<h3 className="text-sm font-semibold text-zinc-900">Primary Payout Destination</h3>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                DEFAULT UPI
              </span>
              <h4 className="text-sm font-bold text-zinc-900 pt-1">kishore@okaxis</h4>
              <p className="text-xs text-zinc-500">Google Pay / PhonePe VPA</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                SAVINGS BANK
              </span>
              <h4 className="text-sm font-bold text-zinc-900 pt-1">HDFC Bank •••• 4092</h4>
              <p className="text-xs text-zinc-500">IMPS / NEFT Transfer</p>
            </div>
            <CreditCard className="w-5 h-5 text-zinc-500" />
          </div>
        </div>
      </Card>

      {/* Wallet Activity Ledger Table */}
      <Card header={<h3 className="text-sm font-semibold text-zinc-900">Wallet Movement History</h3>}>
        <Table headers={['Reference ID', 'Date', 'Method', 'Destination', 'Amount', 'Status']}>
          {withdrawals.map((wd) => (
            <TableRow key={wd.id}>
              <TableCell className="font-mono text-xs font-semibold text-zinc-900">{wd.reference}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(wd.requestedAt)}</TableCell>
              <TableCell className="font-medium text-zinc-900">{wd.method}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-600">{wd.destination}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">
                -{formatCurrency(wd.amount)}
              </TableCell>
              <TableCell>
                <Badge variant={wd.status === 'Completed' ? 'success' : 'warning'} dot>
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
        availableBalance={stats?.availableBalance || 7500.0}
      />
    </div>
  );
};
