import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Target, Award, CheckCircle2, Users } from 'lucide-react';

export const UserTargets = () => {
  const { data: target } = useQuery({
    queryKey: ['target'],
    queryFn: affiliateApi.getTarget,
  });

  const { data: referrals = [] } = useQuery({
    queryKey: ['referrals'],
    queryFn: affiliateApi.getReferrals,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incentive Targets & Milestone Bonuses"
        subtitle="Achieve conversion targets to unlock cash bonuses credited straight to your available balance."
      />

      {/* Active Sprint Target Box */}
      <Card
        className="bg-white border-zinc-200 p-6 shadow-xs"
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-zinc-950" />
              <span className="text-base font-bold text-zinc-950">Active Sprint Milestone</span>
            </div>
            <Badge variant="dark" className="text-xs px-2.5 py-1 font-mono font-bold">
              REWARD: ₹5,000.00
            </Badge>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-950 tracking-tight">{target?.title}</h2>
              <p className="text-xs text-zinc-500 mt-1 font-medium">
                Reach {target?.targetConversions} converted customer sales across any marketplace product.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block font-mono">Bonus Reward</span>
              <span className="financial-num text-2xl font-black text-zinc-950">
                {formatCurrency(target?.rewardAmount || 5000)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-zinc-700">Sprint Progress</span>
              <span className="text-zinc-950 font-bold font-mono">
                {target?.percentage}% ({target?.currentConversions} / {target?.targetConversions} Sales)
              </span>
            </div>
            <div className="w-full bg-zinc-100 h-3.5 rounded-full overflow-hidden border border-zinc-200">
              <div
                className="bg-zinc-950 h-full rounded-full transition-all duration-500"
                style={{ width: `${target?.percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
              <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px] block">Remaining Sales Required</span>
              <span className="text-base font-extrabold text-zinc-950 block mt-0.5">
                {target?.remainingConversions} conversions
              </span>
            </div>
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
              <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px] block">Sprint Deadline</span>
              <span className="text-base font-mono font-bold text-zinc-950 block mt-0.5">
                {formatDate(target?.deadline)}
              </span>
            </div>
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
              <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px] block">Milestone Status</span>
              <span className="text-base font-bold text-amber-700 block mt-0.5">In Progress</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Referred Clients Contributing to Sprint Target Table */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-950" />
              <h3 className="text-sm font-bold text-zinc-950">Referred Clients Contributing to Sprint Target</h3>
            </div>
            <Badge variant="success" className="font-mono text-[10px]">
              38 CONVERSIONS COUNTED
            </Badge>
          </div>
        }
      >
        <Table headers={['Referred Customer', 'Product Purchased', 'Conversion Date', 'Clicks Tracked', 'Sprint Target Credit', 'Commission Earned']}>
          {referrals.map((ref) => (
            <TableRow key={ref.id}>
              <TableCell>
                <div className="font-bold text-zinc-950">{ref.name}</div>
                <div className="text-[11px] font-mono text-zinc-500">{ref.email}</div>
              </TableCell>
              <TableCell className="font-medium text-zinc-900">{ref.product}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(ref.date)}</TableCell>
              <TableCell className="font-mono text-xs font-semibold">{ref.clicks} clicks</TableCell>
              <TableCell>
                <Badge variant={ref.status.includes('Converted') ? 'success' : 'info'} dot>
                  {ref.status.includes('Converted') ? '+1 Sprint Credit' : 'Pending Verification'}
                </Badge>
              </TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">
                {formatCurrency(ref.totalEarned)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Past Completed Milestones */}
      <Card header={<h3 className="text-sm font-semibold text-zinc-900">Completed Milestone Archive</h3>}>
        <div className="space-y-3">
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-zinc-900">August 2026 Founder Challenge</h4>
                <p className="text-[11px] text-zinc-500">Achieved 25 conversions • Unlocked ₹2,500.00 bonus</p>
              </div>
            </div>
            <Badge variant="success" className="font-semibold">COMPLETED & PAID</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
