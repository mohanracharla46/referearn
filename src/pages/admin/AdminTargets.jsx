import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Plus, Target } from 'lucide-react';

export const AdminTargets = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targets = [
    { id: 'tgt-1', title: 'September Elite Sprint', conversions: 50, reward: 5000.0, deadline: '2026-09-30T23:59:59Z', status: 'Active Sprint' },
    { id: 'tgt-2', title: 'August Founder Challenge', conversions: 25, reward: 2500.0, deadline: '2026-08-31T23:59:59Z', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliate Target Milestones"
        subtitle="Configure network-wide monthly conversion sprints and cash reward pools."
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={Plus}>
            Create Sprint Challenge
          </Button>
        }
      />

      <Card>
        <Table headers={['Sprint Title', 'Target Conversions', 'Reward Amount', 'Deadline', 'Status', 'Actions']}>
          {targets.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-bold text-zinc-950">{t.title}</TableCell>
              <TableCell className="font-mono text-xs font-semibold">{t.conversions} sales</TableCell>
              <TableCell className="financial-num font-bold text-zinc-950">{formatCurrency(t.reward)}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-500">{formatDate(t.deadline)}</TableCell>
              <TableCell>
                <Badge variant={t.status === 'Active Sprint' ? 'success' : 'default'} dot>
                  {t.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit Rules
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
