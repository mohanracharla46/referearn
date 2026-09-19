import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

export const AdminReferrals = () => {
  const referralLogs = [
    { id: 'log-801', referrer: 'Aditya Rao (usr-101)', ip: '49.207.182.11', targetProduct: 'StackCloud Enterprise', timestamp: '2026-09-18T14:32:00Z', status: 'Converted' },
    { id: 'log-802', referrer: 'Sneha Kulkarni (usr-102)', ip: '103.22.180.4', targetProduct: 'PayFlow API', timestamp: '2026-09-18T12:15:00Z', status: 'Converted' },
    { id: 'log-803', referrer: 'Kishore Kumar (usr-9841)', ip: '157.33.91.205', targetProduct: 'GrowthCRM Suite', timestamp: '2026-09-18T09:40:00Z', status: 'Click Recorded' },
    { id: 'log-804', referrer: 'Rajesh Gupta (usr-103)', ip: '49.207.182.11', targetProduct: 'StackCloud Enterprise', timestamp: '2026-09-18T08:10:00Z', status: 'Flagged (Self-Ref)' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Raw Referral Traffic Stream"
        subtitle="Real-time log of incoming affiliate traffic clicks, IP geolocation, and attribution links."
      />

      <Card>
        <Table headers={['Log ID', 'Timestamp', 'Affiliate Publisher', 'IP Address', 'Target Product', 'Status']}>
          {referralLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-xs font-semibold">{log.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(log.timestamp, true)}</TableCell>
              <TableCell className="font-bold text-zinc-950">{log.referrer}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-600">{log.ip}</TableCell>
              <TableCell className="text-xs text-zinc-900">{log.targetProduct}</TableCell>
              <TableCell>
                <Badge variant={log.status.includes('Converted') ? 'success' : log.status.includes('Flagged') ? 'danger' : 'info'} dot>
                  {log.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
