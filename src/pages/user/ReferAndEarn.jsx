import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Sparkles,
  MousePointer,
  CheckCircle2,
  DollarSign,
  Send,
} from 'lucide-react';

export const UserReferAndEarn = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['userStats', user?.email],
    queryFn: affiliateApi.getUserStats,
    refetchInterval: 3000,
  });

  const { data: rawReferrals = [] } = useQuery({
    queryKey: ['referrals', user?.email],
    queryFn: affiliateApi.getReferrals,
    refetchInterval: 3000,
  });

  const referrals = Array.isArray(rawReferrals) ? rawReferrals : (rawReferrals?.data || []);

  const mainReferralCode = user?.referral_code || user?.referralCode || `REF-${(user?.name || 'USER').toUpperCase().replace(/[^A-Z0-9]/g, '-')}-2026`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://referearn.io';
  const mainReferralUrl = `${origin}/join?ref=${mainReferralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mainReferralUrl);
    setCopied(true);
    addToast({ title: 'Referral Link Copied', message: 'Main referral URL copied to clipboard.', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refer & Earn Center"
        subtitle="Share your global referral link to earn recurring commissions on all products."
      />

      {/* Main Referral Code & Link Box */}
      <Card className="bg-zinc-950 text-white border-zinc-950 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase font-semibold">
              YOUR EXCLUSIVE AFFILIATE CODE
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-black text-white bg-zinc-900 border border-zinc-800 px-3 py-1 rounded">
                {mainReferralCode}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded">
                Earn ₹10 / Referral
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed pt-1">
              Earn a flat ₹10.00 commission per referral. Referral commissions enter your Pending balance first and are credited to your Available Balance upon Admin approval.
            </p>
          </div>

          <div className="w-full lg:w-auto space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
              Default Shareable URL
            </label>
            <div className="flex items-center gap-2">
              <input
                value={mainReferralUrl}
                readOnly
                className="w-full lg:w-80 bg-zinc-900 text-zinc-100 font-mono text-xs rounded border border-zinc-800 px-3 py-2 focus:outline-none"
              />
              <Button
                variant={copied ? 'secondary' : 'primary'}
                onClick={handleCopy}
                icon={copied ? Check : Copy}
                className="shrink-0 bg-white text-zinc-950 hover:bg-zinc-100"
              >
                {copied ? 'Copied' : 'Copy URL'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Referral Clicks"
          value={stats?.totalClicks ?? 0}
          isCurrency={false}
          subtitle="Unique visitor clicks"
          icon={MousePointer}
        />
        <StatCard
          title="Successful Conversions"
          value={stats?.totalReferrals ?? 0}
          isCurrency={false}
          subtitle="Paid signups & orders"
          icon={CheckCircle2}
        />
        <StatCard
          title="Earned From Referrals"
          value={stats?.totalEarnings ?? 0}
          subtitle="Cleared payout balance"
          icon={DollarSign}
        />
      </div>

      {/* Referred Customers Table */}
      <Card header={<h3 className="text-sm font-semibold text-zinc-900">Referred Clients & Attribution Log</h3>}>
        <Table headers={['Referred Client', 'Product', 'Clicks', 'Status', 'Date', 'Earned']}>
          {referrals.map((ref) => (
            <TableRow key={ref.id}>
              <TableCell>
                <div className="font-semibold text-zinc-900">{ref.name}</div>
                <div className="text-[11px] text-zinc-500 font-mono">{ref.email}</div>
              </TableCell>
              <TableCell>{ref.product}</TableCell>
              <TableCell className="font-mono">{ref.clicks} clicks</TableCell>
              <TableCell>
                <Badge
                  variant={
                    ref.status.includes('Converted')
                      ? 'success'
                      : ref.status.includes('Active')
                      ? 'info'
                      : 'warning'
                  }
                  dot
                >
                  {ref.status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(ref.date)}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">
                {formatCurrency(ref.totalEarned)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
