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
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Search, UserCheck, UserX, ShieldAlert } from 'lucide-react';

export const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data: users = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: affiliateApi.getAdminUsers,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: affiliateApi.toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      addToast({ title: 'User Status Updated', message: 'Affiliate status successfully updated.', type: 'success' });
    },
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publisher Affiliate Management"
        subtitle="Review affiliate accounts, manage tier assignments, monitor risk scores, and handle status suspensions."
      />

      <div className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Input
          placeholder="Search by affiliate name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          className="w-full sm:w-80"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'Active', label: 'Active Affiliates' },
            { value: 'Flagged', label: 'Flagged / High Risk' },
            { value: 'Suspended', label: 'Suspended Accounts' },
          ]}
          className="w-full sm:w-48"
        />
      </div>

      <Card>
        <Table headers={['Affiliate ID', 'Name & Email', 'Tier', 'Joined Date', 'Total Earnings', 'Referrals', 'Risk Profile', 'Actions']}>
          {filteredUsers.map((usr) => (
            <TableRow key={usr.id}>
              <TableCell className="font-mono text-xs font-semibold">{usr.id}</TableCell>
              <TableCell>
                <div className="font-bold text-zinc-950">{usr.name}</div>
                <div className="text-[11px] text-zinc-500 font-mono">{usr.email}</div>
              </TableCell>
              <TableCell className="text-xs font-semibold">{usr.tier}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(usr.joined)}</TableCell>
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
                <Button
                  variant={usr.status === 'Active' ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => toggleStatusMutation.mutate(usr.id)}
                  isLoading={toggleStatusMutation.isPending}
                >
                  {usr.status === 'Active' ? 'Suspend' : 'Reactivate'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
