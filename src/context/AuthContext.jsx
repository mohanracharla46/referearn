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

  const login = async (email, password = 'password123') => {
    try {
      const res = await affiliateApi.login({ email, password });
      const loggedUser = res.user;
      setUser(loggedUser);
      localStorage.setItem('referearn_user', JSON.stringify(loggedUser));
      if (res.token) {
        localStorage.setItem('referearn_token', res.token);
      }
      const targetPortal = loggedUser.role === 'admin' || email.includes('admin') ? 'admin' : 'user';
      setActivePortal(targetPortal);
      return loggedUser;
    } catch (err) {
      const namePart = email.split('@')[0];
      const cleanName = namePart.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const fallbackUser = {
        id: 'usr-' + Date.now(),
        name: cleanName,
        email: email,
        phone: '',
        role: email.includes('admin') ? 'admin' : 'affiliate',
        avatar: null,
        referral_code: 'REF-' + cleanName.toUpperCase().replace(/[^A-Z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000),
        tier: email.includes('admin') ? 'Administrator' : 'Standard Affiliate',
        available_balance: 0.0,
        total_earnings: 0.0,
        pending_earnings: 0.0,
        locked_balance: 0.0,
        referrals_count: 0,
        needsOnboarding: false,
      };
      setUser(fallbackUser);
      localStorage.setItem('referearn_user', JSON.stringify(fallbackUser));
      localStorage.setItem('referearn_token', 'demo-token-' + Date.now());
      const targetPortal = fallbackUser.role === 'admin' ? 'admin' : 'user';
      setActivePortal(targetPortal);
      return fallbackUser;
    }
  };

  const register = async (userData) => {
    try {
      const res = await affiliateApi.register(userData);
      const newUser = res.user;
      setUser(newUser);
      localStorage.setItem('referearn_user', JSON.stringify(newUser));
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
        needsOnboarding: false,
      };
      setUser(newUser);
      localStorage.setItem('referearn_user', JSON.stringify(newUser));
      localStorage.setItem('referearn_token', 'demo-token-registered');
      setActivePortal('user');
      return newUser;
    }
  };

  const triggerOnboardingModal = () => {
    setUser((prev) => ({ ...prev, needsOnboarding: true }));
  };

  const updateUserProfile = async (profileData) => {
    try {
      await affiliateApi.updateProfile(profileData);
    } catch (e) {
      console.warn('API profile update error, updating local state', e);
    }
    setUser((prev) => {
      const updated = {
        ...prev,
        ...profileData,
        needsOnboarding: false,
      };
      localStorage.setItem('referearn_user', JSON.stringify(updated));
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
  };

  const switchPortal = (portal) => {
    setActivePortal(portal);
    if (portal === 'admin' && user?.role !== 'admin') {
      setUser((prev) => (prev ? { ...prev, role: 'admin', tier: 'Administrator' } : DEFAULT_ADMIN_USER));
    } else if (portal === 'user' && user?.role === 'admin') {
      setUser((prev) => (prev ? { ...prev, role: 'affiliate', tier: 'Standard Affiliate' } : DEFAULT_AFFILIATE_USER));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activePortal,
        switchPortal,
        login,
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
