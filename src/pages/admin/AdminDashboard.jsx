import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Users,
  ShieldAlert,
  ArrowUpRight,
  Building2,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: affiliateApi.getAdminStats,
  });

  const { data: fraudLogs = [] } = useQuery({
    queryKey: ['fraudLogs'],
    queryFn: affiliateApi.getFraudLogs,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: affiliateApi.getAdminUsers,
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ['chartData'],
    queryFn: affiliateApi.getChartData,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Administration Dashboard"
        subtitle="Global platform overview, affiliate payouts engine, and automated fraud control system."
        actions={
          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/admin/fraud-risk')}
            icon={ShieldAlert}
          >
            Review 4 Risk Flags
          </Button>
        }
      />

      {/* Admin Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Platform GMV"
          value={stats?.totalPlatformGMV}
          change={stats?.monthlyVolumeGrowth}
          subtitle="Gross merchandise volume"
          icon={DollarSign}
        />
        <StatCard
          title="Total Affiliate Payouts"
          value={stats?.totalPayouts}
          subtitle="Cleared payout distributions"
          icon={ArrowUpRight}
        />
        <StatCard
          title="Active Publisher Affiliates"
          value={stats?.activeAffiliates}
          isCurrency={false}
          subtitle="Verified active accounts"
          icon={Users}
        />
        <StatCard
          title="Flagged Risk Incidents"
          value={stats?.flaggedFraudAlerts}
          isCurrency={false}
          subtitle="Requires admin review"
          icon={ShieldAlert}
        />
      </div>

      {/* Platform Volume Chart & Risk Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Global Platform Payout Volume"
            subtitle="Daily aggregate commission payouts across all affiliates (INR)"
            data={chartData}
            dataKey="earnings"
          />
        </div>

        {/* Anti-Fraud Quick Alert Monitor (1 Col) */}
        <div>
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span className="text-sm font-semibold text-zinc-900">Anti-Fraud Engine Alerts</span>
                </div>
                <Badge variant="danger">HIGH PRIORITY</Badge>
              </div>
            }
          >
            <div className="space-y-3">
              {fraudLogs.slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-rose-50/50 border border-rose-200 rounded-md space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">{log.affiliate}</span>
                    <Badge variant="danger" className="text-[10px]">
                      Risk Score {log.riskScore}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-700 font-medium">{log.trigger}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>IP: {log.ipAddress}</span>
                    <span>{formatDate(log.timestamp, true)}</span>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/admin/fraud-risk')}
              >
                Inspect All Risk Incidents
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Top Affiliate Publishers Directory Preview */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <h3 className="text-sm font-semibold text-zinc-900">Top Earning Affiliates</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>
              Manage All Users
            </Button>
          </div>
        }
      >
        <Table headers={['Affiliate Name', 'Email', 'Tier', 'Total Earnings', 'Referrals', 'Risk Score', 'Account Status']}>
          {users.slice(0, 5).map((usr) => (
            <TableRow key={usr.id}>
              <TableCell className="font-bold text-zinc-950">{usr.name}</TableCell>
              <TableCell className="text-xs text-zinc-600 font-mono">{usr.email}</TableCell>
              <TableCell className="text-xs font-semibold">{usr.tier}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">
                {formatCurrency(usr.totalEarnings)}
              </TableCell>
              <TableCell className="font-mono text-xs">{usr.referralsCount}</TableCell>
              <TableCell>
                <Badge variant={usr.riskScore.includes('High') ? 'danger' : 'success'} dot>
                  {usr.riskScore}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={usr.status === 'Active' ? 'success' : 'danger'}>
                  {usr.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
