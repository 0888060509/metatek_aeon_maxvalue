'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'field' | 'admin';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/' 
}: ProtectedRouteProps) {
  const { user, userRole, checkAuth, ensureAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const isAuth = checkAuth();
        if (!isAuth) {
          router.push(fallbackPath);
          return;
        }

        // Ensure token is valid
        const hasValidToken = await ensureAuth();
        if (!hasValidToken) {
          router.push(fallbackPath);
          return;
        }

        // Check role requirements
        if (requiredRole && userRole !== requiredRole) {
          // Redirect based on user role
          if (userRole === 'field') {
            router.push('/home');
          } else {
            router.push('/app/dashboard');
          }
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push(fallbackPath);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [checkAuth, ensureAuth, requiredRole, userRole, router, fallbackPath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: 'field' | 'admin'
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
}