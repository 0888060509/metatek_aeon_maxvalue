import { ApiClient } from './client';
import { tokenManager } from './auth';

// Environment configuration
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.aeon.app.riviu.com.vn';
  } else {
    // Server-side
    return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.aeon.app.riviu.com.vn';
  }
};

// Create a default API client instance
export const apiClient = new ApiClient(getApiBaseUrl());

// Setup refresh token callback
apiClient.setRefreshTokenCallback(async () => {
  return await tokenManager.refreshAccessToken();
});

// Token management utilities
export const setApiToken = (token: string) => {
  apiClient.setAccessToken(token);
};

export const clearApiToken = () => {
  apiClient.setAccessToken('');
};

// Helper function to create a new API client instance with custom base URL
export const createApiClient = (baseUrl?: string) => {
  return new ApiClient(baseUrl || getApiBaseUrl());
};

export default apiClient;