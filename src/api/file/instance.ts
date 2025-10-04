// File API Client Instance

import { FileApiClient, TokenManager } from './client';
import { tokenManager as appTokenManager } from '../app';

// Create adapter for app token manager to match file API interface
const tokenManagerAdapter: TokenManager = {
  getToken(): string | null {
    return appTokenManager.getAccessToken();
  },
  
  async refreshToken(): Promise<boolean> {
    return await appTokenManager.refreshAccessToken();
  }
};

// Create a default instance of FileApiClient with token manager
export const fileApiClient = new FileApiClient(tokenManagerAdapter);

// Export the client for easy import
export default fileApiClient;