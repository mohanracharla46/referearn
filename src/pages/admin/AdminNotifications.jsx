import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../context/ToastContext';
import { Send, Bell } from 'lucide-react';

export const AdminNotifications = () => {
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('All');

  const handleBroadcast = (e) => {
    e.preventDefault();
    addToast({ title: 'Broadcast Sent', message: `System notification dispatched to ${audience} affiliates.`, type: 'success' });
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network Broadcast Notifications"
        subtitle="Dispatch system alerts, marketplace updates, or policy changes to affiliate publishers."
      />

      <div className="max-w-xl">
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
            <Button variant="primary" type="submit" className="w-full" icon={Send}>
              Dispatch System Broadcast
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
