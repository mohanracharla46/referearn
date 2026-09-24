import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, XCircle, Search, Clock, Users, UserCheck, AlertCircle } from 'lucide-react';
import { RejectionModal } from '../../components/ui/RejectionModal';

export const AdminReferrals = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Pending', 'Approved', 'Rejected'
  const [rejectingReferral, setRejectingReferral] = useState(null);

  const { data: rawReferrals = [], isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => affiliateApi.getReferrals(),
    refetchInterval: 3000,
  });

  const referrals = Array.isArray(rawReferrals) ? rawReferrals : (rawReferrals?.data || []);

  const approveReferralMutation = useMutation({
    mutationFn: ({ id, status }) => affiliateApi.updateReferralStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      addToast({
        title: 'Referral Commission Approved',
        message: '₹10.00 commission credited to affiliate available balance.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({ title: 'Approval Failed', message: err.message, type: 'error' });
    }
  });

  const rejectReferralMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }) =>
      affiliateApi.updateReferralStatus(id, status, rejectionReason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setRejectingReferral(null);
      addToast({
        title: 'Referral Submission Rejected',
        message: `Referral status updated to Rejected. Reason: ${variables.rejectionReason}`,
        type: 'info',
      });
    },
    onError: (err) => {
      addToast({ title: 'Rejection Failed', message: err.message, type: 'error' });
    }
  });

  // Calculate Tab Counts
  const allCount = referrals.length;
  const pendingCount = referrals.filter(r => (r.status.includes('Pending') || r.totalEarned === 0) && !r.status.includes('Rejected')).length;
  const approvedCount = referrals.filter(r => r.status.includes('Converted') || r.status.includes('Approved')).length;
  const rejectedCount = referrals.filter(r => r.status.includes('Rejected')).length;

  // Filtered referrals based on search and active tab
  const filteredReferrals = referrals.filter((r) => {
    const matchesSearch =
      (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.product || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.referrer_name || r.referrerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.referrer_email || r.referrerEmail || '').toLowerCase().includes(search.toLowerCase());

    const isPending = (r.status.includes('Pending') || r.totalEarned === 0) && !r.status.includes('Rejected');
    const isApproved = r.status.includes('Converted') || r.status.includes('Approved');
    const isRejected = r.status.includes('Rejected');

    let matchesTab = true;
    if (activeTab === 'Pending') matchesTab = isPending;
    else if (activeTab === 'Approved') matchesTab = isApproved;
    else if (activeTab === 'Rejected') matchesTab = isRejected;

    return matchesSearch && matchesTab;
  });

  // Time formatting helper
  const getReferralTimeInfo = (r) => {
    const rawDate = r.created_at || r.date;
    const dateObj = rawDate ? new Date(rawDate) : new Date();
    const isValid = !isNaN(dateObj.getTime());
    
    const refDate = isValid ? dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : formatDate(r.date);
    const refTime = isValid ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : '12:00:00 PM';
    const timestamp = isValid ? Math.floor(dateObj.getTime() / 1000) : 1790250615;

    return { refDate, refTime, timestamp };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referral System Management"
        subtitle="Manage and inspect incoming affiliate referrals, timestamp logs, referrer attribution, and conversion clearance."
      />

      {/* Four Main Section Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200">
        <button
          onClick={() => setActiveTab('All')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'All'
              ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-500" />
          <span>All Referrals</span>
          <span className="ml-1 bg-zinc-200 text-zinc-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{allCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('Pending')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'Pending'
              ? 'bg-white text-amber-900 shadow-xs border border-amber-200'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Pending Approvals</span>
          <span className="ml-1 bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{pendingCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('Approved')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'Approved'
              ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-500" />
          <span>Approved Referrals</span>
          <span className="ml-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{approvedCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('Rejected')}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'Rejected'
              ? 'bg-white text-rose-900 shadow-xs border border-rose-200'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>Rejected Referrals</span>
          <span className="ml-1 bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-mono">{rejectedCount}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search by contact name, email, referrer, or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        <div className="text-xs text-zinc-500 font-mono">
          Showing <strong className="text-zinc-900">{filteredReferrals.length}</strong> of {referrals.length} records
        </div>
      </div>

      {/* Referrals Table with All Requested Fields */}
      <Card header={<div className="text-xs font-bold text-zinc-600 uppercase font-mono">{activeTab} Section Ledger</div>}>
        <Table headers={['Referral ID', 'Referral Date & Time', 'Referrer User (ID & Email)', 'Referred User Details', 'Product / Link', 'Commission Status', 'Actions']}>
          {filteredReferrals.map((r) => {
            const rawId = r.db_id || parseInt(String(r.id).replace('ref-', ''), 10);
            const isPending = (r.status.includes('Pending') || r.totalEarned === 0) && !r.status.includes('Rejected');
            const referrerDisplay = r.referrer_name || r.referrerName || (r.user ? r.user.name : 'User A');
            const referrerMail = r.referrer_email || r.referrerEmail || (r.user ? r.user.email : 'referrer@referearn.io');
            const referrerId = r.user_id ? `usr-${r.user_id}` : (r.referrerId || 'usr-1');

            const timeInfo = getReferralTimeInfo(r);

            return (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs font-semibold">{r.id}</TableCell>

                {/* Referral Date, Time & Timestamp */}
                <TableCell className="text-xs space-y-0.5">
                  <div className="font-bold text-zinc-900">{timeInfo.refDate}</div>
                  <div className="text-[11px] text-zinc-600 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{timeInfo.refTime}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    TS: <span className="text-zinc-700 font-bold">{timeInfo.timestamp}</span>
                  </div>
                </TableCell>

                {/* Referrer User ID / Email */}
                <TableCell className="text-xs">
                  <div className="font-semibold text-indigo-700">{referrerDisplay}</div>
                  <div className="text-[11px] text-zinc-600 font-mono">{referrerMail}</div>
                  <div className="text-[10px] text-zinc-400 font-mono font-bold">ID: {referrerId}</div>
                </TableCell>

                {/* Referred User Details */}
                <TableCell className="text-xs">
                  <div className="font-bold text-zinc-950">{r.name}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{r.email}</div>
                </TableCell>

                {/* Product */}
                <TableCell className="text-xs font-medium text-zinc-800">
                  {r.product}
                </TableCell>

                {/* Status */}
                <TableCell className="space-y-1">
                  <Badge
                    variant={
                      r.status.includes('Converted') || r.status.includes('Approved')
                        ? 'success'
                        : r.status.includes('Rejected')
                        ? 'danger'
                        : 'warning'
                    }
                    dot
                  >
                    {r.status}
                  </Badge>
                  {r.rejection_reason && (
                    <div className="text-[10px] text-rose-600 font-medium leading-tight">
                      Reason: {r.rejection_reason}
                    </div>
                  )}
                </TableCell>

                {/* Clearance Actions */}
                <TableCell>
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => approveReferralMutation.mutate({ id: rawId, status: 'Converted (₹10 Credited)' })}
                        isLoading={approveReferralMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={XCircle}
                        onClick={() => setRejectingReferral({ id: rawId, name: r.name })}
                        isLoading={rejectReferralMutation.isPending && rejectingReferral?.id === rawId}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
                      >
                        Reject
                      </Button>
                    </div>
                  ) : r.status.includes('Rejected') ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => approveReferralMutation.mutate({ id: rawId, status: 'Converted (₹10 Credited)' })}
                        isLoading={approveReferralMutation.isPending}
                        className="text-emerald-700 hover:bg-emerald-50 border-emerald-300 font-semibold text-xs py-1 px-2.5"
                      >
                        Re-Approve
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 font-medium">Cleared</span>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={XCircle}
                        onClick={() => setRejectingReferral({ id: rawId, name: r.name })}
                        isLoading={rejectReferralMutation.isPending && rejectingReferral?.id === rawId}
                        className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs font-semibold py-0.5 px-2"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>

      <RejectionModal
        isOpen={!!rejectingReferral}
        onClose={() => setRejectingReferral(null)}
        title="Reject Referral Account"
        targetName={rejectingReferral?.name}
        isLoading={rejectReferralMutation.isPending}
        onConfirm={(reason) => {
          if (rejectingReferral) {
            rejectReferralMutation.mutate({
              id: rejectingReferral.id,
              status: 'Rejected',
              rejectionReason: reason,
            });
          }
        }}
      />
    </div>
  );
};
