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
import { Check, CheckCircle2, RotateCcw, Search, Clock, ShieldCheck } from 'lucide-react';

export const AdminCommissions = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => affiliateApi.getTransactions(),
    refetchInterval: 3000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => affiliateApi.updateTransactionStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      
      const actionText = variables.status === 'Approved' ? 'approved and credited to client wallet balance' : `marked as ${variables.status}`;
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

  const pendingCount = transactions.filter(t => t.status === 'Pending').length;

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      (t.buyer || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.product || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.id || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission Queue & Clearance Control"
        subtitle="Approve pending affiliate commissions to credit client wallet balance, or reverse disputed earnings."
      />

      {/* Info notice box */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Approval Rule:</strong> When commissions are created, they remain in <strong>Pending</strong> state. Once an Admin clicks <strong>Approve</strong>, the commission amount is instantly deducted from Pending Earnings and credited to the Affiliate's Available Balance & Total Cleared Revenue.
          </span>
        </div>
        {pendingCount > 0 && (
          <span className="bg-amber-500 text-white font-bold px-2.5 py-1 rounded-full text-xs shrink-0 shadow-xs">
            {pendingCount} Pending Approval
          </span>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <Input
          placeholder="Search by buyer, product, or transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          className="w-full sm:w-80"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'All', label: `All Transactions (${transactions.length})` },
            { value: 'Pending', label: `Pending Approval (${pendingCount})` },
            { value: 'Approved', label: 'Approved (Credited)' },
            { value: 'Reversed', label: 'Reversed / Cancelled' },
          ]}
          className="w-full sm:w-56"
        />
      </div>

      <Card>
        <Table headers={['Transaction ID', 'Date', 'Customer / Buyer', 'Product / Event', 'Commission Value', 'Wallet Status', 'Admin Action']}>
          {filteredTransactions.map((t) => {
            const rawId = t.db_id || parseInt(String(t.id).replace('tx-', ''), 10);
            return (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs font-semibold">{t.id}</TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">{formatDate(t.date)}</TableCell>
                <TableCell className="font-bold text-zinc-950">{t.buyer}</TableCell>
                <TableCell className="text-xs text-zinc-900">{t.product}</TableCell>
                <TableCell className="financial-num font-bold text-zinc-950 text-sm">
                  {formatCurrency(t.commission)}
                </TableCell>
                <TableCell>
                  <Badge variant={t.status === 'Approved' ? 'success' : t.status === 'Pending' ? 'warning' : 'danger'} dot>
                    {t.status === 'Pending' ? 'Pending (Uncredited)' : t.status === 'Approved' ? 'Approved (Credited)' : t.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {t.status !== 'Approved' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => updateStatusMutation.mutate({ id: rawId, status: 'Approved' })}
                        isLoading={updateStatusMutation.isPending}
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
                        onClick={() => updateStatusMutation.mutate({ id: rawId, status: 'Reversed' })}
                        isLoading={updateStatusMutation.isPending}
                        className="text-rose-600 hover:text-rose-700 hover:border-rose-300 text-xs"
                      >
                        {t.status === 'Pending' ? 'Reject' : 'Reverse'}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </div>
  );
};
