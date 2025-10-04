'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserInfo, getCurrentUser, decodeJWT, getUserRole } from '@/api/app/jwt-utils';
import { tokenManager } from '@/api';

interface UserContextType {
  user: UserInfo | null;
  userRole: 'field' | 'admin' | null;
  isLoading: boolean;
  updateUser: (token: string) => void;
  clearUser: () => void;
  refreshUserInfo: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [userRole, setUserRole] = useState<'field' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update user info from token
  const updateUser = (token: string) => {
    const userInfo = decodeJWT(token);
    if (userInfo) {
      setUser(userInfo);
      setUserRole(getUserRole(userInfo));
    }
  };

  // Clear user info
  const clearUser = () => {
    setUser(null);
    setUserRole(null);
  };

  // Refresh user info from stored token
  const refreshUserInfo = () => {
    const userInfo = getCurrentUser();
    if (userInfo) {
      setUser(userInfo);
      setUserRole(getUserRole(userInfo));
    } else {
      clearUser();
    }
  };

  // Initialize user info on mount
  useEffect(() => {
    refreshUserInfo();
    setIsLoading(false);
  }, []);

  const value: UserContextType = {
    user,
    userRole,
    isLoading,
    updateUser,
    clearUser,
    refreshUserInfo
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use user context
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}