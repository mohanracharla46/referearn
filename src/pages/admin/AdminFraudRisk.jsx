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
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const AdminFraudRisk = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: fraudLogs = [] } = useQuery({
    queryKey: ['fraudLogs'],
    queryFn: affiliateApi.getFraudLogs,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => {
      const dbId = typeof id === 'string' && id.startsWith('frd-') ? parseInt(id.replace('frd-', '')) : id;
      return affiliateApi.updateFraudStatus(dbId, status);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fraudLogs'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      addToast({ title: 'Security Action Taken', message: `Incident updated to ${variables.status}.`, type: 'success' });
    },
    onError: (err) => {
      addToast({ title: 'Action Failed', message: err.message, type: 'error' });
    }
  });

  const activeIncidents = fraudLogs.filter(f => f.status === 'Under Review').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Anti-Fraud & Risk Engine Console"
        subtitle="Automated detection for duplicate IP signups, click velocity anomalies, and cookie stuffing."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-rose-300 bg-rose-50/30">
          <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block">Critical Risk Alerts</span>
          <div className="financial-num text-3xl font-bold text-rose-950 mt-1">{activeIncidents} Incidents</div>
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
        <Table headers={['Incident ID', 'Timestamp', 'Affiliate Target', 'Detection Rule Triggered', 'IP Address', 'Risk Score', 'Status', 'Actions']}>
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
                <Badge variant={log.status === 'Resolved' ? 'success' : log.status === 'Blocked' || log.status === 'Suspended' ? 'danger' : 'warning'}>
                  {log.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {log.status === 'Under Review' && (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateMutation.mutate({ id: log.id, status: 'Blocked' })}
                        isLoading={updateMutation.isPending}
                      >
                        Block & Freeze
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMutation.mutate({ id: log.id, status: 'Resolved' })}
                        isLoading={updateMutation.isPending}
                      >
                        Dismiss
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
