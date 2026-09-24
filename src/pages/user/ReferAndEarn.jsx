import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { SprintMilestoneWidget } from '../../components/common/SprintMilestoneWidget';
import { ReferralMilestonesTable } from '../../components/referrals/ReferralMilestonesTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Share2,
  Copy,
  Check,
  MousePointer,
  CheckCircle2,
  DollarSign,
  Search,
  Star,
  Eye,
  Award,
  Users,
  Percent,
  TrendingUp,
  BarChart3,
  Target,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-0.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export const UserReferAndEarn = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  // Filters for products
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');

  // Stats query
  const { data: stats } = useQuery({
    queryKey: ['userStats', user?.email],
    queryFn: affiliateApi.getUserStats,
    refetchInterval: 3000,
  });

  // Sprint Target query
  const { data: target } = useQuery({
    queryKey: ['target'],
    queryFn: affiliateApi.getTarget,
  });

  // All targets (milestone archive) query
  const { data: allTargets = [] } = useQuery({
    queryKey: ['allTargets'],
    queryFn: affiliateApi.getAllTargets,
  });

  // Chart data query
  const { data: chartData = [] } = useQuery({
    queryKey: ['chartData'],
    queryFn: affiliateApi.getChartData,
  });

  // Referrals query
  const { data: rawReferrals = [] } = useQuery({
    queryKey: ['referrals', user?.email],
    queryFn: affiliateApi.getReferrals,
    refetchInterval: 3000,
  });

  // Products query
  const { data: rawProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', { category, search, sortBy }],
    queryFn: () => affiliateApi.getProducts({ category, search, sortBy }),
  });

  const referrals = Array.isArray(rawReferrals) ? rawReferrals : (rawReferrals?.data || []);
  const products = Array.isArray(rawProducts) ? rawProducts : (rawProducts?.data || []);
  const completedMilestones = allTargets.filter((t) => t.completed);

  const mainReferralCode = user?.referral_code || user?.referralCode || `REF-${(user?.name || 'USER').toUpperCase().replace(/[^A-Z0-9]/g, '-')}-2026`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://referitup.com';
  const mainReferralUrl = `${origin}/join?ref=${mainReferralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mainReferralUrl);
    setCopied(true);
    addToast({ title: 'Referral Link Copied', message: 'Main referral URL copied to clipboard.', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = (prod) => {
    const trackedUrl = `${origin}/p/${prod.id}?ref=${mainReferralCode}&utm_source=whatsapp`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${prod.name} on Referitup! ${trackedUrl}`)}`, '_blank');
  };

  const handleQuickShare = (prod) => {
    const trackedUrl = `${origin}/p/${prod.id}?ref=${mainReferralCode}`;
    if (navigator.share) {
      navigator
        .share({
          title: prod.name,
          text: `Promote ${prod.name} and earn ${prod.commission} commission!`,
          url: trackedUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(trackedUrl);
      addToast({
        title: 'Referral Link Copied',
        message: `Tracked link for ${prod.name} copied to clipboard.`,
        type: 'info',
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refer & Earn"
        subtitle="Explore products, share your unique referral links, track conversion performance, and achieve sprint targets."
      />

      {/* Official User Guide Banner */}
      <Card className="bg-gradient-to-r from-blue-900 via-indigo-950 to-zinc-950 text-white border-blue-900/50 p-5 shadow-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  How to Use Referitup – Complete User Guide
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Official Guide
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                Read our step-by-step user guide to learn how referral links, payouts, and sprint rewards work.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/app/guide')}
            icon={BookOpen}
            className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            Open User Guide
          </Button>
        </div>
      </Card>

      {/* Main Referral Code & Link Box */}
      <Card className="bg-zinc-950 text-white border-zinc-950 p-6 shadow-md">
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
                Earn ₹10 / Referral + ₹30 Bonus (7 Referrals)
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed pt-1">
              Earn ₹10 instant commission for every verified referral. Reach 7 referrals to unlock an extra ₹30 cash bonus credited directly to your balance!
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

      {/* Comprehensive Performance Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          title="Conversion Rate"
          value={`${stats?.conversionRate ?? 0}%`}
          isCurrency={false}
          subtitle="Click-to-sale funnel"
          icon={Percent}
        />
        <StatCard
          title="Earned From Referrals"
          value={stats?.totalEarnings ?? 0}
          subtitle="Cleared payout balance"
          icon={DollarSign}
        />
      </div>

      {/* Available Products Section (Promote Products & Earn) - Disabled for now as requested
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Promote Products & Earn</h2>
            <p className="text-xs text-zinc-500">Select any product below to get your tracked referral link and share.</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search products or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-1/2 sm:w-44">
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'All', label: 'All Categories' },
                  { value: 'Cloud', label: 'Cloud Hosting' },
                  { value: 'Fintech', label: 'Fintech & APIs' },
                  { value: 'Software', label: 'SaaS Software' },
                  { value: 'Developer Tools', label: 'Developer Tools' },
                  { value: 'Marketing', label: 'Marketing' },
                ]}
              />
            </div>

            <div className="w-1/2 sm:w-44">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'popularity', label: 'Sort: Popularity' },
                  { value: 'commission', label: 'Highest Commission' },
                  { value: 'price', label: 'Highest Price' },
                ]}
              />
            </div>
          </div>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products matched your filter"
            description="Try resetting your category search or keywords."
            actionLabel="Clear Search"
            onAction={() => {
              setSearch('');
              setCategory('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <Card
                key={prod.id}
                className="flex flex-col justify-between hover:border-zinc-400 transition-subtle group"
              >
                <div>
                  <div className="relative h-44 w-full bg-zinc-100 rounded-md overflow-hidden mb-4 border border-zinc-200">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="dark">{prod.category}</Badge>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded text-[11px] font-bold text-zinc-900 border border-zinc-200 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{prod.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-zinc-950 group-hover:text-zinc-700 transition-subtle">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="p-3 bg-emerald-50/80 rounded-md border border-emerald-200/90 space-y-1 my-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-900 font-bold uppercase tracking-wider text-[11px]">Refer & Earn Money:</span>
                        <span className="font-extrabold text-emerald-700 font-mono text-base">
                          {prod.commission ? (prod.commission.startsWith('₹') ? prod.commission : `₹${prod.commission}`) : formatCurrency(prod.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/app/product/${prod.id}`)}
                    icon={Eye}
                    className="text-xs font-medium"
                  >
                    View Details
                  </Button>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(prod)}
                      className="p-2 sm:px-3 sm:py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-600 hover:text-white transition-subtle cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                      title="Share via WhatsApp"
                      aria-label="Share via WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickShare(prod)}
                      className="p-2 sm:px-3 sm:py-2 bg-zinc-950 text-white border border-zinc-950 rounded-md hover:bg-zinc-800 transition-subtle cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
                      title="Share or Copy Referral Link"
                      aria-label="Share or Copy Referral Link"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share Link</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      */}

      {/* Referral Milestone Rewards Program & Rules Notice */}
      <ReferralMilestonesTable currentReferrals={stats?.totalReferrals ?? referrals.filter(r => r.status.includes('Converted')).length ?? 0} />

      {/* Active Sprint Milestone Target Section */}
      <Card
        className="bg-white border-zinc-200 p-6 shadow-xs"
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-zinc-950" />
              <span className="text-base font-bold text-zinc-950">Active Sprint Target & Incentive Bonus</span>
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





      {/* Referred Clients Table & Attribution Log */}
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
                      : ref.status.includes('Rejected') || ref.status.includes('Declined')
                      ? 'danger'
                      : ref.status.includes('Active')
                      ? 'info'
                      : 'warning'
                  }
                  dot
                >
                  {ref.status}
                </Badge>
                {(ref.rejection_reason || ref.rejectionReason) && (
                  <div className="text-[11px] text-rose-600 font-medium mt-1 leading-tight">
                    Reason: {ref.rejection_reason || ref.rejectionReason}
                  </div>
                )}
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
