import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, Search, Clock, Users } from 'lucide-react';

export const AdminReferrals = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data: rawReferrals = [], isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => affiliateApi.getReferrals(),
    refetchInterval: 3000,
  });

  const referrals = Array.isArray(rawReferrals) ? rawReferrals : (rawReferrals?.data || []);

  const approveReferralMutation = useMutation({
    mutationFn: ({ id, status }) => affiliateApi.updateReferralStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      addToast({
        title: 'Referral Commission Approved',
        message: '₹10.00 commission credited to affiliate available balance.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({ title: 'Approval Failed', message: err.message, type: 'error' });
    }
  });

  const filteredReferrals = referrals.filter((r) => {
    const matchesSearch =
      (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.product || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Pending' && (r.status.includes('Pending') || r.status.includes('Active'))) ||
      (statusFilter === 'Converted' && r.status.includes('Converted'));
    return matchesSearch && matchesStatus;
  });

  const pendingCount = referrals.filter(r => r.status.includes('Pending') || r.totalEarned === 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Raw Referral Traffic Stream"
        subtitle="Real-time log of incoming affiliate traffic clicks, attribution links, and conversion clearance."
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <Input
          placeholder="Search by contact name, email, or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          className="w-full sm:w-80"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'All', label: `All Referrals (${referrals.length})` },
            { value: 'Pending', label: `Pending Approval (${pendingCount})` },
            { value: 'Converted', label: 'Converted & Credited' },
          ]}
          className="w-full sm:w-56"
        />
      </div>

      <Card>
        <Table headers={['Referral ID', 'Date', 'Referred Contact', 'Product / Source', 'Clicks', 'Earned Balance', 'Status', 'Clearance Action']}>
          {filteredReferrals.map((r) => {
            const rawId = r.db_id || parseInt(String(r.id).replace('ref-', ''), 10);
            const isPending = r.status.includes('Pending') || r.totalEarned === 0;

            return (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs font-semibold">{r.id}</TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">{formatDate(r.date)}</TableCell>
                <TableCell>
                  <div className="font-bold text-zinc-950">{r.name}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{r.email}</div>
                </TableCell>
                <TableCell className="text-xs text-zinc-900">{r.product}</TableCell>
                <TableCell className="font-mono text-xs">{r.clicks} clicks</TableCell>
                <TableCell className="financial-num font-bold text-zinc-950">
                  {formatCurrency(r.totalEarned)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      r.status.includes('Converted')
                        ? 'success'
                        : r.status.includes('Active')
                        ? 'info'
                        : 'warning'
                    }
                    dot
                  >
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {isPending ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => approveReferralMutation.mutate({ id: rawId, status: 'Converted (₹10 Credited)' })}
                      isLoading={approveReferralMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                    >
                      Approve & Credit ₹10
                    </Button>
                  ) : (
                    <span className="text-xs text-zinc-400 font-medium">Cleared</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </div>
  );
};
