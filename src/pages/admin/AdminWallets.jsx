import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

export const AdminWallets = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => affiliateApi.getAdminUsers(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Affiliate Wallets Ledger"
        subtitle="Monitor aggregate publisher balances, security reserves, and wallet freeze states."
      />

      <Card>
        <Table headers={['Affiliate ID', 'Affiliate Publisher', 'Total Earnings', 'Referrals', 'Risk Profile', 'Ledger Status']}>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-mono text-xs font-semibold">{u.id}</TableCell>
              <TableCell>
                <div className="font-bold text-zinc-950">{u.name}</div>
                <div className="text-[11px] text-zinc-500 font-mono">{u.email}</div>
              </TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">{formatCurrency(u.totalEarnings)}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-600">{u.referralsCount} refs</TableCell>
              <TableCell>
                <Badge variant={u.riskScore.includes('High') ? 'danger' : 'success'} dot>
                  {u.riskScore}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={u.status === 'Active' ? 'success' : 'danger'} dot>
                  {u.status === 'Active' ? 'Healthy' : 'Suspended / Frozen'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
