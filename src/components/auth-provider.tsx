'use client';

import { useEffect, ReactNode } from 'react';
import { tokenManager } from '@/api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Initialize token management on app start
    tokenManager.initializeToken();

    // Set up periodic token refresh (every 10 minutes)
    const interval = setInterval(async () => {
      await tokenManager.ensureValidToken();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}