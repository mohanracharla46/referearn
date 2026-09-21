import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Sparkles,
  Download,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Link as LinkIcon,
  Trophy,
  ArrowRight,
  Users,
  UserCheck,
  TrendingUp,
  MousePointer,
  DollarSign,
} from 'lucide-react';

export const UserProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [utmSource, setUtmSource] = useState('linkedin');
  const [copied, setCopied] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => affiliateApi.getProductById(id || 'prod-1'),
  });

  const { data: target } = useQuery({
    queryKey: ['target'],
    queryFn: affiliateApi.getTarget,
  });

  const { data: referrals = [] } = useQuery({
    queryKey: ['referrals'],
    queryFn: affiliateApi.getReferrals,
  });

  const productReferrals = useMemo(() => {
    const matched = referrals.filter((r) => r.product === product?.name);
    return matched.length > 0 ? matched : referrals;
  }, [referrals, product]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} icon={ArrowLeft}>
          Back
        </Button>
        <CardSkeleton />
      </div>
    );
  }

  if (!product) return <div className="p-8 text-center text-xs text-zinc-500">Product not found</div>;

  const refCode = user?.referral_code || user?.referralCode || `REF-${(user?.name || 'USER').toUpperCase().replace(/[^A-Z0-9]/g, '-')}-2026`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://referearn.io';
  const generatedLink = `${origin}/p/${product.id}?ref=${refCode}&utm_source=${utmSource}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    addToast({ title: 'Link Copied', message: 'Custom affiliate link copied.', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        subtitle={`Category: ${product.category} | Campaign Status: Active`}
        breadcrumbs={['Available Marketplace', 'Product Details', product.name]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/app/marketplace')} icon={ArrowLeft}>
            Back to Marketplace
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details & Marketing Assets (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={product.image}
                alt={product.name}
                className="w-full sm:w-48 h-48 object-cover rounded-lg border border-zinc-200"
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="dark">{product.category}</Badge>
                  <span className="text-xs text-zinc-500 font-mono">ID: {product.id}</span>
                </div>
                <h2 className="text-xl font-bold text-zinc-950">{product.name}</h2>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase block">Product Price</span>
                    <span className="text-lg font-bold text-zinc-900">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="h-8 w-px bg-zinc-200" />
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase block">Commission</span>
                    <span className="financial-num text-lg font-bold text-zinc-950">
                      {product.commission} ({formatCurrency(product.commissionValue)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Campaign Rules & Payout Policy */}
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Campaign Promotion Rules</h3>}>
            <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{product.rules}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Paid search ads targeting trademarked terms are strictly prohibited.</li>
                <li>Commissions credit automatically upon buyer completion of order checkout.</li>
                <li>Self-referrals are automatically detected and rejected by the risk engine.</li>
              </ul>
            </div>
          </Card>

          {/* Downloadable Marketing Assets */}
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Downloadable Promotional Assets</h3>}>
            <div className="space-y-2">
              {product.assets.map((asset, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-50 border border-zinc-200 rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-zinc-600" />
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900">{asset.name}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {asset.type} • {asset.size}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addToast({ title: 'Asset Downloading', message: `${asset.name} started downloading.`, type: 'info' })
                    }
                    icon={Download}
                  >
                    Download Asset
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Product Referral Details & Performance Card */}
          <Card
            header={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-950" />
                  <h3 className="text-sm font-bold text-zinc-950">Referral Details & Performance</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="dark" className="text-[10px] font-mono">
                    {productReferrals.length} Active Referrals
                  </Badge>
                  <Badge variant="success" className="text-[10px] font-mono">
                    {product.conversions || 42} Converted
                  </Badge>
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              {/* Summary Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-semibold">
                    <MousePointer className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Tracked Clicks</span>
                  </div>
                  <p className="text-base font-extrabold text-zinc-950 font-mono">
                    {productReferrals.reduce((sum, r) => sum + (Number(r.clicks) || 0), 0) || 14}
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-semibold">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Conversions</span>
                  </div>
                  <p className="text-base font-extrabold text-emerald-700 font-mono">
                    {product.conversions ?? productReferrals.filter(r => r.status?.includes('Converted')).length}
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Conv. Rate</span>
                  </div>
                  <p className="text-base font-extrabold text-zinc-950 font-mono">
                    {(((product.conversions || 1) / Math.max(1, productReferrals.reduce((sum, r) => sum + (Number(r.clicks) || 0), 0) || 14)) * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-semibold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Total Commission</span>
                  </div>
                  <p className="text-base font-extrabold text-zinc-950 financial-num">
                    {formatCurrency((product.conversions || 0) * (product.commissionValue || 0))}
                  </p>
                </div>
              </div>

              {/* Recent Referred Clients Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 pt-1">
                  <span>Recent Referred Clients</span>
                  <span className="text-[11px] text-zinc-500 font-normal">Active Referrals</span>
                </div>

                <Table headers={['Referred Client', 'Channel / UTM', 'Clicks', 'Status', 'Date', 'Earned']}>
                  {productReferrals.map((ref) => (
                    <TableRow key={ref.id}>
                      <TableCell>
                        <div className="font-semibold text-zinc-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            {ref.name ? ref.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-900">{ref.name}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{ref.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {ref.utmSource || 'direct'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{ref.clicks} clicks</TableCell>
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
                      <TableCell className="font-mono text-xs text-zinc-500">
                        {formatDate(ref.date)}
                      </TableCell>
                      <TableCell className="financial-num font-bold text-zinc-950">
                        {formatCurrency(ref.totalEarned)}
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>
              </div>

              {/* Footer Info & Quick Actions */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Earn {product.commission} on every direct client referral link conversion.</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/app/referrals')}
                  icon={ArrowRight}
                  className="w-full sm:w-auto text-xs shrink-0"
                >
                  View All Referrals Log
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Tracked Link Builder + Product Milestone Target Widget */}
        <div className="space-y-6">
          {/* Quick Tracked Link Builder Widget */}
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Quick Tracked Link Builder</h3>}>
            <div className="space-y-4">
              <Input
                label="UTM Source Tag"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                placeholder="linkedin, newsletter, blog"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Your Unique Tracked URL
                </label>
                <Input
                  value={generatedLink}
                  readOnly
                  icon={LinkIcon}
                  className="font-mono text-xs bg-zinc-50"
                />
              </div>

              <Button
                variant={copied ? 'secondary' : 'primary'}
                className="w-full font-semibold"
                onClick={handleCopy}
                icon={copied ? Check : Copy}
              >
                {copied ? 'Link Copied to Clipboard' : 'Copy Tracked URL'}
              </Button>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md text-[11px] text-zinc-500 space-y-1">
                <span className="font-semibold text-zinc-900 block">Attribution Cookie Duration:</span>
                <span>90 days cookie tracking window enabled.</span>
              </div>
            </div>
          </Card>

          {/* Redesigned Milestone Progress Card */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-zinc-950" />
                  <span className="text-sm font-bold text-zinc-950">Active Sprint Milestone</span>
                </div>
                <Badge variant="dark" className="text-[10px] font-mono">
                  REWARD: {formatCurrency(target?.rewardAmount || 0)}
                </Badge>
              </div>
            }
          >
            <div className="space-y-5">
              {/* Target Headline */}
              <div>
                <h4 className="text-sm font-extrabold text-zinc-950 tracking-tight leading-snug">
                  Reach {target?.remainingConversions || 0} more sales for a {formatCurrency(target?.rewardAmount || 0)} bonus
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Promote {product.name} to complete your active milestone sprint.
                </p>
              </div>

              {/* Progress Container */}
              <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200/90 space-y-5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-600">Sprint Progress</span>
                  <span className="font-mono text-zinc-950 font-bold">
                    {target?.percentage}% ({target?.currentConversions}/{target?.targetConversions} Sales)
                  </span>
                </div>

                {/* Clean Milestone Track Line */}
                <div className="relative py-4">
                  {/* Background Track */}
                  <div className="w-full h-2 bg-zinc-200 rounded-full relative">
                    {/* Active Track Fill */}
                    <div
                      className="h-full bg-zinc-950 rounded-full transition-all duration-700 shadow-2xs"
                      style={{ width: `${target?.percentage}%` }}
                    />
                  </div>

                  {/* Node Checkpoints Centered on Track */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center px-0.5">
                    {/* Checkpoint 1 */}
                    <div className="relative flex flex-col items-center group">
                      <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                        ✓
                      </div>
                      <span className="absolute top-7 text-[10px] font-mono text-zinc-600 font-semibold whitespace-nowrap">
                        {Math.round((target?.targetConversions || 50) * 0.2)} Sales
                      </span>
                    </div>

                    {/* Checkpoint 2 */}
                    <div className="relative flex flex-col items-center group">
                      <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                        ✓
                      </div>
                      <span className="absolute top-7 text-[10px] font-mono text-zinc-600 font-semibold whitespace-nowrap">
                        {Math.round((target?.targetConversions || 50) * 0.5)} Sales
                      </span>
                    </div>

                    {/* Checkpoint 3 (Current Active Position) */}
                    <div className="relative flex flex-col items-center group">
                      <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm ring-2 ring-zinc-950 ring-offset-1">
                        ✓
                      </div>
                      <span className="absolute top-7 text-[10px] font-mono text-zinc-950 font-bold whitespace-nowrap bg-zinc-200 px-1.5 py-0.2 rounded">
                        {target?.currentConversions} (You)
                      </span>
                    </div>

                    {/* Target End Coin Badge */}
                    <div className="relative flex flex-col items-center group">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-md ring-2 ring-amber-400 ring-offset-1">
                        ₹
                      </div>
                      <span className="absolute top-8 text-[10px] font-mono text-amber-700 font-bold whitespace-nowrap">
                        {target?.targetConversions} Sales
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specific Product Tracking Metrics Table */}
                <div className="pt-8 border-t border-zinc-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-zinc-600">Direct Referred Clicks:</span>
                    <span className="font-mono font-bold text-zinc-950">
                      {productReferrals.reduce((sum, r) => sum + (Number(r.clicks) || 0), 0) || 14}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-zinc-600">Verified Paid Sales:</span>
                    <span className="font-mono font-bold text-emerald-700">{target?.currentConversions ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-zinc-600">Active Campaign Conversions:</span>
                    <span className="font-mono font-bold text-zinc-950">{product.conversions ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* View Sprint Target Page Button */}
              <button
                type="button"
                onClick={() => navigate('/app/targets')}
                className="w-full py-2.5 px-3 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-subtle flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>View Full Target Sprint Rules</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
