// JWT Token utilities
export interface UserInfo {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  [key: string]: any;
}

// Simple JWT decoder (không verify signature - chỉ decode payload)
export function decodeJWT(token: string): UserInfo | null {
  try {
    // JWT có format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (base64url)
    const payload = parts[1];
    // Thêm padding nếu cần
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Convert base64url to base64
    const base64 = paddedPayload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64
    const decoded = atob(base64);
    const userInfo = JSON.parse(decoded);
    
    return userInfo;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const userInfo = decodeJWT(token);
  if (!userInfo || !userInfo.exp) {
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  return userInfo.exp * 1000 < Date.now();
}

// Get user info from current token
export function getCurrentUser(): UserInfo | null {
  if (typeof window === 'undefined') {
    return null; // Server side
  }

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return null;
  }

  // Try to get user info from access token
  const userInfo = decodeJWT(accessToken);
  if (userInfo && !isTokenExpired(accessToken)) {
    return userInfo;
  }
  
  return null;
}

// Extract user role for routing
export function getUserRole(userInfo: UserInfo | null): 'store' | 'admin' | null {
  if (!userInfo) return null;
  
  // Check various possible role fields
  const role = userInfo.type;
  switch (role) {
    case '0':
      return 'store';
    case '1':
      return 'admin';
    default:
      return null;
  }
}