import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Plus, Megaphone } from 'lucide-react';

export const AdminCampaigns = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Bonus Multiplier');
  const [budget, setBudget] = useState('100000');

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: affiliateApi.getCampaigns,
  });

  const createMutation = useMutation({
    mutationFn: affiliateApi.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      addToast({ title: 'Campaign Created', message: `${name} has been launched.`, type: 'success' });
      setIsModalOpen(false);
      setName('');
    },
    onError: (err) => {
      addToast({ title: 'Failed to create campaign', message: err.message, type: 'error' });
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      type,
      budget: parseFloat(budget),
      status: 'Active',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliate Marketing Campaigns"
        subtitle="Create special promotional boosts, bonus tiers, and seasonal affiliate incentives."
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={Plus}>
            New Incentive Campaign
          </Button>
        }
      />

      <Card>
        <Table headers={['Campaign ID', 'Campaign Name', 'Incentive Type', 'Total Budget', 'Conversions', 'Status', 'Actions']}>
          {campaigns.map((cmp) => (
            <TableRow key={cmp.id}>
              <TableCell className="font-mono text-xs font-semibold">{cmp.id}</TableCell>
              <TableCell className="font-bold text-zinc-950">{cmp.name}</TableCell>
              <TableCell className="text-xs text-zinc-600">{cmp.type}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">
                {formatCurrency(cmp.budget)}
              </TableCell>
              <TableCell className="font-mono text-xs font-semibold">{cmp.conversions}</TableCell>
              <TableCell>
                <Badge variant={cmp.status === 'Active' ? 'success' : 'info'} dot>
                  {cmp.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Configure Campaign
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Incentive Campaign"
        subtitle="Configure seasonal bonuses or conversion multipliers for publishers."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Campaign Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Festive Growth Surge"
            required
          />
          <Select
            label="Incentive Structure"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'Bonus Multiplier', label: 'Bonus Multiplier (1.5x - 2x standard)' },
              { value: 'Flat Cash Incentive', label: 'Flat Cash Incentive (+₹500 per sale)' },
              { value: 'Tier Upgrade', label: 'Tier Upgrade Sprint (Unlock Platinum)' },
            ]}
          />
          <Input
            label="Campaign Total Budget (₹)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <Button variant="primary" type="submit" isLoading={createMutation.isPending} className="w-full">
            Launch Campaign
          </Button>
        </form>
      </Modal>
    </div>
  );
};
