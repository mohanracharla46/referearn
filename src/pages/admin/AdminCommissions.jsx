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
import { CheckCircle2, RotateCcw, Search, Clock, DollarSign, Check, AlertCircle } from 'lucide-react';
import { RejectionModal } from '../../components/ui/RejectionModal';

export const AdminCommissions = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Pending', 'Approved', 'Reversed'
  const [rejectingTx, setRejectingTx] = useState(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => affiliateApi.getTransactions(),
    refetchInterval: 3000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }) =>
      affiliateApi.updateTransactionStatus(id, status, rejectionReason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      setRejectingTx(null);
      
      const actionText = variables.status === 'Approved' ? 'approved and credited to affiliate wallet balance' : `marked as ${variables.status}`;
      addToast({
        title: `Commission ${variables.status}`,
        message: `Commission #${variables.id} was ${actionText}.`,
        type: variables.status === 'Approved' ? 'success' : 'info',
      });
    },
    onError: (err) => {
      addToast({ title: 'Update Failed', message: err.message, type: 'error' });
    }
  });

  // Calculate Tab Counts
  const allCount = transactions.length;
  const pendingCount = transactions.filter(t => (t.status || '').toLowerCase().includes('pending')).length;
  const approvedCount = transactions.filter(t => (t.status || '').toLowerCase().includes('approved')).length;
  const reversedCount = transactions.filter(t => (t.status || '').toLowerCase().includes('reversed') || (t.status || '').toLowerCase().includes('rejected')).length;

  // Filtered Transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      (t.buyer || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.product || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.id || '').toLowerCase().includes(search.toLowerCase());

    const isPending = (t.status || '').toLowerCase().includes('pending');
    const isApproved = (t.status || '').toLowerCase().includes('approved');
    const isReversed = (t.status || '').toLowerCase().includes('reversed') || (t.status || '').toLowerCase().includes('rejected');

    let matchesTab = true;
    if (activeTab === 'Pending') matchesTab = isPending;
    else if (activeTab === 'Approved') matchesTab = isApproved;
    else if (activeTab === 'Reversed') matchesTab = isReversed;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission Queue & Clearance Control"
        subtitle="View, approve pending affiliate commissions to credit wallet balances, or reject/reverse disputed earnings."
      />

      {/* Info Notice Box */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Clearance Rule:</strong> When commissions are generated, they remain in <strong>Pending</strong> state. Once an Admin clicks <strong>Approve</strong>, the commission amount is instantly deducted from Pending Earnings and credited to the Affiliate's Available Wallet Balance.
          </span>
        </div>
        {pendingCount > 0 && (
          <span className="bg-amber-500 text-white font-bold px-3 py-1 rounded-full text-xs shrink-0 shadow-xs">
            {pendingCount} Pending Approval
          </span>
        )}
      </div>

      {/* Four Section Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200">
        <button
          onClick={() => setActiveTab('All')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'All'
              ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <DollarSign className="w-4 h-4 text-indigo-500" />
          <span>All Commissions</span>
          <span className="ml-1 bg-zinc-200 text-zinc-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{allCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('Pending')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'Pending'
              ? 'bg-white text-amber-900 shadow-xs border border-amber-200'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Pending Approvals</span>
          <span className="ml-1 bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{pendingCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('Approved')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'Approved'
              ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Approved Commissions</span>
          <span className="ml-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{approvedCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('Reversed')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'Reversed'
              ? 'bg-white text-rose-900 shadow-xs border border-rose-200'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>Reversed / Rejected</span>
          <span className="ml-1 bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{reversedCount}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search by buyer, product, or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        <div className="text-xs text-zinc-500 font-mono">
          Showing <strong className="text-zinc-900">{filteredTransactions.length}</strong> transactions
        </div>
      </div>

      <Card header={<div className="text-xs font-bold text-zinc-600 uppercase font-mono">{activeTab} Queue Ledger</div>}>
        <Table headers={['Transaction ID', 'Date & Time', 'Customer / Buyer', 'Product / Event', 'Commission Amount', 'Wallet Clearance Status', 'Admin Actions']}>
          {filteredTransactions.map((t) => {
            const rawId = t.db_id || parseInt(String(t.id).replace('tx-', ''), 10);
            const isPending = (t.status || '').toLowerCase().includes('pending');
            const isApproved = (t.status || '').toLowerCase().includes('approved');

            return (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs font-semibold">{t.id}</TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">{formatDate(t.date)}</TableCell>
                <TableCell className="font-bold text-zinc-950">{t.buyer}</TableCell>
                <TableCell className="text-xs text-zinc-900 font-medium">{t.product}</TableCell>
                <TableCell className="financial-num font-extrabold text-emerald-600 text-sm">
                  {formatCurrency(t.commission)}
                </TableCell>
                <TableCell className="space-y-1">
                  <Badge variant={isApproved ? 'success' : isPending ? 'warning' : 'danger'} dot>
                    {isPending ? 'Pending (Uncredited)' : isApproved ? 'Approved & Credited' : t.status}
                  </Badge>
                  {t.rejection_reason && (
                    <div className="text-[11px] text-rose-600 font-medium leading-tight">
                      Reason: {t.rejection_reason}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {!isApproved && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => updateStatusMutation.mutate({ id: rawId, status: 'Approved' })}
                        isLoading={updateStatusMutation.isPending && !rejectingTx}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                      >
                        Approve & Credit ₹{t.commission}
                      </Button>
                    )}
                    {t.status !== 'Reversed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={RotateCcw}
                        onClick={() => setRejectingTx({ id: rawId, buyer: t.buyer })}
                        isLoading={updateStatusMutation.isPending && rejectingTx?.id === rawId}
                        className="text-rose-600 hover:text-rose-700 hover:border-rose-300 text-xs font-semibold"
                      >
                        {isPending ? 'Reject' : 'Reverse'}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>

      <RejectionModal
        isOpen={!!rejectingTx}
        onClose={() => setRejectingTx(null)}
        title="Reject / Reverse Commission"
        targetName={rejectingTx?.buyer}
        isLoading={updateStatusMutation.isPending}
        onConfirm={(reason) => {
          if (rejectingTx) {
            updateStatusMutation.mutate({
              id: rejectingTx.id,
              status: 'Reversed',
              rejectionReason: reason,
            });
          }
        }}
      />
    </div>
  );
};
