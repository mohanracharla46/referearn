import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Send, Bell } from 'lucide-react';

export const AdminNotifications = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('All');

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: affiliateApi.getNotifications,
  });

  const broadcastMutation = useMutation({
    mutationFn: affiliateApi.broadcastNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      addToast({ title: 'Broadcast Sent', message: `System notification dispatched to ${audience} affiliates.`, type: 'success' });
      setTitle('');
      setMessage('');
    },
    onError: (err) => {
      addToast({ title: 'Broadcast Failed', message: err.message, type: 'error' });
    }
  });

  const handleBroadcast = (e) => {
    e.preventDefault();
    broadcastMutation.mutate({ title, message, audience });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network Broadcast Notifications"
        subtitle="Dispatch system alerts, marketplace updates, or policy changes to affiliate publishers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Broadcast Message Composer</h3>}>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <Select
                label="Target Audience Tier"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                options={[
                  { value: 'All', label: 'All Registered Publishers' },
                  { value: 'Platinum', label: 'Platinum Tier Only' },
                  { value: 'Gold', label: 'Gold Tier Only' },
                ]}
              />
              <Input
                label="Notification Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New StackCloud 20% Commission Campaign"
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Message Body
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white text-zinc-900 text-sm rounded-md border border-zinc-200 p-3 h-28 focus:outline-none focus:border-zinc-950"
                  placeholder="Enter alert text..."
                  required
                />
              </div>
              <Button variant="primary" type="submit" isLoading={broadcastMutation.isPending} className="w-full" icon={Send}>
                Dispatch System Broadcast
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Active Notification Stream</h3>}>
            <Table headers={['Date', 'Title & Message', 'Type', 'Status']}>
              {notifications.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-mono text-xs text-zinc-500 whitespace-nowrap">{formatDate(n.date, true)}</TableCell>
                  <TableCell>
                    <div className="font-bold text-zinc-950 text-xs">{n.title}</div>
                    <div className="text-[11px] text-zinc-600 line-clamp-2">{n.message}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">{n.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={n.read ? 'default' : 'success'} dot>
                      {n.read ? 'Read' : 'Active'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};
