import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';
import { Bell, CheckCheck, DollarSign, ArrowUpRight, Target, Info } from 'lucide-react';

export const UserNotifications = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: affiliateApi.getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: affiliateApi.markNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'commission') return n.type === 'commission';
    if (activeTab === 'withdrawal') return n.type === 'withdrawal';
    if (activeTab === 'target') return n.type === 'target';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'commission':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-zinc-900" />;
      case 'target':
        return <Target className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications Center"
        subtitle="System alerts, commission approvals, payout receipts, and milestone updates."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => markReadMutation.mutate()}
            icon={CheckCheck}
          >
            Mark All as Read
          </Button>
        }
      />

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        tabs={[
          { id: 'all', label: 'All Alerts', count: notifications.length },
          { id: 'commission', label: 'Commissions' },
          { id: 'withdrawal', label: 'Withdrawals' },
          { id: 'target', label: 'Target Sprint' },
        ]}
      />

      <Card>
        <div className="divide-y divide-zinc-200">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">No notifications in this category.</div>
          ) : (
            filteredNotifs.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-start justify-between gap-4 transition-subtle ${
                  !item.read ? 'bg-zinc-50/80 font-medium' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-zinc-100 border border-zinc-200 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{item.title}</h4>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
                      {formatDate(item.date, true)}
                    </span>
                  </div>
                </div>

                {!item.read && (
                  <Badge variant="dark" className="shrink-0 text-[10px]">
                    UNREAD
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
