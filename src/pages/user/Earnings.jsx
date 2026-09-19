import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { DollarSign, Clock, RotateCcw, Download, Search, CheckCircle2 } from 'lucide-react';

export const UserEarnings = () => {
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const { data: stats } = useQuery({
    queryKey: ['userStats'],
    queryFn: affiliateApi.getUserStats,
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ['chartData'],
    queryFn: affiliateApi.getChartData,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', { status: statusFilter, search }],
    queryFn: () => affiliateApi.getTransactions({ status: statusFilter, search }),
  });

  const handleExportCSV = () => {
    addToast({
      title: 'CSV Statement Exported',
      message: 'Your complete earnings ledger statement downloaded.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Earnings & Commission Ledger"
        subtitle="Detailed breakdown of approved, pending, and cleared affiliate commissions."
        actions={
          <Button variant="outline" size="sm" onClick={handleExportCSV} icon={Download}>
            Export Statement (CSV)
          </Button>
        }
      />

      {/* Top Financial Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Lifetime"
          value={stats?.totalEarnings}
          subtitle="Cumulative cleared revenue"
          icon={DollarSign}
        />
        <StatCard
          title="Approved Revenue"
          value={stats?.totalEarnings - stats?.pendingEarnings}
          subtitle="Ready / already paid"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Clearance"
          value={stats?.pendingEarnings}
          subtitle="14-day hold period"
          icon={Clock}
        />
        <StatCard
          title="Reversed / Refunded"
          value={2999.80}
          subtitle="Customer refund reversals"
          icon={RotateCcw}
        />
      </div>

      {/* Revenue Trend Chart */}
      <ChartCard
        title="Commission Earnings Over Time"
        subtitle="Daily approved commission credits (INR)"
        data={chartData}
        dataKey="earnings"
      />

      {/* Interactive Transactions Ledger Table */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <h3 className="text-sm font-semibold text-zinc-900">Transaction History</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Input
                placeholder="Search transaction or buyer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
                className="w-full sm:w-56"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Reversed', label: 'Reversed' },
                ]}
                className="w-full sm:w-36"
              />
            </div>
          </div>
        }
      >
        <Table headers={['Transaction ID', 'Date', 'Product', 'Buyer', 'Sale Amount', 'Commission', 'Status']}>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-xs font-semibold text-zinc-900">{tx.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(tx.date)}</TableCell>
              <TableCell className="font-medium text-zinc-900">{tx.product}</TableCell>
              <TableCell className="text-xs text-zinc-600">{tx.buyer}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-600">{formatCurrency(tx.amount)}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">
                +{formatCurrency(tx.commission)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    tx.status === 'Approved'
                      ? 'success'
                      : tx.status === 'Pending'
                      ? 'warning'
                      : 'danger'
                  }
                  dot
                >
                  {tx.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
