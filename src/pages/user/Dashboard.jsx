import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { QuickWithdrawalModal } from '../../components/common/QuickWithdrawalModal';
import {
  DollarSign,
  Wallet,
  Clock,
  Users,
  UserCheck,
  Target,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', user?.email],
    queryFn: affiliateApi.getUserStats,
    refetchInterval: 3000,
  });

  const { data: target } = useQuery({
    queryKey: ['target', user?.email],
    queryFn: affiliateApi.getTarget,
    refetchInterval: 5000,
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ['chartData'],
    queryFn: affiliateApi.getChartData,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', user?.email],
    queryFn: () => affiliateApi.getTransactions(),
    refetchInterval: 3000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => affiliateApi.getProducts(),
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard Overview" subtitle="Real-time financial metrics and affiliate performance" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Heading & Quick Actions */}
      <PageHeader
        title="Dashboard Overview"
        subtitle="Monitor cleared revenue, active conversions, and campaign growth."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsWithdrawModalOpen(true)}
            icon={ArrowUpRight}
          >
            Withdraw Earnings
          </Button>
        }
      />

      {/* Referral Program Notice Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-amber-950 to-zinc-950 text-white p-4 rounded-xl border border-rose-800/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
              Referral Program Ends on 15 October 2026
            </span>
            <p className="text-[11px] text-rose-200/80">
              Achieve your referral targets before 15 October 2026 to claim maximum milestone bonuses.
            </p>
          </div>
        </div>
        <div className="bg-zinc-900/80 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 shrink-0 font-mono">
          Minimum Withdrawal: ₹50
        </div>
      </div>

      {/* Primary KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Earnings"
          value={stats?.totalEarnings}
          change={stats?.earningsGrowth}
          subtitle="Lifetime cleared revenue"
          icon={DollarSign}
          tooltip="Total commission earnings verified and credited."
        />

        <StatCard
          title="Available Balance"
          value={stats?.availableBalance}
          subtitle="Ready for instant withdrawal"
          icon={Wallet}
          tooltip="Balance ready to transfer to your UPI or Bank."
        />

        <StatCard
          title="Pending Earnings"
          value={stats?.pendingEarnings}
          subtitle="Awaiting refund window clearance"
          icon={Clock}
          tooltip="Earnings in standard 14-day hold period."
        />

        <StatCard
          title="This Month"
          value={stats?.thisMonthEarnings}
          change={18.5}
          subtitle="September 2026 revenue"
          icon={DollarSign}
        />

        <StatCard
          title="Total Referrals"
          value={stats?.totalReferrals}
          isCurrency={false}
          change={stats?.referralGrowth}
          subtitle="Total referred customers"
          icon={Users}
        />

        <StatCard
          title="Active Conversions"
          value={stats?.activeReferrals}
          isCurrency={false}
          subtitle={`${stats?.conversionRate}% conversion rate`}
          icon={UserCheck}
        />
      </div>

      {/* Middle Section: Chart & Target Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart (2 Cols) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Performance Trend"
            subtitle="Daily commission earnings overview (INR)"
            data={chartData}
            dataKey="earnings"
            xAxisKey="day"
          />
        </div>

        {/* Target Milestone Progress Card (1 Col) */}
        <div className="flex flex-col justify-between">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-zinc-950" />
                  <span className="text-sm font-semibold text-zinc-900">Active Sprint Target</span>
                </div>
                <Badge variant="dark">{formatCurrency(target?.rewardAmount || 0)} BONUS</Badge>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">{target?.title}</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Complete {target?.targetConversions} conversions before month end.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-600">Progress</span>
                  <span className="text-zinc-950">{target?.percentage}% ({target?.currentConversions}/{target?.targetConversions})</span>
                </div>
                <div className="w-full bg-zinc-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-zinc-950 h-full rounded-full transition-all duration-300"
                    style={{ width: `${target?.percentage}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Remaining to unlock:</span>
                  <span className="font-bold text-zinc-900">{target?.remainingConversions} sales</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Deadline:</span>
                  <span className="font-mono text-zinc-800">{formatDate(target?.deadline)}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/app/targets')}
              >
                View Milestone Details
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions & Top Marketplace Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table (2 Cols) */}
        <div className="lg:col-span-2">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <h3 className="text-sm font-semibold text-zinc-900">Recent Commission Transactions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/app/earnings')}
                  className="text-xs"
                >
                  View All
                </Button>
              </div>
            }
          >
            <Table headers={['Date', 'Product', 'Commission', 'Status']}>
              {transactions.slice(0, 5).map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs text-zinc-500">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-zinc-900">{tx.product}</div>
                    <div className="text-[11px] text-zinc-500">{tx.buyer}</div>
                  </TableCell>
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
                    {(tx.rejection_reason || tx.rejectionReason) && (
                      <div className="text-[11px] text-rose-600 font-medium mt-1 leading-tight">
                        Reason: {tx.rejection_reason || tx.rejectionReason}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Card>
        </div>

        {/* Top Products Quick View (1 Col) */}
        <div>
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <h3 className="text-sm font-semibold text-zinc-900">Top Performing Products</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/app/refer')}
                >
                  Refer & Earn
                </Button>
              </div>
            }
          >
            <div className="space-y-3">
              {products.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 border border-zinc-200 rounded-md hover:border-zinc-300 transition-subtle flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{prod.name}</h4>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Comm: {prod.commission} ({formatCurrency(prod.commissionValue)})
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/app/product/${prod.id}`)}
                  >
                    View Campaign
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Global Modals */}
      <QuickWithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={stats?.availableBalance ?? 0}
      />
    </div>
  );
};
