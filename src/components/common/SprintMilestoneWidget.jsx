import React from 'react';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Trophy, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SprintMilestoneWidget = ({
  target,
  product,
  productReferrals = [],
  showRulesButton = true,
  compact = false,
}) => {
  const navigate = useNavigate();

  const targetGoal = target?.targetConversions || 7;
  const currentSales = target?.currentConversions || 0;
  const rewardAmount = target?.rewardAmount || 30;
  const remainingConversions = target?.remainingConversions ?? Math.max(0, targetGoal - currentSales);
  const percentage = target?.percentage ?? Math.min(100, Math.round((currentSales / targetGoal) * 100));
  const isCompleted = target?.completed || currentSales >= targetGoal;

  // Calculate dynamic checkpoints based on targetGoal
  const cp1Sales = targetGoal === 7 ? 2 : Math.max(1, Math.round(targetGoal * 0.2));
  const cp2Sales = targetGoal === 7 ? 5 : Math.max(2, Math.round(targetGoal * 0.5));

  // Determine actual product clicks and conversions
  const trackedClicks = productReferrals.reduce((sum, r) => sum + (Number(r.clicks) || 0), 0);
  const verifiedSales = productReferrals.filter((r) =>
    r.status?.includes('Converted') || r.status?.includes('Approved')
  ).length;

  return (
    <div className="space-y-5">
      {/* Target Headline */}
      <div>
        <h4 className="text-sm font-extrabold text-zinc-950 tracking-tight leading-snug">
          {isCompleted ? (
            <span className="text-emerald-700 font-bold">🎉 7-Referral Milestone Completed! ₹30 Bonus Unlocked!</span>
          ) : (
            `Reach ${remainingConversions} more referrals for a ${formatCurrency(rewardAmount)} bonus`
          )}
        </h4>
        <p className="text-[11px] text-zinc-500 mt-0.5">
          {product?.name
            ? `Promote ${product.name} to complete your active milestone sprint.`
            : 'Earn ₹10 per referral + unlock a ₹30 cash bonus after every 7 referrals.'}
        </p>
      </div>

      {/* Main Stepper Progress Box */}
      <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200/90 space-y-6">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-zinc-600">Sprint Progress</span>
          <span className="font-mono text-zinc-950 font-bold">
            {percentage}% ({currentSales}/{targetGoal} Sales)
          </span>
        </div>

        {/* Dynamic Stepper Track */}
        <div className="relative pt-6 pb-8">
          {/* Background Track Bar */}
          <div className="w-full h-2.5 bg-zinc-200/80 rounded-full relative">
            {/* Active Track Fill */}
            <div
              className="h-full bg-zinc-950 rounded-full transition-all duration-700 shadow-2xs"
              style={{ width: `${percentage}%` }}
            />

            {/* Dynamic "YOU" Floating Badge anchored at current percentage position */}
            <div
              className="absolute -top-7 -translate-x-1/2 transition-all duration-700 z-10 flex flex-col items-center pointer-events-none"
              style={{
                left: `${Math.max(4, Math.min(96, percentage))}%`,
              }}
            >
              <span className="bg-zinc-950 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
                {currentSales} (You)
              </span>
              <div className="w-1.5 h-1.5 bg-zinc-950 rotate-45 -mt-1" />
            </div>
          </div>

          {/* Stepper Nodes along the line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center px-0.5 pointer-events-none">
            {/* Checkpoint 1 (20% milestone, e.g. 10 sales) */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  currentSales >= cp1Sales
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                    : 'bg-white text-zinc-400 border-zinc-300'
                }`}
              >
                {currentSales >= cp1Sales ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10px]">1</span>}
              </div>
              <span
                className={`absolute top-7 text-[10px] font-mono whitespace-nowrap ${
                  currentSales >= cp1Sales ? 'text-zinc-900 font-bold' : 'text-zinc-500 font-medium'
                }`}
              >
                {cp1Sales} Sales
              </span>
            </div>

            {/* Checkpoint 2 (50% milestone, e.g. 25 sales) */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  currentSales >= cp2Sales
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                    : 'bg-white text-zinc-400 border-zinc-300'
                }`}
              >
                {currentSales >= cp2Sales ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10px]">2</span>}
              </div>
              <span
                className={`absolute top-7 text-[10px] font-mono whitespace-nowrap ${
                  currentSales >= cp2Sales ? 'text-zinc-900 font-bold' : 'text-zinc-500 font-medium'
                }`}
              >
                {cp2Sales} Sales
              </span>
            </div>

            {/* Final Target Node (100% milestone - Reward Coin) */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                  isCompleted
                    ? 'bg-amber-500 text-white border-white ring-2 ring-amber-400 shadow-md animate-pulse'
                    : 'bg-amber-50 text-amber-600 border-amber-300'
                }`}
              >
                ₹
              </div>
              <span
                className={`absolute top-8 text-[10px] font-mono whitespace-nowrap ${
                  isCompleted ? 'text-amber-700 font-extrabold' : 'text-amber-700 font-bold'
                }`}
              >
                {targetGoal} Sales
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Breakdown */}
        <div className="pt-2 border-t border-zinc-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between font-medium">
            <span className="text-zinc-600">Direct Referred Clicks:</span>
            <span className="font-mono font-bold text-zinc-950">{trackedClicks}</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="text-zinc-600">Verified Paid Sales:</span>
            <span className="font-mono font-bold text-emerald-700">{currentSales}</span>
          </div>
          {product && (
            <div className="flex items-center justify-between font-medium">
              <span className="text-zinc-600">Active Campaign Conversions:</span>
              <span className="font-mono font-bold text-zinc-950">
                {product.conversions ?? verifiedSales}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Button */}
      {showRulesButton && (
        <button
          type="button"
          onClick={() => navigate('/app/targets')}
          className="w-full py-2.5 px-3 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-subtle flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>View Full Target Sprint Rules</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
        </button>
      )}
    </div>
  );
};
