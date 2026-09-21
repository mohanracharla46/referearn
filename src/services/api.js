import axios from 'axios';

// Central Axios Instance with dynamic token attachment
export const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach Bearer token and user identity headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('referearn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const userStr = localStorage.getItem('referearn_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.id) config.headers['X-User-Id'] = user.id;
      if (user.email) config.headers['X-User-Email'] = user.email;
    } catch (e) {}
  }
  return config;
});

// Response interceptor for unified response data extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const affiliateApi = {
  // Auth Services
  login: async ({ email, password }) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('referearn_token', res.data.token);
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('referearn_token', res.data.token);
    }
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await apiClient.put('/auth/profile', profileData);
    return res.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('referearn_token');
    }
    return true;
  },

  // User Portal Services
  getUserStats: async () => {
    const res = await apiClient.get('/user/stats');
    return res.data;
  },

  getTarget: async () => {
    const res = await apiClient.get('/targets');
    return res.data;
  },

  getAllTargets: async () => {
    const res = await apiClient.get('/targets/all');
    return res.data;
  },

  getProducts: async (filters = {}) => {
    const params = {};
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;

    const res = await apiClient.get('/products', { params });
    return res.data;
  },

  getProductById: async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  createProduct: async (productData) => {
    const res = await apiClient.post('/products', productData);
    return res.data;
  },

  updateProduct: async (id, productData) => {
    const res = await apiClient.put(`/products/${id}`, productData);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },

  // Categories
  getCategories: async () => {
    const res = await apiClient.get('/categories');
    return res.data;
  },

  createCategory: async (categoryData) => {
    const res = await apiClient.post('/categories', categoryData);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  },

  // Transactions / Earnings / Commissions
  getTransactions: async (filters = {}) => {
    const params = {};
    if (filters.status && filters.status !== 'All') params.status = filters.status;
    if (filters.search) params.search = filters.search;

    const res = await apiClient.get('/transactions', { params });
    return res.data;
  },

  updateTransactionStatus: async (id, status) => {
    const res = await apiClient.put(`/transactions/${id}/status`, { status });
    return res.data;
  },

  // Withdrawals & Payouts
  getWithdrawals: async () => {
    const res = await apiClient.get('/withdrawals');
    return res.data;
  },

  requestWithdrawal: async ({ amount, method, destination }) => {
    const res = await apiClient.post('/withdrawals/request', {
      amount,
      method,
      destination,
    });
    return res.data.withdrawal;
  },

  approveWithdrawal: async (id) => {
    const res = await apiClient.put(`/withdrawals/${id}/approve`);
    return res.data;
  },

  batchApproveWithdrawals: async () => {
    const res = await apiClient.post('/withdrawals/batch-approve');
    return res.data;
  },

  // Referrals
  getReferrals: async () => {
    const res = await apiClient.get('/referrals');
    return res.data;
  },

  updateReferralStatus: async (id, status) => {
    const res = await apiClient.put(`/referrals/${id}/status`, { status });
    return res.data;
  },

  generateReferralLink: async ({ productId, campaignCode, utmSource }) => {
    const res = await apiClient.post('/referrals/generate-link', {
      productId,
      campaignCode,
      utmSource,
    });
    return res.data;
  },

  trackClick: async (productId) => {
    const res = await apiClient.post('/referrals/track-click', { productId });
    return res.data;
  },

  // Campaigns
  getCampaigns: async () => {
    const res = await apiClient.get('/campaigns');
    return res.data;
  },

  createCampaign: async (campaignData) => {
    const res = await apiClient.post('/campaigns', campaignData);
    return res.data;
  },

  // Notifications
  getNotifications: async () => {
    const res = await apiClient.get('/notifications');
    return res.data;
  },

  markNotificationsRead: async () => {
    const res = await apiClient.post('/notifications/mark-read');
    return res.data;
  },

  broadcastNotification: async ({ title, message, audience }) => {
    const res = await apiClient.post('/notifications/broadcast', {
      title,
      message,
      audience,
    });
    return res.data;
  },

  getChartData: async () => {
    const res = await apiClient.get('/charts/performance');
    return res.data;
  },

  // Admin Portal Services
  getAdminStats: async () => {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  getAdminUsers: async (filters = {}) => {
    const params = {};
    if (filters.status && filters.status !== 'All') params.status = filters.status;
    if (filters.search) params.search = filters.search;

    const res = await apiClient.get('/admin/users', { params });
    return res.data;
  },

  toggleUserStatus: async (userId) => {
    const res = await apiClient.post(`/admin/users/${userId}/toggle-status`);
    return res.data;
  },

  updateUserTier: async (userId, tier) => {
    const res = await apiClient.post(`/admin/users/${userId}/tier`, { tier });
    return res.data;
  },

  getFraudLogs: async () => {
    const res = await apiClient.get('/admin/fraud-logs');
    return res.data;
  },

  updateFraudStatus: async (id, status) => {
    const res = await apiClient.put(`/admin/fraud-logs/${id}/status`, { status });
    return res.data;
  },

  getAuditLogs: async () => {
    const res = await apiClient.get('/admin/audit-logs');
    return res.data;
  },

  getSettings: async () => {
    const res = await apiClient.get('/admin/settings');
    return res.data;
  },

  updateSettings: async (settingsData) => {
    const res = await apiClient.post('/admin/settings', settingsData);
    return res.data;
  },
};
