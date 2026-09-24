import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Search, Star, Eye, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-0.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export const UserMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');

  const { data: rawProducts = [], isLoading } = useQuery({
    queryKey: ['products', { category, search, sortBy }],
    queryFn: () => affiliateApi.getProducts({ category, search, sortBy }),
  });

  const products = Array.isArray(rawProducts) ? rawProducts : (rawProducts?.data || []);

  const refCode = user?.referral_code || user?.referralCode || 'REF-KISHORE-2026';

  const handleWhatsAppShare = (prod) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://referitup.com';
    const trackedUrl = `${origin}/p/${prod.id}?ref=${refCode}&utm_source=whatsapp`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${prod.name} on Referitup! ${trackedUrl}`)}`, '_blank');
  };

  const handleQuickShare = (prod) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://referitup.com';
    const trackedUrl = `${origin}/p/${prod.id}?ref=${refCode}`;
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
        title="Available Marketplace"
        subtitle="Discover high-converting SaaS software, fintech APIs, and cloud services."
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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

      {/* Product Grid */}
      {isLoading ? (
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
                {/* Product Thumbnail & Category Badge */}
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

              {/* Card Actions Footer: View Details, WhatsApp, Share Link */}
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
                  {/* WhatsApp Direct Share Button */}
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

                  {/* General Share / Copy Link Button */}
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
  );
};
