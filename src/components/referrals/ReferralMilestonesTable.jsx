import React from 'react';
import { Card } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Award, Clock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const REFERRAL_MILESTONES = [
  { referrals: 4, referralEarnings: 40, milestoneBonus: 10, totalEarnings: 50 },
  { referrals: 12, referralEarnings: 120, milestoneBonus: 30, totalEarnings: 150 },
  { referrals: 20, referralEarnings: 200, milestoneBonus: 50, totalEarnings: 250 },
  { referrals: 25, referralEarnings: 250, milestoneBonus: 70, totalEarnings: 320 },
  { referrals: 40, referralEarnings: 400, milestoneBonus: 100, totalEarnings: 500 },
  { referrals: 66, referralEarnings: 660, milestoneBonus: 140, totalEarnings: 800 },
  { referrals: 100, referralEarnings: 1000, milestoneBonus: 750, totalEarnings: 1750 },
];

export const ReferralMilestonesTable = ({ currentReferrals = 0 }) => {
  return (
    <div className="space-y-4">
      {/* Referral Program Notice Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-amber-950 to-zinc-950 text-white p-4 rounded-xl border border-rose-800/40 shadow-md space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0 text-rose-300 font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-tight text-white">
                  Referral Program Ends on 15 October 2026
                </span>
                <span className="text-[10px] bg-rose-500 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full animate-pulse">
                  LIMITED TIME
                </span>
              </div>
              <p className="text-xs text-rose-200/80">
                Complete your target milestones before 15 October 2026 to unlock total cash bonus rewards up to ₹1,750.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-amber-500/30 px-3.5 py-2 rounded-lg text-right shrink-0">
            <span className="text-[10px] text-zinc-400 uppercase font-mono block font-semibold">Withdrawal Requirement</span>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Minimum Withdrawal Amount: ₹50
            </span>
          </div>
        </div>
      </div>

      {/* Milestone Rewards Matrix Table */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-zinc-950">Referral Milestone Program & Rewards Matrix</h3>
            </div>
            <Badge variant="dark" className="font-mono text-xs font-bold">
              YOUR PROGRESS: {currentReferrals} REFERRALS
            </Badge>
          </div>
        }
      >
        <Table headers={['Milestone Referrals', 'Referral Earnings', 'Milestone Bonus', 'Total Earnings', 'Achievement Status']}>
          {REFERRAL_MILESTONES.map((m, idx) => {
            const isUnlocked = currentReferrals >= m.referrals;
            const isNext = !isUnlocked && (idx === 0 || currentReferrals >= REFERRAL_MILESTONES[idx - 1].referrals);

            return (
              <TableRow key={m.referrals} className={isNext ? 'bg-amber-50/60 font-semibold' : isUnlocked ? 'bg-emerald-50/30' : ''}>
                <TableCell className="font-bold text-zinc-950">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-zinc-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                      {m.referrals}
                    </span>
                    <span>{m.referrals} Referrals</span>
                  </div>
                </TableCell>

                <TableCell className="financial-num font-medium text-zinc-800">
                  {formatCurrency(m.referralEarnings)}
                </TableCell>

                <TableCell className="financial-num font-bold text-indigo-700">
                  + {formatCurrency(m.milestoneBonus)}
                </TableCell>

                <TableCell className="financial-num font-extrabold text-emerald-600 text-sm">
                  {formatCurrency(m.totalEarnings)}
                </TableCell>

                <TableCell>
                  {isUnlocked ? (
                    <Badge variant="success" className="font-bold">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Unlocked & Credited
                    </Badge>
                  ) : isNext ? (
                    <Badge variant="warning" className="font-bold">
                      Target Level ({m.referrals - currentReferrals} left)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-zinc-500">
                      Locked ({m.referrals} Refs)
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </div>
  );
};
