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
import { AddMoneyModal } from '../../components/ui/AddMoneyModal';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Search, Wallet, DollarSign, TrendingUp, ShieldAlert, ArrowUpDown, PlusCircle, Clock, UserCheck } from 'lucide-react';

export const AdminWallets = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('highest_balance');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isAddingMoney, setIsAddingMoney] = useState(false);

  // Manual Transaction Record State
  const [manualTransactions, setManualTransactions] = useState([
    {
      id: 'tx-manual-1',
      userId: 'usr-1',
      userName: 'John Doe',
      userEmail: 'user@example.com',
      amount: 100.0,
      reason: 'Bonus Amount',
      date: 'Sep 24, 2026',
      time: '08:30:00 PM',
      admin: 'Operations Admin',
    },
    {
      id: 'tx-manual-2',
      userId: 'usr-2',
      userName: 'Kishore Kumar',
      userEmail: 'kishore@example.com',
      amount: 50.0,
      reason: 'Promotional Reward',
      date: 'Sep 23, 2026',
      time: '04:15:22 PM',
      admin: 'Enterprise Administrator',
    }
  ]);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => affiliateApi.getAdminUsers(),
    refetchInterval: 3000,
  });

  // Handle Manual Money Addition
  const handleAddMoneyConfirm = async ({ userId, userObj, amount, reason, notes }) => {
    setIsAddingMoney(true);
    try {
      if (affiliateApi.addWalletMoney) {
        await affiliateApi.addWalletMoney(userId, { amount, reason, notes, admin: 'Operations Admin' });
      }

      // Update local query cache for live UI responsiveness
      queryClient.setQueryData(['adminUsers'], (oldUsers) => {
        if (!oldUsers) return [];
        return oldUsers.map((u) => {
          if (u.id === userObj.id || u.db_id === userObj.db_id) {
            const currentBal = Number(u.availableBalance) || Number(u.available_balance) || 0;
            const newBal = currentBal + amount;
            return {
              ...u,
              availableBalance: newBal,
              available_balance: newBal,
            };
          }
          return u;
        });
      });

      // Record transaction
      const now = new Date();
      const newTx = {
        id: `tx-manual-${Date.now()}`,
        userId: userObj.id || `usr-${userId}`,
        userName: userObj.name,
        userEmail: userObj.email,
        amount,
        reason,
        date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        admin: 'Operations Admin',
        notes,
      };

      setManualTransactions((prev) => [newTx, ...prev]);

      addToast({
        title: 'Wallet Funds Added Successfully',
        message: `Credited ₹${amount.toFixed(2)} to ${userObj.name} (${userObj.id}). Purpose: ${reason}.`,
        type: 'success',
      });

      setIsAddMoneyOpen(false);
    } catch (err) {
      addToast({ title: 'Credit Failed', message: err.message, type: 'error' });
    } finally {
      setIsAddingMoney(false);
    }
  };

  // Calculate summary stats
  const totalAvailableFunds = users.reduce((sum, u) => sum + (Number(u.availableBalance) || Number(u.available_balance) || 0), 0);
  const totalLifetimeEarnings = users.reduce((sum, u) => sum + (Number(u.totalEarnings) || Number(u.total_earnings) || 0), 0);
  const activeWalletsCount = users.filter((u) => u.status === 'Active').length;
  
  // Find top earner / fund holder
  const sortedByFunds = [...users].sort((a, b) => {
    const balA = Number(a.availableBalance) || Number(a.available_balance) || 0;
    const balB = Number(b.availableBalance) || Number(b.available_balance) || 0;
    return balB - balA;
  });
  const topFundUser = sortedByFunds[0];

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.id || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting (Highest to Lowest & Lowest to Highest)
  const displayUsers = [...filteredUsers].sort((a, b) => {
    const balA = Number(a.availableBalance) || Number(a.available_balance) || 0;
    const balB = Number(b.availableBalance) || Number(b.available_balance) || 0;
    const earnA = Number(a.totalEarnings) || Number(a.total_earnings) || 0;
    const earnB = Number(b.totalEarnings) || Number(b.total_earnings) || 0;
    const refA = Number(a.referralsCount) || 0;
    const refB = Number(b.referralsCount) || 0;

    switch (sortBy) {
      case 'highest_balance':
        return balB - balA;
      case 'lowest_balance':
        return balA - balB;
      case 'highest_earnings':
        return earnB - earnA;
      case 'lowest_earnings':
        return earnA - earnB;
      case 'highest_referrals':
      case 'most_referrals':
        return refB - refA;
      case 'lowest_referrals':
      case 'least_referrals':
        return refA - refB;
      default:
        return balB - balA;
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader
          title="Global Affiliate Wallets Ledger"
          subtitle="Monitor aggregate publisher balances, total earnings, manual wallet additions, and wallet states."
        />

        <Button
          variant="primary"
          onClick={() => setIsAddMoneyOpen(true)}
          icon={PlusCircle}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 shadow-md shrink-0 cursor-pointer"
        >
          Add Money Manually to Wallet
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Cleared Funds"
          value={formatCurrency(totalAvailableFunds)}
          icon={Wallet}
          description="Available in affiliate wallets"
        />
        <StatCard
          title="Lifetime Revenue Cleared"
          value={formatCurrency(totalLifetimeEarnings)}
          icon={DollarSign}
          description="Cumulative affiliate payouts"
        />
        <StatCard
          title="Highest Balance Holder"
          value={topFundUser ? formatCurrency(topFundUser.availableBalance ?? topFundUser.available_balance ?? 0) : '₹0.00'}
          icon={TrendingUp}
          description={topFundUser ? `${topFundUser.name} (${topFundUser.email})` : 'No affiliates'}
        />
        <StatCard
          title="Active Publisher Wallets"
          value={`${activeWalletsCount} / ${users.length}`}
          icon={ShieldAlert}
          description="Active vs Suspended status"
        />
      </div>

      {/* Manual Admin Wallet Credits Transaction Record Table */}
      <Card header={<div className="text-xs font-bold text-zinc-700 uppercase font-mono flex items-center justify-between w-full"><span>Manual Admin Wallet Credits Ledger</span><span className="text-emerald-700">{manualTransactions.length} Transactions Recorded</span></div>}>
        <Table headers={['Transaction ID', 'User ID & Email', 'Amount Added', 'Reason / Purpose', 'Date & Time', 'Admin Executed']}>
          {manualTransactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-xs font-semibold">{tx.id}</TableCell>
              <TableCell>
                <div className="font-bold text-zinc-950">{tx.userName}</div>
                <div className="text-[11px] text-zinc-500 font-mono">{tx.userEmail}</div>
                <div className="text-[10px] text-zinc-400 font-mono font-bold">User ID: {tx.userId}</div>
              </TableCell>
              <TableCell className="financial-num font-extrabold text-emerald-600 text-sm">
                + {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell>
                <Badge variant="dark" className="font-semibold text-xs">
                  {tx.reason}
                </Badge>
                {tx.notes && (
                  <div className="text-[10px] text-zinc-500 italic mt-0.5">{tx.notes}</div>
                )}
              </TableCell>
              <TableCell className="text-xs">
                <div className="font-semibold text-zinc-800">{tx.date}</div>
                <div className="text-[11px] text-zinc-500 font-mono">{tx.time}</div>
              </TableCell>
              <TableCell className="text-xs font-semibold text-indigo-700">
                {tx.admin}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Filter and Sorting Control Bar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <Input
          placeholder="Search by affiliate name, email or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          className="w-full sm:w-80 text-xs"
        />

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Enhanced Sorting Dropdown with High to Low and Low to High options */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-zinc-400 shrink-0 hidden sm:inline" />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'highest_balance', label: 'Wallet Balance: High to Low' },
                { value: 'lowest_balance', label: 'Wallet Balance: Low to High' },
                { value: 'highest_earnings', label: 'Total Earnings: High to Low' },
                { value: 'lowest_earnings', label: 'Total Earnings: Low to High' },
                { value: 'highest_referrals', label: 'Total Referrals: High to Low' },
                { value: 'lowest_referrals', label: 'Total Referrals: Low to High' },
              ]}
              className="w-full sm:w-64 text-xs font-semibold"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Wallet Statuses' },
              { value: 'Active', label: 'Active / Healthy Only' },
              { value: 'Suspended', label: 'Suspended / Frozen Only' },
            ]}
            className="w-full sm:w-44 text-xs"
          />
        </div>
      </div>

      {/* Wallet Ledger Table */}
      <Card header={<div className="text-xs font-bold text-zinc-600 uppercase font-mono">Affiliate Funds & Balance Ranking ({displayUsers.length} Publishers)</div>}>
        <Table headers={['User ID', 'Affiliate Publisher', 'Available Balance (Funds)', 'Pending Earnings', 'Lifetime Total Earnings', 'Total Referrals', 'Risk Score', 'Ledger Status']}>
          {displayUsers.map((u, idx) => {
            const availBal = Number(u.availableBalance) || Number(u.available_balance) || 0;
            const pendEarn = Number(u.pendingEarnings) || Number(u.pending_earnings) || 0;
            const totEarn = Number(u.totalEarnings) || Number(u.total_earnings) || 0;
            const refCount = Number(u.referralsCount) || 0;

            return (
              <TableRow key={u.id} className={idx === 0 && sortBy === 'highest_balance' ? 'bg-amber-50/40 font-medium' : ''}>
                <TableCell className="font-mono text-xs font-semibold">
                  {u.id}
                  {idx === 0 && sortBy === 'highest_balance' && (
                    <span className="ml-2 text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                      #1 Top Funds
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-zinc-950">{u.name}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{u.email}</div>
                </TableCell>

                <TableCell className="financial-num font-extrabold text-emerald-600 text-sm">
                  {formatCurrency(availBal)}
                </TableCell>

                <TableCell className="financial-num font-medium text-amber-700 text-xs">
                  {formatCurrency(pendEarn)}
                </TableCell>

                <TableCell className="financial-num font-bold text-zinc-950">
                  {formatCurrency(totEarn)}
                </TableCell>

                <TableCell className="font-mono text-xs font-bold text-indigo-700">
                  {refCount} refs
                </TableCell>

                <TableCell>
                  <Badge variant={u.riskScore?.includes('High') ? 'danger' : 'success'} dot>
                    {u.riskScore || 'Low'}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={u.status === 'Active' ? 'success' : 'danger'} dot>
                    {u.status === 'Active' ? 'Healthy' : 'Suspended / Frozen'}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>

      {/* Add Money Modal */}
      <AddMoneyModal
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
        users={users}
        onConfirm={handleAddMoneyConfirm}
        isLoading={isAddingMoney}
      />
    </div>
  );
};
