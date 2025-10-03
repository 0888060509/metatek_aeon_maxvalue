import { useRouter } from 'next/navigation';
import { tokenManager } from '@/api';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from './use-current-user';

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userRole, refreshUser } = useCurrentUser();

  const logout = () => {
    tokenManager.clearTokens();
    
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã được đăng xuất khỏi hệ thống.",
    });
    
    router.push('/');
  };

  const checkAuth = () => {
    return tokenManager.getRefreshToken() !== null && user !== null;
  };

  const ensureAuth = async () => {
    const hasValidToken = await tokenManager.ensureValidToken();
    if (!hasValidToken) {
      logout();
      return false;
    }
    
    // Refresh user info if needed
    if (!user) {
      refreshUser();
    }
    
    return true;
  };

  return {
    user,
    userRole,
    logout,
    checkAuth,
    ensureAuth,
    refreshUser
  };
}