import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { formatDate } from '../../utils/formatters';

export const AdminAuditLogs = () => {
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: affiliateApi.getAuditLogs,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable System Audit Logs"
        subtitle="Cryptographically tracked log of all administrative actions, payout approvals, and system state mutations."
      />

      <Card>
        <Table headers={['Audit ID', 'Timestamp', 'Admin Actor', 'Operation Action', 'Execution Details', 'IP Address']}>
          {auditLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-xs font-semibold">{log.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(log.timestamp, true)}</TableCell>
              <TableCell className="font-bold text-zinc-950">{log.admin}</TableCell>
              <TableCell className="text-xs font-semibold text-zinc-900">{log.action}</TableCell>
              <TableCell className="text-xs text-zinc-600">{log.details}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{log.ip}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
