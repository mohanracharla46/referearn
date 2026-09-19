// Initial Mock Data for User & Admin Portals

export const INITIAL_USER_STATS = {
  totalEarnings: 42850.00,
  thisMonthEarnings: 12400.00,
  availableBalance: 7500.00,
  pendingEarnings: 3200.00,
  lockedBalance: 1000.00,
  totalReferrals: 148,
  activeReferrals: 92,
  conversionRate: 8.4,
  totalClicks: 1760,
  earningsGrowth: 14.2,
  referralGrowth: 9.8,
};

export const INITIAL_TARGET = {
  id: 'tgt-1',
  title: 'September Elite Sprint',
  targetConversions: 50,
  currentConversions: 38,
  percentage: 76,
  rewardAmount: 5000.00,
  deadline: '2026-09-30T23:59:59Z',
  completed: false,
  remainingConversions: 12,
};

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'StackCloud Enterprise Hosting',
    category: 'Cloud',
    price: 14999.00,
    commission: '20%',
    commissionValue: 2999.80,
    commissionType: 'Percentage',
    status: 'Active',
    rating: 4.9,
    conversions: 42,
    description: 'Managed Kubernetes and enterprise cloud infrastructure hosting.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
    rules: 'Cookie length: 90 days. Minimum payout after 14-day refund period.',
    assets: [
      { name: 'Banner 728x90', size: '120 KB', type: 'Image' },
      { name: 'Email Copy Template', size: '15 KB', type: 'DOCX' },
    ],
  },
  {
    id: 'prod-2',
    name: 'PayFlow Payment Gateway API',
    category: 'Fintech',
    price: 9999.00,
    commission: '₹1,500',
    commissionValue: 1500.00,
    commissionType: 'Flat Rate',
    status: 'Active',
    rating: 4.8,
    conversions: 67,
    description: 'Developer-friendly unified checkout API for merchant payments.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80',
    rules: 'Payout granted upon first successful merchant transaction exceeding ₹5,000.',
    assets: [
      { name: 'Integration Guide', size: '2.4 MB', type: 'PDF' },
      { name: 'Logo Pack SVG', size: '850 KB', type: 'ZIP' },
    ],
  },
  {
    id: 'prod-3',
    name: 'GrowthCRM Automation Suite',
    category: 'Software',
    price: 7499.00,
    commission: '25%',
    commissionValue: 1874.75,
    commissionType: 'Percentage',
    status: 'Active',
    rating: 4.7,
    conversions: 29,
    description: 'AI-driven pipeline management and customer messaging suite.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    rules: 'Recurring commission on annual subscription renewals.',
    assets: [
      { name: 'Product Demo Reel', size: '14 MB', type: 'MP4' },
    ],
  },
  {
    id: 'prod-4',
    name: 'CyberShield Endpoint Security',
    category: 'Developer Tools',
    price: 18999.00,
    commission: '15%',
    commissionValue: 2849.85,
    commissionType: 'Percentage',
    status: 'Active',
    rating: 4.9,
    conversions: 18,
    description: 'Zero-trust network protection and automated malware detection.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80',
    rules: 'Enterprise lead signups require domain verification.',
    assets: [
      { name: 'Security One-Pager', size: '450 KB', type: 'PDF' },
    ],
  },
  {
    id: 'prod-5',
    name: 'OmniSEO Keyword Tracker',
    category: 'Marketing',
    price: 4999.00,
    commission: '₹800',
    commissionValue: 800.00,
    commissionType: 'Flat Rate',
    status: 'Active',
    rating: 4.6,
    conversions: 55,
    description: 'Real-time SERP ranking tracker and competitor content auditor.',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80',
    rules: 'Cookie length: 60 days. Standard referral link rules apply.',
    assets: [
      { name: 'Social Banner Pack', size: '5.1 MB', type: 'ZIP' },
    ],
  },
  {
    id: 'prod-6',
    name: 'DataPulse Analytics Engine',
    category: 'Developer Tools',
    price: 12499.00,
    commission: '18%',
    commissionValue: 2249.82,
    commissionType: 'Percentage',
    status: 'Active',
    rating: 4.8,
    conversions: 22,
    description: 'High-speed event stream processor and real-time dashboard.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    rules: '30-day payout window.',
    assets: [
      { name: 'Case Study Deck', size: '3.2 MB', type: 'PDF' },
    ],
  }
];

export const INITIAL_TRANSACTIONS = [
  { id: 'tx-101', date: '2026-09-18T14:32:00Z', product: 'StackCloud Enterprise Hosting', buyer: 'Vikram Mehta', amount: 14999.00, commission: 2999.80, status: 'Approved', type: 'Sale' },
  { id: 'tx-102', date: '2026-09-17T11:15:00Z', product: 'PayFlow Payment Gateway API', buyer: 'Anita Sharma', amount: 9999.00, commission: 1500.00, status: 'Approved', type: 'Sale' },
  { id: 'tx-103', date: '2026-09-16T19:40:00Z', product: 'GrowthCRM Automation Suite', buyer: 'Suresh Patel', amount: 7499.00, commission: 1874.75, status: 'Pending', type: 'Sale' },
  { id: 'tx-104', date: '2026-09-15T09:20:00Z', product: 'CyberShield Endpoint Security', buyer: 'Rohan Verma', amount: 18999.00, commission: 2849.85, status: 'Approved', type: 'Sale' },
  { id: 'tx-105', date: '2026-09-14T16:05:00Z', product: 'OmniSEO Keyword Tracker', buyer: 'Pooja Nair', amount: 4999.00, commission: 800.00, status: 'Approved', type: 'Sale' },
  { id: 'tx-106', date: '2026-09-12T13:45:00Z', product: 'StackCloud Enterprise Hosting', buyer: 'Karan Singhania', amount: 14999.00, commission: 2999.80, status: 'Reversed', type: 'Refund' },
  { id: 'tx-107', date: '2026-09-10T08:10:00Z', product: 'PayFlow Payment Gateway API', buyer: 'Deepak Joshi', amount: 9999.00, commission: 1500.00, status: 'Approved', type: 'Sale' },
];

export const INITIAL_WITHDRAWALS = [
  { id: 'wd-801', requestedAt: '2026-09-15T10:00:00Z', amount: 5000.00, method: 'UPI Instant Payout', destination: 'user@okicici', status: 'Completed', reference: 'UPI/692019482104' },
  { id: 'wd-802', requestedAt: '2026-09-01T14:30:00Z', amount: 10000.00, method: 'HDFC Bank IMPS', destination: 'HDFC0001234 •••• 9841', status: 'Completed', reference: 'IMPS/9812401928' },
  { id: 'wd-803', requestedAt: '2026-08-15T11:20:00Z', amount: 7500.00, method: 'UPI Instant Payout', destination: 'user@okicici', status: 'Completed', reference: 'UPI/1092830192' },
];

export const INITIAL_REFERRALS = [
  { id: 'ref-1', name: 'Vikram Mehta', email: 'vikram.m@techcorp.in', date: '2026-09-18', product: 'StackCloud Enterprise Hosting', clicks: 14, status: 'Converted', totalEarned: 2999.80 },
  { id: 'ref-2', name: 'Anita Sharma', email: 'anita.s@finventures.com', date: '2026-09-17', product: 'PayFlow Payment Gateway API', clicks: 8, status: 'Converted', totalEarned: 1500.00 },
  { id: 'ref-3', name: 'Devendra Kumar', email: 'dev.kumar@gmail.com', date: '2026-09-17', product: 'GrowthCRM Automation Suite', clicks: 22, status: 'Active (Trial)', totalEarned: 0.00 },
  { id: 'ref-4', name: 'Suresh Patel', email: 'suresh@patellabs.io', date: '2026-09-16', product: 'GrowthCRM Automation Suite', clicks: 5, status: 'Converted', totalEarned: 1874.75 },
  { id: 'ref-5', name: 'Priya Sundaram', email: 'priya@designstudio.co', date: '2026-09-15', product: 'OmniSEO Keyword Tracker', clicks: 3, status: 'Pending Payment', totalEarned: 0.00 },
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'notif-1', title: 'Commission Approved', message: 'You earned ₹2,999.80 from StackCloud sale to Vikram Mehta.', type: 'commission', date: '2026-09-18T14:32:00Z', read: false },
  { id: 'notif-2', title: 'Withdrawal Processed', message: 'Your payout of ₹5,000.00 to user@okicici was successful.', type: 'withdrawal', date: '2026-09-15T10:05:00Z', read: false },
  { id: 'notif-3', title: 'Target Milestone Alert', message: 'You are 12 conversions away from unlocking the ₹5,000 September bonus.', type: 'target', date: '2026-09-14T09:00:00Z', read: true },
  { id: 'notif-4', title: 'New Marketing Assets', message: 'GrowthCRM added 3 new video banner assets to the marketplace.', type: 'system', date: '2026-09-10T12:00:00Z', read: true },
];

// Admin Platform Data
export const INITIAL_ADMIN_STATS = {
  totalPlatformGMV: 4890000.00,
  totalPayouts: 742000.00,
  activeAffiliates: 1240,
  flaggedFraudAlerts: 4,
  pendingApprovals: 18,
  systemUptime: '99.98%',
  monthlyVolumeGrowth: 22.4,
};

export const INITIAL_ADMIN_USERS = [
  { id: 'usr-101', name: 'Aditya Rao', email: 'aditya.r@affiliatepro.io', status: 'Active', tier: 'Platinum (25%)', totalEarnings: 142500.00, referralsCount: 312, riskScore: 'Low', joined: '2025-11-12' },
  { id: 'usr-102', name: 'Sneha Kulkarni', email: 'sneha@growthmarketers.in', status: 'Active', tier: 'Gold (20%)', totalEarnings: 89400.00, referralsCount: 198, riskScore: 'Low', joined: '2026-01-05' },
  { id: 'usr-103', name: 'Rajesh Gupta', email: 'rajesh.g@spamclick.xyz', status: 'Flagged', tier: 'Standard (15%)', totalEarnings: 12000.00, referralsCount: 45, riskScore: 'High (Duplicate IP)', joined: '2026-08-01' },
  { id: 'usr-104', name: 'Meera Deshmukh', email: 'meera.d@contenthub.org', status: 'Active', tier: 'Gold (20%)', totalEarnings: 64200.00, referralsCount: 130, riskScore: 'Low', joined: '2026-02-19' },
  { id: 'usr-105', name: 'Sunil Malhotra', email: 'sunil@techblog.in', status: 'Suspended', tier: 'Standard (15%)', totalEarnings: 4500.00, referralsCount: 12, riskScore: 'Medium', joined: '2026-06-30' },
];

export const INITIAL_FRAUD_LOGS = [
  { id: 'frd-1', affiliate: 'Rajesh Gupta (usr-103)', trigger: 'Self-Referral IP Match', ipAddress: '49.207.182.11', targetProduct: 'StackCloud Enterprise', riskScore: 92, status: 'Under Review', timestamp: '2026-09-18T16:22:00Z' },
  { id: 'frd-2', affiliate: 'Unknown Botnet', trigger: 'Rapid Click Velocity (>50 clicks/min)', ipAddress: '103.22.180.4', targetProduct: 'PayFlow API', riskScore: 88, status: 'Blocked', timestamp: '2026-09-17T04:10:00Z' },
  { id: 'frd-3', affiliate: 'Sunil Malhotra (usr-105)', trigger: 'Cookie Stuffing Pattern', ipAddress: '157.33.91.205', targetProduct: 'GrowthCRM Suite', riskScore: 78, status: 'Suspended', timestamp: '2026-09-14T21:45:00Z' },
];

export const INITIAL_AUDIT_LOGS = [
  { id: 'aud-901', admin: 'Super Admin (System)', action: 'Batch Payout Execution', details: 'Processed ₹45,000.00 across 6 affiliates.', timestamp: '2026-09-18T18:00:00Z', ip: '127.0.0.1' },
  { id: 'aud-902', admin: 'Security Module', action: 'Flagged User Account', details: 'Automated flag placed on user usr-103.', timestamp: '2026-09-18T16:22:00Z', ip: 'System' },
  { id: 'aud-903', admin: 'Operations Admin', action: 'Modified Product Commission', details: 'StackCloud commission updated from 18% to 20%.', timestamp: '2026-09-15T11:30:00Z', ip: '182.73.19.4' },
];

// Time-series Chart Data (Monochrome style)
export const PERFORMANCE_CHART_DATA = [
  { day: 'Sep 01', earnings: 1200, clicks: 120, conversions: 8 },
  { day: 'Sep 03', earnings: 2400, clicks: 180, conversions: 14 },
  { day: 'Sep 05', earnings: 1800, clicks: 150, conversions: 11 },
  { day: 'Sep 08', earnings: 3200, clicks: 240, conversions: 19 },
  { day: 'Sep 10', earnings: 2900, clicks: 210, conversions: 16 },
  { day: 'Sep 13', earnings: 4500, clicks: 310, conversions: 24 },
  { day: 'Sep 15', earnings: 3800, clicks: 280, conversions: 21 },
  { day: 'Sep 18', earnings: 5100, clicks: 370, conversions: 29 },
];
