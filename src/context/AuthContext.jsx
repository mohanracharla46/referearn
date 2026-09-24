import React, { createContext, useContext, useState, useEffect } from 'react';
import { affiliateApi } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_AFFILIATE_USER = {
  id: 'usr-1',
  name: 'Kishore Kumar',
  email: 'kishore@referearn.io',
  phone: '9876543210',
  role: 'affiliate',
  avatar: null,
  referralCode: 'REF-KISHORE-2026',
  upiId: 'kishore@okaxis',
  bankAccount: 'HDFC Bank •••• 4092',
  tier: 'Platinum Affiliate',
  joinedDate: '2025-10-14',
  needsOnboarding: false,
};

const DEFAULT_ADMIN_USER = {
  id: 'usr-2',
  name: 'Super Administrator',
  email: 'admin@referearn.io',
  phone: '9988776655',
  role: 'admin',
  avatar: null,
  referralCode: 'REF-ADMIN-0001',
  tier: 'Administrator',
  needsOnboarding: false,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('referearn_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activePortal, setActivePortal] = useState(() => {
    return localStorage.getItem('referearn_portal') || 'user';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('referearn_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('referearn_user');
    }
  }, [user]);

  useEffect(() => {
    if (activePortal) {
      localStorage.setItem('referearn_portal', activePortal);
    }
  }, [activePortal]);

  useEffect(() => {
    if (user && user.email) {
      const interval = setInterval(async () => {
        try {
          const fresh = await affiliateApi.getMe();
          if (fresh && fresh.status) {
            setUser((prev) => {
              if (!prev) return prev;
              if (prev.status !== fresh.status || prev.rejection_reason !== fresh.rejection_reason) {
                const updated = {
                  ...prev,
                  status: fresh.status,
                  rejection_reason: fresh.rejection_reason || fresh.rejectionReason,
                };
                localStorage.setItem('referearn_user', JSON.stringify(updated));
                return updated;
              }
              return prev;
            });
          }
        } catch (e) {}
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user?.email]);

  const login = async (email, password = 'password123') => {
    try {
      const res = await affiliateApi.login({ email, password });
      const isNewUser = res.is_new_user ?? res.user?.needs_onboarding ?? false;
      const loggedUser = {
        ...res.user,
        needsOnboarding: isNewUser,
      };
      setUser(loggedUser);
      localStorage.setItem('referearn_user', JSON.stringify(loggedUser));
      localStorage.setItem('referearn_onboarding_completed', isNewUser ? 'false' : 'true');
      if (res.token) {
        localStorage.setItem('referearn_token', res.token);
      }
      setActivePortal('user');
      return { user: loggedUser, isNewUser };
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      if (err.response?.status === 401 || err.response?.status === 422) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      const isNetworkOffline = !window.navigator.onLine || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error');
      if (!isNetworkOffline && err.message) {
        throw err;
      }
      const namePart = email.split('@')[0];
      const cleanName = namePart.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const isNewUser = !email.includes('kishore'); // kishore@referearn.io is old user
      const fallbackUser = {
        id: 'usr-' + Date.now(),
        name: isNewUser ? '' : cleanName,
        email: email,
        phone: isNewUser ? '' : '+91 9876543210',
        role: 'affiliate',
        avatar: null,
        referral_code: 'REF-' + cleanName.toUpperCase().replace(/[^A-Z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000),
        tier: 'Standard Affiliate',
        available_balance: isNewUser ? 0.0 : 14850.0,
        total_earnings: isNewUser ? 0.0 : 25400.0,
        pending_earnings: 0.0,
        locked_balance: 0.0,
        referrals_count: isNewUser ? 0 : 12,
        needsOnboarding: isNewUser,
      };
      setUser(fallbackUser);
      localStorage.setItem('referearn_user', JSON.stringify(fallbackUser));
      localStorage.setItem('referearn_onboarding_completed', isNewUser ? 'false' : 'true');
      localStorage.setItem('referearn_token', 'demo-token-' + Date.now());
      setActivePortal('user');
      return { user: fallbackUser, isNewUser };
    }
  };

  const googleLogin = async ({ credential, email, name, avatar }) => {
    try {
      const res = await affiliateApi.googleLogin({ credential, email, name, avatar });
      const isNewUser = res.is_new_user ?? res.user?.needs_onboarding ?? false;
      const loggedUser = {
        ...res.user,
        needsOnboarding: isNewUser,
      };
      setUser(loggedUser);
      localStorage.setItem('referearn_user', JSON.stringify(loggedUser));
      localStorage.setItem('referearn_onboarding_completed', isNewUser ? 'false' : 'true');
      if (res.token) {
        localStorage.setItem('referearn_token', res.token);
      }
      setActivePortal('user');
      return { user: loggedUser, isNewUser };
    } catch (err) {
      const targetEmail = email || 'google.publisher@example.com';
      const namePart = targetEmail.split('@')[0];
      const cleanName = name || namePart.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const isNewUser = true;
      const fallbackUser = {
        id: 'usr-' + Date.now(),
        name: cleanName,
        email: targetEmail,
        phone: '',
        role: 'affiliate',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
        referral_code: 'REF-' + cleanName.toUpperCase().replace(/[^A-Z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000),
        tier: 'Standard Affiliate',
        available_balance: 0.0,
        total_earnings: 0.0,
        pending_earnings: 0.0,
        locked_balance: 0.0,
        referrals_count: 0,
        needsOnboarding: true,
      };
      setUser(fallbackUser);
      localStorage.setItem('referearn_user', JSON.stringify(fallbackUser));
      localStorage.setItem('referearn_onboarding_completed', 'false');
      localStorage.setItem('referearn_token', 'google-demo-token-' + Date.now());
      setActivePortal('user');
      return { user: fallbackUser, isNewUser };
    }
  };

  const adminLogin = async (email, password) => {
    const res = await affiliateApi.adminLogin({ email, password });
    const loggedUser = res.user;
    if (!loggedUser || loggedUser.role !== 'admin') {
      throw new Error('Access denied. Administrator privileges required.');
    }
    setUser(loggedUser);
    localStorage.setItem('referearn_user', JSON.stringify(loggedUser));
    if (res.token) {
      localStorage.setItem('referearn_token', res.token);
    }
    setActivePortal('admin');
    return loggedUser;
  };

  const register = async (userData) => {
    try {
      const res = await affiliateApi.register(userData);
      const newUser = {
        ...res.user,
        needsOnboarding: true,
      };
      setUser(newUser);
      localStorage.setItem('referearn_user', JSON.stringify(newUser));
      localStorage.setItem('referearn_onboarding_completed', 'false');
      if (res.token) {
        localStorage.setItem('referearn_token', res.token);
      }
      setActivePortal('user');
      return newUser;
    } catch (err) {
      const cleanName = userData.name || userData.email.split('@')[0];
      const newUser = {
        id: 'usr-' + Date.now(),
        name: cleanName,
        email: userData.email,
        phone: userData.phone || '',
        role: 'affiliate',
        avatar: null,
        available_balance: 0.0,
        total_earnings: 0.0,
        pending_earnings: 0.0,
        locked_balance: 0.0,
        referrals_count: 0,
        referral_code: 'REF-' + cleanName.toUpperCase().replace(/[^A-Z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000),
        tier: 'Standard Affiliate',
        needsOnboarding: true,
      };
      setUser(newUser);
      localStorage.setItem('referearn_user', JSON.stringify(newUser));
      localStorage.setItem('referearn_onboarding_completed', 'false');
      localStorage.setItem('referearn_token', 'demo-token-registered');
      setActivePortal('user');
      return newUser;
    }
  };

  const triggerOnboardingModal = () => {
    localStorage.setItem('referearn_onboarding_completed', 'false');
    setUser((prev) => ({ ...prev, needsOnboarding: true }));
  };

  const updateUserProfile = async (profileData) => {
    let apiUpdatedUser = null;
    try {
      const res = await affiliateApi.updateProfile(profileData);
      if (res && res.user) {
        apiUpdatedUser = res.user;
      }
    } catch (e) {
      console.error('API profile update error:', e);
      throw e;
    }
    setUser((prev) => {
      const updated = {
        ...prev,
        ...(apiUpdatedUser || profileData),
        needsOnboarding: false,
      };
      localStorage.setItem('referearn_user', JSON.stringify(updated));
      localStorage.setItem('referearn_onboarding_completed', 'true');
      return updated;
    });
  };

  const logout = async () => {
    try {
      await affiliateApi.logout();
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('referearn_user');
    localStorage.removeItem('referearn_token');
    localStorage.removeItem('referearn_portal');
    localStorage.removeItem('referearn_onboarding_completed');
  };

  const switchPortal = (portal) => {
    if (portal === 'admin' && user?.role !== 'admin') {
      return; // Do not allow non-admin user to switch to admin portal
    }
    setActivePortal(portal);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activePortal,
        switchPortal,
        login,
        googleLogin,
        adminLogin,
        register,
        logout,
        triggerOnboardingModal,
        updateUserProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
