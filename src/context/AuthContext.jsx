import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'usr-9841',
    name: 'Kishore Kumar',
    email: 'kishore@referearn.io',
    phone: '9876543210',
    role: 'affiliate', // 'affiliate' | 'admin'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    referralCode: 'REF-KISHORE-2026',
    upiId: 'kishore@okaxis',
    bankAccount: 'HDFC Bank •••• 4092',
    tier: 'Platinum Affiliate',
    joinedDate: '2025-10-14',
    needsOnboarding: true, // Force onboarding modal to trigger on demand for testing!
  });

  const [activePortal, setActivePortal] = useState('user'); // 'user' | 'admin'

  const login = (email, password) => {
    if (email.includes('admin')) {
      setUser((prev) => ({ ...prev, role: 'admin', email, needsOnboarding: false }));
      setActivePortal('admin');
    } else {
      setUser((prev) => ({
        ...prev,
        role: 'affiliate',
        email,
        needsOnboarding: true, // Pop up onboarding modal after login
      }));
      setActivePortal('user');
    }
  };

  const triggerOnboardingModal = () => {
    setUser((prev) => ({ ...prev, needsOnboarding: true }));
  };

  const updateUserProfile = (profileData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('referearn_onboarding_completed', 'true');
    }
    setUser((prev) => ({
      ...prev,
      ...profileData,
      needsOnboarding: false,
    }));
  };

  const logout = () => {
    setUser(null);
  };

  const switchPortal = (portal) => {
    setActivePortal(portal);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activePortal,
        switchPortal,
        login,
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
