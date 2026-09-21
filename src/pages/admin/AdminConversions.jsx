import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminConversions = () => {
  const { data: conversions = [], isLoading } = useQuery({
    queryKey: ['conversions'],
    queryFn: () => affiliateApi.getTransactions(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conversion Verification Queue"
        subtitle="Review verified customer orders, trial conversions, and checkout attribution records."
      />

      <Card>
        <Table headers={['Conversion ID', 'Date', 'Customer Buyer', 'Product', 'Order Value', 'Status']}>
          {conversions.map((cnv) => (
            <TableRow key={cnv.id}>
              <TableCell className="font-mono text-xs font-semibold">{cnv.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(cnv.date)}</TableCell>
              <TableCell className="font-bold text-zinc-950">{cnv.buyer}</TableCell>
              <TableCell className="text-xs font-semibold text-zinc-900">{cnv.product}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">{formatCurrency(cnv.amount)}</TableCell>
              <TableCell>
                <Badge variant={cnv.status === 'Approved' ? 'success' : cnv.status === 'Pending' ? 'warning' : 'danger'} dot>
                  {cnv.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
