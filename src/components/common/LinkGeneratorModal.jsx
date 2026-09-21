import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { affiliateApi } from '../../services/api';
import { Copy, Check, Link, Sparkles } from 'lucide-react';

export const LinkGeneratorModal = ({ isOpen, onClose, defaultProduct = null }) => {
  const { addToast } = useToast();
  const [selectedProd, setSelectedProd] = useState(defaultProduct?.id || 'prod-1');
  const [utmSource, setUtmSource] = useState('linkedin');
  const [campaignCode, setCampaignCode] = useState('SEP2026');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => affiliateApi.getProducts(),
  });

  const productOptions = products.length > 0
    ? products.map((p) => ({
        value: p.id,
        label: `${p.name} (${p.commission} Comm.)`,
      }))
    : [
        { value: 'prod-1', label: 'StackCloud Enterprise Hosting (20% Comm.)' },
        { value: 'prod-2', label: 'PayFlow Payment Gateway API (₹1,500 Flat)' },
      ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await affiliateApi.generateReferralLink({
        productId: selectedProd,
        campaignCode,
        utmSource,
      });
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://referearn.io';
      const formattedUrl = res.link ? res.link.replace('https://referearn.io', origin) : `${origin}/p/${selectedProd}?ref=${campaignCode}&utm_source=${utmSource}`;
      setGeneratedUrl(formattedUrl);
      addToast({
        title: 'Referral Link Generated',
        message: 'Your custom affiliate link is ready for promotion.',
        type: 'success',
      });
    } catch (err) {
      addToast({ title: 'Generation Failed', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setIsCopied(true);
    addToast({
      title: 'Link Copied',
      message: 'Referral link copied to clipboard.',
      type: 'info',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Referral Link"
      subtitle="Create a custom tracked URL with UTM parameters for campaign attribution."
    >
      <div className="space-y-4">
        <Select
          label="Select Target Product / Service"
          value={selectedProd}
          onChange={(e) => setSelectedProd(e.target.value)}
          options={productOptions}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="UTM Source"
            value={utmSource}
            onChange={(e) => setUtmSource(e.target.value)}
            placeholder="e.g. twitter, youtube, newsletter"
          />
          <Input
            label="Campaign Tag"
            value={campaignCode}
            onChange={(e) => setCampaignCode(e.target.value)}
            placeholder="e.g. AUTUMN_BOOST"
          />
        </div>

        <Button
          variant="primary"
          className="w-full mt-2"
          onClick={handleGenerate}
          isLoading={loading}
          icon={Sparkles}
        >
          Generate Unique Tracked URL
        </Button>

        {generatedUrl && (
          <div className="pt-3 border-t border-zinc-200 mt-4 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Your Tracked Affiliate URL
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={generatedUrl}
                readOnly
                icon={Link}
                className="font-mono text-xs bg-zinc-50"
              />
              <Button
                variant={isCopied ? 'secondary' : 'primary'}
                onClick={handleCopy}
                icon={isCopied ? Check : Copy}
                className="shrink-0"
              >
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
