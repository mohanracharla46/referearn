import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

export const AdminWallets = () => {
  const wallets = [
    { id: 'wlt-101', affiliate: 'Aditya Rao (usr-101)', available: 42500.0, pending: 12000.0, locked: 2500.0, status: 'Healthy' },
    { id: 'wlt-102', affiliate: 'Sneha Kulkarni (usr-102)', available: 18400.0, pending: 5400.0, locked: 1000.0, status: 'Healthy' },
    { id: 'wlt-103', affiliate: 'Kishore Kumar (usr-9841)', available: 7500.0, pending: 3200.0, locked: 1000.0, status: 'Healthy' },
    { id: 'wlt-104', affiliate: 'Rajesh Gupta (usr-103)', available: 0.0, pending: 12000.0, locked: 12000.0, status: 'Frozen (Risk Flag)' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Affiliate Wallets Ledger"
        subtitle="Monitor aggregate publisher balances, security reserves, and wallet freeze states."
      />

      <Card>
        <Table headers={['Wallet ID', 'Affiliate Publisher', 'Available Balance', 'Pending Balance', 'Locked Reserve', 'Ledger Status']}>
          {wallets.map((w) => (
            <TableRow key={w.id}>
              <TableCell className="font-mono text-xs font-semibold">{w.id}</TableCell>
              <TableCell className="font-bold text-zinc-950">{w.affiliate}</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">{formatCurrency(w.available)}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-600">{formatCurrency(w.pending)}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatCurrency(w.locked)}</TableCell>
              <TableCell>
                <Badge variant={w.status.includes('Healthy') ? 'success' : 'danger'} dot>
                  {w.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
