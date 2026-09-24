import axios from 'axios';

// Central Axios Instance with dynamic token attachment
export const apiClient = axios.create({
  baseURL: 'https://api.referitup.com/api/v1',
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

      if (user.id) {
        config.headers['X-User-Id'] = user.id;
      }

      if (user.email) {
        config.headers['X-User-Email'] = user.email;
      }
    } catch (e) { }
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

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    db_id: 1,
    name: 'StackCloud Enterprise Hosting',
    category: 'Cloud',
    price: 14999.00,
    commission: '₹10',
    commissionValue: 10.0,
    commissionType: 'Flat Rate',
    status: 'Active',
    rating: 4.9,
    conversions: 42,
    description: 'Managed Kubernetes and enterprise cloud infrastructure hosting.',
    product_link: 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
    rules: 'Cookie length: 90 days. Flat ₹10 instant referral commission per conversion.',
    assets: [
      { name: 'Banner 728x90', size: '120 KB', type: 'Image' },
      { name: 'Email Copy Template', size: '15 KB', type: 'DOCX' },
    ],
  },
  {
    id: 'prod-2',
    db_id: 2,
    name: 'PayFlow Payment Gateway API',
    category: 'Fintech',
    price: 9999.00,
    commission: '₹10',
    commissionValue: 10.0,
    commissionType: 'Flat Rate',
    status: 'Active',
    rating: 4.8,
    conversions: 67,
    description: 'Developer-friendly unified checkout API for merchant payments.',
    product_link: 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80',
    rules: 'Flat ₹10 instant referral commission granted upon successful conversion.',
    assets: [
      { name: 'Integration Guide', size: '2.4 MB', type: 'PDF' },
      { name: 'Logo Pack SVG', size: '850 KB', type: 'ZIP' },
    ],
  },
  {
    id: 'prod-3',
    db_id: 3,
    name: 'GrowthCRM Automation Suite',
    category: 'Software',
    price: 7499.00,
    commission: '₹10',
    commissionValue: 10.0,
    commissionType: 'Flat Rate',
    status: 'Active',
    rating: 4.7,
    conversions: 29,
    description: 'AI-driven pipeline management and customer messaging suite.',
    product_link: 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    rules: 'Flat ₹10 referral commission on verified product referrals.',
    assets: [{ name: 'Product Demo Reel', size: '14 MB', type: 'MP4' }],
  },
  {
    id: 'prod-4',
    db_id: 4,
    name: 'CyberShield Endpoint Security',
    category: 'Developer Tools',
    price: 18999.00,
    commission: '₹10',
    commissionValue: 10.0,
    commissionType: 'Flat Rate',
    status: 'Active',
    rating: 4.9,
    conversions: 18,
    description: 'Zero-trust network protection and automated malware detection.',
    product_link: 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80',
    rules: 'Flat ₹10 referral commission per enterprise account referral.',
    assets: [{ name: 'Security One-Pager', size: '450 KB', type: 'PDF' }],
  },
  {
    id: 'prod-5',
    db_id: 5,
    name: 'OmniSEO Keyword Tracker',
    category: 'Marketing',
    price: 4999.00,
    commission: '₹10',
    commissionValue: 10.0,
    commissionType: 'Flat Rate',
    status: 'Active',
    rating: 4.6,
    conversions: 55,
    description: 'Real-time SERP ranking tracker and competitor content auditor.',
    product_link: 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80',
    rules: 'Cookie length: 60 days. Flat ₹10 referral payout.',
    assets: [{ name: 'Social Banner Pack', size: '5.1 MB', type: 'ZIP' }],
  },
  {
    id: 'prod-6',
    db_id: 6,
    name: 'DataPulse Analytics Engine',
    category: 'Developer Tools',
    price: 12499.00,
    commission: '₹10',
    commissionValue: 10.0,
    commissionType: 'Flat Rate',
    status: 'Active',
    rating: 4.8,
    conversions: 22,
    description: 'High-speed event stream processor and real-time dashboard.',
    product_link: 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    rules: 'Flat ₹10 commission credited immediately.',
    assets: [{ name: 'Case Study Deck', size: '3.2 MB', type: 'PDF' }],
  },
];

export const affiliateApi = {
  // =========================
  // Auth Services
  // =========================

  login: async ({ email, password }) => {
    const res = await apiClient.post('/auth/login', {
      email,
      password,
    });

    if (res.data.token) {
      localStorage.setItem('referearn_token', res.data.token);
    }

    return res.data;
  },

  adminLogin: async ({ email, password }) => {
    const res = await apiClient.post('/auth/admin-login', {
      email,
      password,
    });

    if (res.data.token) {
      localStorage.setItem('referearn_token', res.data.token);
    }

    return res.data;
  },

  googleLogin: async ({ credential, email, name, avatar }) => {
    const res = await apiClient.post('/auth/google-login', {
      credential,
      email,
      name,
      avatar,
    });

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

  // =========================
  // User Portal Services
  // =========================

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

  // =========================
  // Products
  // =========================

  getProducts: async (filters = {}) => {
    try {
      const params = {};
      if (filters.category && filters.category !== 'All') {
        params.category = filters.category;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }
      const res = await apiClient.get('/products', { params });
      let list = Array.isArray(res.data) ? res.data : (res.data?.data || []);

      if (typeof window !== 'undefined') {
        const customProductsStr = localStorage.getItem('referearn_custom_products');
        if (customProductsStr) {
          try {
            const customList = JSON.parse(customProductsStr);
            customList.forEach((override) => {
              const idx = list.findIndex((p) => String(p.id) === String(override.id) || String(p.db_id) === String(override.db_id));
              if (idx >= 0) {
                list[idx] = { ...list[idx], ...override };
              } else {
                list.unshift(override);
              }
            });
          } catch (e) {}
        }
      }
      return list;
    } catch (err) {
      const customProductsStr = typeof window !== 'undefined' ? localStorage.getItem('referearn_custom_products') : null;
      let customList = [];
      if (customProductsStr) {
        try { customList = JSON.parse(customProductsStr); } catch (e) {}
      }
      let list = [...MOCK_PRODUCTS];
      customList.forEach((override) => {
        const idx = list.findIndex((p) => String(p.id) === String(override.id) || String(p.db_id) === String(override.db_id));
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...override };
        } else {
          list.unshift(override);
        }
      });
      if (filters.category && filters.category !== 'All') {
        list = list.filter((p) => p.category === filters.category);
      }
      if (filters.search) {
        const s = filters.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(s) || (p.description && p.description.toLowerCase().includes(s)));
      }
      return list;
    }
  },

  getProductById: async (id) => {
    try {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      const customProductsStr = typeof window !== 'undefined' ? localStorage.getItem('referearn_custom_products') : null;
      let customList = [];
      if (customProductsStr) {
        try { customList = JSON.parse(customProductsStr); } catch (e) {}
      }

      const allProds = [...MOCK_PRODUCTS, ...customList];
      const found = allProds.find(
        (p) => String(p.id) === String(id) || String(p.db_id) === String(id) || `prod-${p.db_id}` === String(id)
      );

      if (found) return found;

      const numericId = String(id).replace(/[^0-9]/g, '');
      const defaultLinks = {
        '1': 'https://stackcloud.io',
        '2': 'https://payflow.io',
        '3': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
        '4': 'https://cybershield.dev',
        '5': 'https://omniseo.com',
        '6': 'https://datapulse.io',
      };

      return {
        id,
        name: `Enterprise Product ${id}`,
        product_link: defaultLinks[numericId] || 'https://sila.ai',
      };
    }
  },

  createProduct: async (productData) => {
    try {
      const res = await apiClient.post('/products', productData);
      const createdProd = res.data?.product || res.data;

      if (typeof window !== 'undefined' && createdProd) {
        const customProductsStr = localStorage.getItem('referearn_custom_products');
        let customList = [];
        if (customProductsStr) {
          try { customList = JSON.parse(customProductsStr); } catch (e) {}
        }
        customList = customList.filter((p) => String(p.id) !== String(createdProd.id));
        customList.unshift(createdProd);
        localStorage.setItem('referearn_custom_products', JSON.stringify(customList));
      }

      return createdProd;
    } catch (err) {
      const newId = 'prod-' + Date.now();
      const newProd = {
        id: newId,
        db_id: Date.now(),
        name: productData.name,
        category: productData.category || 'Cloud',
        price: productData.price || 500,
        commission: productData.commission || '₹500',
        commissionValue: productData.price || 500,
        commissionType: 'Flat Rate',
        status: 'Active',
        rating: 5.0,
        conversions: 0,
        description: productData.description || 'Custom created product.',
        product_link: productData.product_link || '',
        image: productData.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
        rules: 'Cookie length: 60 days.',
        assets: [],
      };

      if (typeof window !== 'undefined') {
        const customProductsStr = localStorage.getItem('referearn_custom_products');
        let customList = [];
        if (customProductsStr) {
          try { customList = JSON.parse(customProductsStr); } catch (e) {}
        }
        customList.unshift(newProd);
        localStorage.setItem('referearn_custom_products', JSON.stringify(customList));
      }

      return newProd;
    }
  },

  updateProduct: async ({ id, ...productData }) => {
    try {
      const res = await apiClient.put(`/products/${id}`, productData);
      const updatedProd = res.data?.product || res.data;

      if (typeof window !== 'undefined') {
        const customProductsStr = localStorage.getItem('referearn_custom_products');
        let customList = [];
        if (customProductsStr) {
          try { customList = JSON.parse(customProductsStr); } catch (e) {}
        }
        const foundIdx = customList.findIndex((p) => String(p.id) === String(id) || String(p.db_id) === String(id));
        if (foundIdx >= 0) {
          customList[foundIdx] = { ...customList[foundIdx], ...productData, ...updatedProd };
        } else {
          customList.unshift({ id, ...productData, ...updatedProd });
        }
        localStorage.setItem('referearn_custom_products', JSON.stringify(customList));
      }

      return updatedProd;
    } catch (err) {
      const fallbackUpdated = { id, ...productData };
      if (typeof window !== 'undefined') {
        const customProductsStr = localStorage.getItem('referearn_custom_products');
        let customList = [];
        if (customProductsStr) {
          try { customList = JSON.parse(customProductsStr); } catch (e) {}
        }
        const foundIdx = customList.findIndex((p) => String(p.id) === String(id) || String(p.db_id) === String(id));
        if (foundIdx >= 0) {
          customList[foundIdx] = { ...customList[foundIdx], ...fallbackUpdated };
        } else {
          customList.unshift(fallbackUpdated);
        }
        localStorage.setItem('referearn_custom_products', JSON.stringify(customList));
      }
      return fallbackUpdated;
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await apiClient.delete(`/products/${id}`);
      return res.data;
    } catch (err) {
      if (typeof window !== 'undefined') {
        const customProductsStr = localStorage.getItem('referearn_custom_products');
        if (customProductsStr) {
          try {
            let customList = JSON.parse(customProductsStr);
            customList = customList.filter((p) => String(p.id) !== String(id) && String(p.db_id) !== String(id));
            localStorage.setItem('referearn_custom_products', JSON.stringify(customList));
          } catch (e) {}
        }
      }
      return { message: 'Product deleted' };
    }
  },

  // =========================
  // Categories
  // =========================

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

  // =========================
  // Transactions / Earnings
  // =========================

  getTransactions: async (filters = {}) => {
    const params = {};

    if (filters.status && filters.status !== 'All') {
      params.status = filters.status;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    const res = await apiClient.get('/transactions', {
      params,
    });

    return res.data;
  },

  updateTransactionStatus: async (id, status) => {
    const res = await apiClient.put(
      `/transactions/${id}/status`,
      { status }
    );

    return res.data;
  },

  // =========================
  // Withdrawals & Payouts
  // =========================

  getWithdrawals: async () => {
    const res = await apiClient.get('/withdrawals');
    return res.data;
  },

  requestWithdrawal: async ({
    amount,
    method,
    destination,
  }) => {
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
    const res = await apiClient.post(
      '/withdrawals/batch-approve'
    );

    return res.data;
  },

  // =========================
  // Referrals
  // =========================

  getReferrals: async () => {
    const res = await apiClient.get('/referrals');
    return res.data;
  },

  updateReferralStatus: async (id, status, rejectionReason) => {
    const res = await apiClient.put(
      `/referrals/${id}/status`,
      { status, rejection_reason: rejectionReason, rejectionReason }
    );

    return res.data;
  },

  generateReferralLink: async ({
    productId,
    campaignCode,
    utmSource,
  }) => {
    const res = await apiClient.post(
      '/referrals/generate-link',
      {
        productId,
        campaignCode,
        utmSource,
      }
    );

    return res.data;
  },

  trackClick: async (productId) => {
    const res = await apiClient.post(
      '/referrals/track-click',
      { productId }
    );

    return res.data;
  },

  // =========================
  // Campaigns
  // =========================

  getCampaigns: async () => {
    const res = await apiClient.get('/campaigns');
    return res.data;
  },

  createCampaign: async (campaignData) => {
    const res = await apiClient.post(
      '/campaigns',
      campaignData
    );

    return res.data;
  },

  // =========================
  // Notifications
  // =========================

  getNotifications: async () => {
    const res = await apiClient.get('/notifications');
    return res.data;
  },

  markNotificationsRead: async () => {
    const res = await apiClient.post(
      '/notifications/mark-read'
    );

    return res.data;
  },

  broadcastNotification: async ({
    title,
    message,
    audience,
  }) => {
    const res = await apiClient.post(
      '/notifications/broadcast',
      {
        title,
        message,
        audience,
      }
    );

    return res.data;
  },

  // =========================
  // Charts
  // =========================

  getChartData: async () => {
    const res = await apiClient.get(
      '/charts/performance'
    );

    return res.data;
  },

  // =========================
  // Admin Portal Services
  // =========================

  getAdminStats: async () => {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  getActiveUserTracking: async () => {
    const res = await apiClient.get('/admin/active-user-tracking');
    return res.data;
  },

  getAdminUsers: async (filters = {}) => {
    const params = {};

    if (filters.status && filters.status !== 'All') {
      params.status = filters.status;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    const res = await apiClient.get('/admin/users', {
      params,
    });

    return res.data;
  },

  toggleUserStatus: async (userId) => {
    const res = await apiClient.post(
      `/admin/users/${userId}/toggle-status`
    );

    return res.data;
  },

  updateUserTier: async (userId, tier) => {
    const res = await apiClient.post(
      `/admin/users/${userId}/tier`,
      { tier }
    );

    return res.data;
  },

  approveProfileUpdate: async (userId, updateData) => {
    const res = await apiClient.post(
      `/admin/users/${userId}/approve-profile`,
      updateData
    );

    return res.data;
  },

  rejectProfileUpdate: async (userId, rejectionReason) => {
    const res = await apiClient.post(
      `/admin/users/${userId}/reject-profile`,
      { rejection_reason: rejectionReason, rejectionReason }
    );

    return res.data;
  },

  getFraudLogs: async () => {
    const res = await apiClient.get(
      '/admin/fraud-logs'
    );

    return res.data;
  },

  updateFraudStatus: async (id, status) => {
    const res = await apiClient.put(
      `/admin/fraud-logs/${id}/status`,
      { status }
    );

    return res.data;
  },

  getAuditLogs: async () => {
    const res = await apiClient.get(
      '/admin/audit-logs'
    );

    return res.data;
  },

  getSettings: async () => {
    const res = await apiClient.get(
      '/admin/settings'
    );

    return res.data;
  },

  updateSettings: async (settingsData) => {
    const res = await apiClient.post(
      '/admin/settings',
      settingsData
    );

    return res.data;
  },
};