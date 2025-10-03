'use client';

import { ReactNode } from 'react';
import { UserProvider } from '@/contexts/user-context';
import { AuthProvider } from './auth-provider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <UserProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </UserProvider>
  );
}