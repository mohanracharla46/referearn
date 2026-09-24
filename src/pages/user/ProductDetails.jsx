import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { SprintMilestoneWidget } from '../../components/common/SprintMilestoneWidget';
import { Input } from '../../components/ui/Input';
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  ArrowRight,
  Users,
  UserCheck,
  TrendingUp,
  MousePointer,
  DollarSign,
  Copy,
  Check,
  Link as LinkIcon,
} from 'lucide-react';

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-0.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export const UserProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
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
    if (!product?.name) return [];
    return referrals.filter((r) => r.product === product.name);
  }, [referrals, product]);

  const refCode = user?.referral_code || user?.referralCode || `REF-${(user?.name || 'USER').toUpperCase().replace(/[^A-Z0-9]/g, '-')}-2026`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://referitup.com';
  const trackedLink = `${origin}/p/${product?.id || id}?ref=${refCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackedLink);
    setCopied(true);
    addToast({ title: 'Referral Link Copied', message: `Unique referral link for ${product?.name} copied to clipboard.`, type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product?.name} on Referitup! ${trackedLink}`)}`, '_blank');
  };

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

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        subtitle={`Category: ${product.category} | Campaign Status: Active`}
        breadcrumbs={['Refer & Earn', 'Product Details', product.name]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/app/refer')} icon={ArrowLeft}>
            Back to Refer & Earn
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

          {/* Your Unique Product Referral Link Card */}
          <Card className="bg-zinc-950 text-white border-zinc-950 p-5 shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Your Product Referral Link</h3>
                </div>
                <Badge variant="success" className="text-[10px] font-mono">
                  Earn {product.commission} / Sale
                </Badge>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Share this tracked link with your audience. Any user who registers or completes a purchase via this link will credit commission to your account.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <div className="relative w-full">
                  <Input
                    value={trackedLink}
                    readOnly
                    icon={LinkIcon}
                    className="w-full bg-zinc-900 text-zinc-100 font-mono text-xs border-zinc-800 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <Button
                    variant={copied ? 'secondary' : 'primary'}
                    onClick={handleCopyLink}
                    icon={copied ? Check : Copy}
                    className="flex-1 sm:flex-none bg-white text-zinc-950 hover:bg-zinc-100 font-bold"
                  >
                    {copied ? 'Copied' : 'Copy Link'}
                  </Button>
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="p-2 sm:px-3 sm:py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-subtle cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0"
                    title="Share via WhatsApp"
                    aria-label="Share via WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                </div>
              </div>
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
                    {productReferrals.reduce((sum, r) => sum + (Number(r.clicks) || 0), 0)}
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-semibold">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Conversions</span>
                  </div>
                  <p className="text-base font-extrabold text-emerald-700 font-mono">
                    {productReferrals.filter((r) => r.status?.includes('Converted') || r.status?.includes('Approved')).length}
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Conv. Rate</span>
                  </div>
                  <p className="text-base font-extrabold text-zinc-950 font-mono">
                    {(() => {
                      const clicks = productReferrals.reduce((sum, r) => sum + (Number(r.clicks) || 0), 0);
                      const convs = productReferrals.filter((r) => r.status?.includes('Converted') || r.status?.includes('Approved')).length;
                      return clicks > 0 ? ((convs / clicks) * 100).toFixed(1) : '0.0';
                    })()}%
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-semibold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Total Commission</span>
                  </div>
                  <p className="text-base font-extrabold text-zinc-950 financial-num">
                    {(() => {
                      const convs = productReferrals.filter((r) => r.status?.includes('Converted') || r.status?.includes('Approved')).length;
                      return formatCurrency(convs * (product.commissionValue || 0));
                    })()}
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

        {/* Right Sidebar: Product Milestone Target Widget */}
        <div className="space-y-6">
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
            <SprintMilestoneWidget
              target={target}
              product={product}
              productReferrals={productReferrals}
              showRulesButton={true}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
