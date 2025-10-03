'use client';

import { useState, useEffect } from 'react';
import { UserInfo, getCurrentUser, getUserRole } from '@/api/jwt-utils';

// Hook đơn giản để lấy user info mà không cần UserProvider
export function useCurrentUser() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [userRole, setUserRole] = useState<'store' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const userInfo = getCurrentUser();
    setUser(userInfo);
    setUserRole(getUserRole(userInfo));
  };

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, []);

  return {
    user,
    userRole,
    isLoading,
    refreshUser
  };
}