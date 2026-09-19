import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, XCircle, Check } from 'lucide-react';

export const AdminCommissions = () => {
  const { addToast } = useToast();
  const [commissions, setCommissions] = useState([
    { id: 'comm-501', affiliate: 'Kishore Kumar', product: 'GrowthCRM Suite', amount: 1874.75, date: '2026-09-16T19:40:00Z', status: 'Pending Approval' },
    { id: 'comm-502', affiliate: 'Sneha Kulkarni', product: 'CyberShield Security', amount: 2849.85, date: '2026-09-15T09:20:00Z', status: 'Pending Approval' },
    { id: 'comm-503', affiliate: 'Aditya Rao', product: 'StackCloud Enterprise', amount: 2999.80, date: '2026-09-14T16:05:00Z', status: 'Approved' },
  ]);

  const handleApprove = (id) => {
    setCommissions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Approved' } : c))
    );
    addToast({ title: 'Commission Approved', message: `Commission ${id} cleared for payout.`, type: 'success' });
  };

  const handleMassApprove = () => {
    setCommissions((prev) => prev.map((c) => ({ ...c, status: 'Approved' })));
    addToast({ title: 'Batch Clearance', message: 'All pending commissions cleared.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission Queue & Clearance Control"
        subtitle="Approve pending affiliate commissions or hold disputed transactions."
        actions={
          <Button variant="primary" size="sm" onClick={handleMassApprove} icon={Check}>
            Mass Approve Pending Queue
          </Button>
        }
      />

      <Card>
        <Table headers={['Commission ID', 'Date', 'Affiliate Publisher', 'Product', 'Commission Value', 'Status', 'Actions']}>
          {commissions.map((comm) => (
            <TableRow key={comm.id}>
              <TableCell className="font-mono text-xs font-semibold">{comm.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(comm.date)}</TableCell>
              <TableCell className="font-bold text-zinc-950">{comm.affiliate}</TableCell>
              <TableCell className="text-xs text-zinc-900">{comm.product}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">
                {formatCurrency(comm.amount)}
              </TableCell>
              <TableCell>
                <Badge variant={comm.status === 'Approved' ? 'success' : 'warning'} dot>
                  {comm.status}
                </Badge>
              </TableCell>
              <TableCell>
                {comm.status === 'Pending Approval' && (
                  <div className="flex items-center gap-1.5">
                    <Button variant="primary" size="sm" onClick={() => handleApprove(comm.id)}>
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      Hold
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
