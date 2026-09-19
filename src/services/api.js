import axios from 'axios';
import {
  INITIAL_USER_STATS,
  INITIAL_TARGET,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_WITHDRAWALS,
  INITIAL_REFERRALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_STATS,
  INITIAL_ADMIN_USERS,
  INITIAL_FRAUD_LOGS,
  INITIAL_AUDIT_LOGS,
  PERFORMANCE_CHART_DATA
} from './mockData';

// Central Axios Instance
export const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-Memory Reactive Store for Client-Side Demo Mutability
let store = {
  userStats: { ...INITIAL_USER_STATS },
  target: { ...INITIAL_TARGET },
  products: [...INITIAL_PRODUCTS],
  transactions: [...INITIAL_TRANSACTIONS],
  withdrawals: [...INITIAL_WITHDRAWALS],
  referrals: [...INITIAL_REFERRALS],
  notifications: [...INITIAL_NOTIFICATIONS],
  adminStats: { ...INITIAL_ADMIN_STATS },
  adminUsers: [...INITIAL_ADMIN_USERS],
  fraudLogs: [...INITIAL_FRAUD_LOGS],
  auditLogs: [...INITIAL_AUDIT_LOGS],
};

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const affiliateApi = {
  // User Portal Services
  getUserStats: async () => {
    await delay();
    return { ...store.userStats };
  },

  getTarget: async () => {
    await delay();
    return { ...store.target };
  },

  getProducts: async (filters = {}) => {
    await delay();
    let result = [...store.products];
    if (filters.category && filters.category !== 'All') {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }
    if (filters.sortBy === 'commission') {
      result.sort((a, b) => b.commissionValue - a.commissionValue);
    } else if (filters.sortBy === 'price') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'popularity') {
      result.sort((a, b) => b.conversions - a.conversions);
    }
    return result;
  },

  getProductById: async (id) => {
    await delay();
    const prod = store.products.find((p) => p.id === id);
    if (!prod) throw new Error('Product not found');
    return prod;
  },

  getTransactions: async (filters = {}) => {
    await delay();
    let result = [...store.transactions];
    if (filters.status && filters.status !== 'All') {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.product.toLowerCase().includes(q) ||
          t.buyer.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getWithdrawals: async () => {
    await delay();
    return [...store.withdrawals];
  },

  requestWithdrawal: async ({ amount, method, destination }) => {
    await delay(350);
    if (amount > store.userStats.availableBalance) {
      throw new Error('Requested amount exceeds available balance.');
    }
    if (amount < 500) {
      throw new Error('Minimum withdrawal threshold is ₹500.00');
    }

    const newWd = {
      id: `wd-${Date.now().toString().slice(-4)}`,
      requestedAt: new Date().toISOString(),
      amount: parseFloat(amount),
      method,
      destination,
      status: 'Pending',
      reference: `${method.toUpperCase().slice(0, 3)}/${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    // Deduct from available balance
    store.userStats.availableBalance -= parseFloat(amount);
    store.userStats.pendingEarnings += parseFloat(amount);
    store.withdrawals.unshift(newWd);

    // Add notification
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Withdrawal Requested',
      message: `Withdrawal request of ₹${amount.toFixed(2)} is pending approval.`,
      type: 'withdrawal',
      date: new Date().toISOString(),
      read: false,
    });

    return newWd;
  },

  getReferrals: async () => {
    await delay();
    return [...store.referrals];
  },

  generateReferralLink: async ({ productId, campaignCode, utmSource }) => {
    await delay(200);
    const prod = store.products.find((p) => p.id === productId);
    const code = campaignCode || 'REF-USER-9841';
    const link = `https://referearn.io/p/${productId}?ref=${code}&utm_source=${utmSource || 'direct'}`;
    return { link, referralCode: code, product: prod?.name || 'General Platform' };
  },

  getNotifications: async () => {
    await delay();
    return [...store.notifications];
  },

  markNotificationsRead: async () => {
    await delay(150);
    store.notifications = store.notifications.map((n) => ({ ...n, read: true }));
    return true;
  },

  getChartData: async () => {
    await delay();
    return PERFORMANCE_CHART_DATA;
  },

  // Admin Portal Services
  getAdminStats: async () => {
    await delay();
    return { ...store.adminStats };
  },

  getAdminUsers: async () => {
    await delay();
    return [...store.adminUsers];
  },

  toggleUserStatus: async (userId) => {
    await delay(200);
    store.adminUsers = store.adminUsers.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    });

    store.auditLogs.unshift({
      id: `aud-${Date.now().toString().slice(-4)}`,
      admin: 'Operations Admin',
      action: 'Toggled User Status',
      details: `User ${userId} status changed.`,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1',
    });

    return true;
  },

  getFraudLogs: async () => {
    await delay();
    return [...store.fraudLogs];
  },

  getAuditLogs: async () => {
    await delay();
    return [...store.auditLogs];
  },
};
