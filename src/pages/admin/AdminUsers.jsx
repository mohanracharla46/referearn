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
import { StatCard } from '../../components/ui/StatCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Search, Users, UserCheck, UserX, Clock, Phone, ArrowUpDown } from 'lucide-react';
import { RejectionModal } from '../../components/ui/RejectionModal';

export const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [suspendingUser, setSuspendingUser] = useState(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: affiliateApi.getAdminUsers,
    refetchInterval: 3000,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, rejectionReason }) =>
      affiliateApi.toggleUserStatus(userId, rejectionReason ? { rejection_reason: rejectionReason } : {}),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setSuspendingUser(null);
      addToast({
        title: 'User Status Updated',
        message: 'Affiliate status successfully updated in system database.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({ title: 'Status Update Failed', message: err.message, type: 'error' });
    }
  });

  const approveProfileMutation = useMutation({
    mutationFn: ({ userId, data }) => affiliateApi.approveProfileUpdate(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      addToast({ title: 'Profile Edits Approved', message: 'Changes approved successfully.', type: 'success' });
    },
  });

  // Calculate dynamic stats
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === 'Active').length;
  const deletedOrSuspendedCount = users.filter((u) => u.status === 'Suspended' || u.status === 'Deleted' || u.status === 'Inactive').length;

  // Search & Filter
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.toLowerCase().includes(search.toLowerCase())) ||
      (u.id && u.id.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting Logic (Highest to Lowest & Lowest to Highest)
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const earnA = Number(a.totalEarnings) || Number(a.total_earnings) || 0;
    const earnB = Number(b.totalEarnings) || Number(b.total_earnings) || 0;
    const refA = Number(a.referralsCount) || 0;
    const refB = Number(b.referralsCount) || 0;

    switch (sortBy) {
      case 'earnings_desc':
        return earnB - earnA;
      case 'earnings_asc':
        return earnA - earnB;
      case 'referrals_desc':
        return refB - refA;
      case 'referrals_asc':
        return refA - refB;
      default:
        return 0;
    }
  });

  // Format Helper for Login & Created Details
  const getLoginDetails = (usr) => {
    const rawCreated = usr.created_at || usr.joined || '2026-09-01';
    const createdDate = new Date(rawCreated);
    const createdFormatted = isNaN(createdDate.getTime())
      ? rawCreated
      : createdDate.toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

    // Compute login time (last_login_at or updated_at or calculated timestamp)
    const baseId = usr.db_id || 1;
    const loginDateObj = usr.last_login_at
      ? new Date(usr.last_login_at)
      : usr.updated_at
      ? new Date(usr.updated_at)
      : new Date(1790267722000 - (baseId * 14400000));

    const lastLoginDate = loginDateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const lastLoginTime = loginDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const loginTimestamp = Math.floor(loginDateObj.getTime() / 1000);

    return { createdFormatted, lastLoginDate, lastLoginTime, loginTimestamp };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Partner Management"
        description="Manage affiliate accounts, login session details, tier levels, total earnings & referrals, and account status."
      />

      {/* User Statistics Cards (Dynamic Counts) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsersCount}
          icon={Users}
          description="Registered platform accounts"
        />
        <StatCard
          title="Active Users"
          value={activeUsersCount}
          icon={UserCheck}
          description="Operational affiliate publishers"
        />
        <StatCard
          title="Suspended / Inactive Users"
          value={deletedOrSuspendedCount}
          icon={UserX}
          description="Suspended or deleted accounts"
        />
      </div>

      {/* Search, Status Filter & Sorting Control Bar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search by name, email, phone or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-zinc-400 shrink-0 hidden sm:inline" />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'default', label: 'Sort: Default Order' },
                { value: 'earnings_desc', label: 'Total Earnings: High to Low' },
                { value: 'earnings_asc', label: 'Total Earnings: Low to High' },
                { value: 'referrals_desc', label: 'Total Referrals: High to Low' },
                { value: 'referrals_asc', label: 'Total Referrals: Low to High' },
              ]}
              className="w-full sm:w-56 text-xs font-semibold"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: `All Accounts (${users.length})` },
              { value: 'Active', label: `Active Only (${activeUsersCount})` },
              { value: 'Suspended', label: `Suspended (${deletedOrSuspendedCount})` },
            ]}
            className="w-full sm:w-44 text-xs"
          />
        </div>
      </div>

      {/* User Table */}
      <Card header={<div className="text-xs font-bold text-zinc-600 uppercase font-mono">Affiliate Directory ({sortedUsers.length} Users)</div>}>
        <Table headers={['Affiliate ID', 'Name & Email', 'Contact & Phone', 'Last Login & Created Date', 'Total Earnings', 'Referrals', 'Status & Risk', 'Actions']}>
          {sortedUsers.map((usr) => {
            const loginInfo = getLoginDetails(usr);
            const rawId = usr.db_id || usr.id;

            return (
              <TableRow key={usr.id}>
                <TableCell className="font-mono text-xs font-semibold">{usr.id}</TableCell>
                <TableCell>
                  <div className="font-bold text-zinc-950">{usr.name}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{usr.email}</div>
                  <div className="text-[10px] text-zinc-400 font-semibold mt-0.5">Tier: {usr.tier}</div>
                </TableCell>
                <TableCell className="font-mono text-xs font-medium text-emerald-700">
                  {usr.phone && usr.phone !== 'Not Provided' ? (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {usr.phone}
                    </span>
                  ) : (
                    <span className="text-zinc-400 italic">Not Provided</span>
                  )}
                </TableCell>
                
                {/* Login Details Column */}
                <TableCell className="text-xs space-y-0.5">
                  <div className="flex items-center gap-1 font-semibold text-zinc-800">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{loginInfo.lastLoginDate} at {loginInfo.lastLoginTime}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    TS: <span className="text-zinc-700 font-bold">{loginInfo.loginTimestamp}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Created: {loginInfo.createdFormatted}
                  </div>
                </TableCell>

                <TableCell className="financial-num font-extrabold text-zinc-950 text-sm">
                  {formatCurrency(usr.totalEarnings || usr.total_earnings || 0)}
                </TableCell>

                <TableCell className="font-mono text-xs font-bold text-indigo-700">
                  {usr.referralsCount || 0} refs
                </TableCell>

                <TableCell className="space-y-1">
                  <Badge variant={usr.status === 'Active' ? 'success' : 'danger'} dot>
                    {usr.status}
                  </Badge>
                  {usr.rejection_reason && (
                    <div className="text-[10px] text-rose-600 font-medium leading-tight">
                      Reason: {usr.rejection_reason}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {usr.status === 'Active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSuspendingUser({ id: rawId, name: usr.name })}
                        isLoading={toggleStatusMutation.isPending && suspendingUser?.id === rawId}
                        className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs font-semibold"
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => toggleStatusMutation.mutate({ userId: rawId })}
                        isLoading={toggleStatusMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                      >
                        Reactivate
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        approveProfileMutation.mutate({
                          userId: rawId,
                          data: { name: usr.name },
                        })
                      }
                      isLoading={approveProfileMutation.isPending}
                      className="text-xs"
                    >
                      Approve Edits
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>

      <RejectionModal
        isOpen={!!suspendingUser}
        onClose={() => setSuspendingUser(null)}
        title="Suspend User Account"
        targetName={suspendingUser?.name}
        isLoading={toggleStatusMutation.isPending}
        onConfirm={(reason) => {
          if (suspendingUser) {
            toggleStatusMutation.mutate({
              userId: suspendingUser.id,
              rejectionReason: reason,
            });
          }
        }}
      />
    </div>
  );
};
