import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

export const AdminFraudRisk = () => {
  const { addToast } = useToast();

  const { data: fraudLogs = [] } = useQuery({
    queryKey: ['fraudLogs'],
    queryFn: affiliateApi.getFraudLogs,
  });

  const handleAction = (id, action) => {
    addToast({ title: 'Security Action Taken', message: `Incident ${id}: ${action} executed.`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Anti-Fraud & Risk Engine Console"
        subtitle="Automated detection for duplicate IP signups, click velocity anomalies, and cookie stuffing."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-rose-300 bg-rose-50/30">
          <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block">Critical Risk Alerts</span>
          <div className="financial-num text-3xl font-bold text-rose-950 mt-1">4 Incidents</div>
          <span className="text-xs text-rose-700 mt-2 block">Action required</span>
        </Card>
        <Card>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Active IP Blocklist</span>
          <div className="financial-num text-3xl font-bold text-zinc-950 mt-1">128 IPs</div>
          <span className="text-xs text-zinc-500 mt-2 block">Automated firewall active</span>
        </Card>
        <Card>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Risk Engine Uptime</span>
          <div className="financial-num text-3xl font-bold text-zinc-950 mt-1">99.98%</div>
          <span className="text-xs text-emerald-700 font-semibold mt-2 block">Real-time heuristics active</span>
        </Card>
      </div>

      <Card header={<h3 className="text-sm font-semibold text-zinc-900">Flagged Risk Incident Log</h3>}>
        <Table headers={['Incident ID', 'Timestamp', 'Affiliate Target', 'Detection Rule Triggered', 'IP Address', 'Risk Score', 'Actions']}>
          {fraudLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-xs font-semibold text-rose-950">{log.id}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(log.timestamp, true)}</TableCell>
              <TableCell className="font-bold text-zinc-950">{log.affiliate}</TableCell>
              <TableCell className="text-xs font-semibold text-zinc-900">{log.trigger}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-600">{log.ipAddress}</TableCell>
              <TableCell>
                <Badge variant={log.riskScore > 85 ? 'danger' : 'warning'} className="font-bold">
                  SCORE: {log.riskScore}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Button variant="danger" size="sm" onClick={() => handleAction(log.id, 'Account Blocked')}>
                    Block & Freeze
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAction(log.id, 'Cleared as False Positive')}>
                    Dismiss
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
