import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { MousePointer, CheckCircle2, Percent, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export const UserAnalytics = () => {
  const { data: stats } = useQuery({
    queryKey: ['userStats'],
    queryFn: affiliateApi.getUserStats,
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ['chartData'],
    queryFn: affiliateApi.getChartData,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => affiliateApi.getProducts(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Analytics"
        subtitle="In-depth breakdown of traffic click streams, conversion funnels, and revenue attribution."
      />

      {/* Top Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Referral Clicks"
          value={stats?.totalClicks || 1760}
          isCurrency={false}
          subtitle="Tracked visitor sessions"
          icon={MousePointer}
        />
        <StatCard
          title="Total Conversions"
          value={stats?.totalReferrals || 148}
          isCurrency={false}
          subtitle="Paid signups"
          icon={CheckCircle2}
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats?.conversionRate || 8.4}%`}
          isCurrency={false}
          subtitle="Click-to-sale funnel"
          icon={Percent}
        />
        <StatCard
          title="Total Revenue Earned"
          value={stats?.totalEarnings}
          subtitle="Cleared affiliate commission"
          icon={DollarSign}
        />
      </div>

      {/* Traffic & Conversion Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Daily Conversion Volume"
          subtitle="Number of converted sales per day"
          data={chartData}
          dataKey="conversions"
          isCurrency={false}
        />
        <ChartCard
          title="Traffic Click Flow"
          subtitle="Total unique referral link clicks per day"
          data={chartData}
          dataKey="clicks"
          isCurrency={false}
        />
      </div>

      {/* Product Performance Matrix Table */}
      <Card header={<h3 className="text-sm font-semibold text-zinc-900">Product Performance Breakdown</h3>}>
        <Table headers={['Product Name', 'Category', 'Price', 'Commission Rate', 'Conversions', 'Total Revenue Generated']}>
          {products.map((prod) => (
            <TableRow key={prod.id}>
              <TableCell className="font-bold text-zinc-950">{prod.name}</TableCell>
              <TableCell className="text-xs text-zinc-600">{prod.category}</TableCell>
              <TableCell className="font-mono text-xs">{formatCurrency(prod.price)}</TableCell>
              <TableCell className="font-mono text-xs font-semibold text-zinc-900">{prod.commission}</TableCell>
              <TableCell className="font-mono font-bold text-zinc-950">{prod.conversions}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">
                {formatCurrency(prod.conversions * prod.commissionValue)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
