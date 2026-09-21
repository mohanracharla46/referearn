import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const AdminWithdrawals = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ['adminWithdrawals'],
    queryFn: affiliateApi.getWithdrawals,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => {
      const dbId = typeof id === 'string' && id.startsWith('wd-') ? parseInt(id.replace('wd-', '')) : id;
      return affiliateApi.approveWithdrawal(dbId);
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      addToast({ title: 'Payout Processed', message: `Withdrawal ${id} approved & funds disbursed via gateway API.`, type: 'success' });
    },
    onError: (err) => {
      addToast({ title: 'Approval Failed', message: err.message, type: 'error' });
    }
  });

  const batchMutation = useMutation({
    mutationFn: affiliateApi.batchApproveWithdrawals,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      addToast({ title: 'Batch Payout Executed', message: res.message || 'All pending withdrawal payouts dispatched.', type: 'success' });
    },
    onError: (err) => {
      addToast({ title: 'Batch Payout Failed', message: err.message, type: 'error' });
    }
  });

  const hasPending = withdrawals.some((w) => w.status === 'Pending Approval' || w.status === 'Pending');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payout Execution & Disbursal Queue"
        subtitle="Process pending affiliate withdrawal requests, trigger gateway disbursals, and handle bank IMPS queues."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => batchMutation.mutate()}
            isLoading={batchMutation.isPending}
            disabled={!hasPending}
            icon={ArrowUpRight}
            className="w-full sm:w-auto text-xs font-bold"
          >
            Execute Pending Batch Disbursal
          </Button>
        }
      />

      <Card>
        <Table headers={['Request ID', 'Timestamp', 'Affiliate Publisher', 'Method & Destination', 'Amount', 'Status', 'Actions']}>
          {withdrawals.map((wd) => (
            <TableRow key={wd.id}>
              <TableCell className="font-mono text-xs font-semibold">{wd.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500 whitespace-nowrap">{formatDate(wd.requestedAt, true)}</TableCell>
              <TableCell className="font-bold text-zinc-950 whitespace-nowrap">{wd.affiliate}</TableCell>
              <TableCell className="min-w-[180px]">
                <div className="font-medium text-zinc-900 text-xs sm:text-sm">{wd.method}</div>
                <div className="text-[11px] font-mono text-zinc-500 truncate">{wd.destination}</div>
              </TableCell>
              <TableCell className="financial-num font-bold text-zinc-950 whitespace-nowrap">{formatCurrency(wd.amount)}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={wd.status === 'Completed' ? 'success' : 'warning'} dot>
                  {wd.status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {(wd.status === 'Pending Approval' || wd.status === 'Pending') && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => approveMutation.mutate(wd.db_id || wd.id)}
                    isLoading={approveMutation.isPending}
                    className="text-xs font-semibold"
                  >
                    Approve & Disburse
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
