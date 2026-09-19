import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Megaphone } from 'lucide-react';

export const AdminCampaigns = () => {
  const campaigns = [
    { id: 'cmp-101', name: 'Q3 Enterprise Cloud Boost', type: 'Bonus Multiplier', budget: 250000.0, status: 'Active', conversions: 184 },
    { id: 'cmp-102', name: 'Fintech API Referral Sprint', type: 'Flat Cash Incentive', budget: 150000.0, status: 'Active', conversions: 92 },
    { id: 'cmp-103', name: 'Autumn SaaS Growth Surge', type: 'Tier Upgrade', budget: 100000.0, status: 'Scheduled', conversions: 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliate Marketing Campaigns"
        subtitle="Create special promotional boosts, bonus tiers, and seasonal affiliate incentives."
        actions={
          <Button variant="primary" size="sm" icon={Plus}>
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
    </div>
  );
};
