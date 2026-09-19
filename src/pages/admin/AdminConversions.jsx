import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminConversions = () => {
  const conversions = [
    { id: 'cnv-901', date: '2026-09-18T14:32:00Z', affiliate: 'Kishore Kumar', buyer: 'Vikram Mehta', product: 'StackCloud Enterprise', amount: 14999.0, status: 'Verified Sale' },
    { id: 'cnv-902', date: '2026-09-17T11:15:00Z', affiliate: 'Aditya Rao', buyer: 'Anita Sharma', product: 'PayFlow API', amount: 9999.0, status: 'Verified Sale' },
    { id: 'cnv-903', date: '2026-09-16T19:40:00Z', affiliate: 'Sneha Kulkarni', buyer: 'Suresh Patel', product: 'GrowthCRM Suite', amount: 7499.0, status: 'Pending Clearance' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conversion Verification Queue"
        subtitle="Review verified customer orders, trial conversions, and checkout attribution records."
      />

      <Card>
        <Table headers={['Conversion ID', 'Date', 'Affiliate Publisher', 'Customer Buyer', 'Product', 'Order Value', 'Status']}>
          {conversions.map((cnv) => (
            <TableRow key={cnv.id}>
              <TableCell className="font-mono text-xs font-semibold">{cnv.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(cnv.date)}</TableCell>
              <TableCell className="font-bold text-zinc-950">{cnv.affiliate}</TableCell>
              <TableCell className="text-xs text-zinc-600">{cnv.buyer}</TableCell>
              <TableCell className="text-xs font-semibold text-zinc-900">{cnv.product}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">{formatCurrency(cnv.amount)}</TableCell>
              <TableCell>
                <Badge variant={cnv.status.includes('Verified') ? 'success' : 'warning'} dot>
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
