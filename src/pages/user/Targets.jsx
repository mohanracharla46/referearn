import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Target, Award, CheckCircle2, Users } from 'lucide-react';
import { SprintMilestoneWidget } from '../../components/common/SprintMilestoneWidget';
import { ReferralMilestonesTable } from '../../components/referrals/ReferralMilestonesTable';

export const UserTargets = () => {
  const { data: target } = useQuery({
    queryKey: ['target'],
    queryFn: affiliateApi.getTarget,
  });

  const { data: allTargets = [] } = useQuery({
    queryKey: ['allTargets'],
    queryFn: affiliateApi.getAllTargets,
  });

  const { data: referrals = [] } = useQuery({
    queryKey: ['referrals'],
    queryFn: affiliateApi.getReferrals,
  });

  const completedMilestones = allTargets.filter((t) => t.completed);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incentive Targets & Milestone Bonuses"
        subtitle="Referral Program Ends on 15 October 2026. Minimum withdrawal amount: ₹50."
      />

      {/* Referral Milestone Rewards Table */}
      <ReferralMilestonesTable currentReferrals={referrals.filter(r => r.status?.includes('Converted')).length} />

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
              REWARD: {formatCurrency(target?.rewardAmount || 0)}
            </Badge>
          </div>
        }
      >
        <SprintMilestoneWidget
          target={target}
          showRulesButton={false}
        />
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
              {target?.currentConversions ?? referrals.filter((r) => r.status?.includes('Converted')).length} CONVERSIONS COUNTED
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
          {completedMilestones.length === 0 ? (
            <div className="p-4 text-xs text-zinc-500 text-center">No completed milestones yet.</div>
          ) : (
            completedMilestones.map((cm) => (
              <div key={cm.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{cm.title}</h4>
                    <p className="text-[11px] text-zinc-500">
                      Achieved {cm.conversions} conversions • Unlocked {formatCurrency(cm.reward)} bonus
                    </p>
                  </div>
                </div>
                <Badge variant="success" className="font-semibold">COMPLETED & PAID</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
