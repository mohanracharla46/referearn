import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../context/ToastContext';
import { User, ShieldCheck, Lock, Landmark, Bell, Sliders } from 'lucide-react';

export const UserProfileSettings = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('account');

  // Account State
  const [name, setName] = useState(user?.name || 'Kishore Kumar');
  const [email, setEmail] = useState(user?.email || 'kishore@referearn.io');

  // Payment State
  const [upiId, setUpiId] = useState(user?.upiId || 'kishore@okaxis');
  const [bankAccount, setBankAccount] = useState('409218902410');
  const [ifsc, setIfsc] = useState('HDFC0001234');

  // Password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      title: 'Settings Saved',
      message: 'Your profile settings have been successfully updated.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Profile & Settings"
        subtitle="Manage your publisher identity, security parameters, payout accounts, and preferences."
      />

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
        tabs={[
          { id: 'account', label: 'Account Profile', icon: User },
          { id: 'payment', label: 'Payment & Payouts', icon: Landmark },
          { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
          { id: 'password', label: 'Change Password', icon: Lock },
          { id: 'notifications', label: 'Email Preferences', icon: Bell },
          { id: 'preferences', label: 'System Preferences', icon: Sliders },
        ]}
      />

      <div className="max-w-2xl">
        {activeTab === 'account' && (
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Personal & Publisher Information</h3>}>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Publisher Affiliate Tier"
                value={user?.tier || 'Platinum Affiliate'}
                readOnly
                helperText="Tiers are automatically updated based on monthly conversion volume."
              />
              <Button variant="primary" type="submit">
                Save Account Changes
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'payment' && (
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Bank Account & UPI Payout Settings</h3>}>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Primary UPI Handle (VPA)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@okicici"
                helperText="Used for zero-fee instant payouts"
              />
              <Input
                label="Bank Account Number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              />
              <Input
                label="IFSC Branch Code"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
              />
              <Button variant="primary" type="submit">
                Save Payout Accounts
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Two-Factor Authentication (2FA)</h3>}>
            <div className="space-y-4 text-xs text-zinc-600">
              <p>Two-factor authentication adds an extra layer of security to your monetary withdrawals.</p>
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-zinc-900">Authenticator App 2FA</h4>
                  <p className="text-[11px] text-zinc-500">Google Authenticator or Authy</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'password' && (
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Update Account Password</h3>}>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
              />
              <Button variant="primary" type="submit">
                Update Password
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Email Alerts & Digest</h3>}>
            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-zinc-950" />
                <span>Notify me immediately on every approved commission sale</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-zinc-950" />
                <span>Send email receipt when payout withdrawal is completed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-zinc-950" />
                <span>Weekly affiliate performance digest summary</span>
              </label>
            </div>
          </Card>
        )}

        {activeTab === 'preferences' && (
          <Card header={<h3 className="text-sm font-semibold text-zinc-900">Platform Regional Preferences</h3>}>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 uppercase block mb-1">Base Payout Currency</label>
                <span className="font-mono text-sm font-bold text-zinc-900">INR (₹) - Indian Rupee</span>
              </div>
              <div>
                <label className="font-semibold text-zinc-700 uppercase block mb-1">Timezone</label>
                <span className="font-mono text-sm font-bold text-zinc-900">Asia/Kolkata (IST +05:30)</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
