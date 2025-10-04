// File API Client

import { FILE_API_CONFIG, FILE_ENDPOINTS } from './config';
import { FileUploadRequest, FileUploadResponse } from './types';

// Token manager interface - will be injected from outside
export interface TokenManager {
  getToken(): string | null;
  refreshToken(): Promise<boolean>;
}

export class FileApiClient {
  private baseURL: string;
  private timeout: number;
  private tokenManager?: TokenManager;

  constructor(tokenManager?: TokenManager) {
    this.baseURL = FILE_API_CONFIG.baseURL;
    this.timeout = FILE_API_CONFIG.timeout;
    this.tokenManager = tokenManager;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      ...FILE_API_CONFIG.headers,
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token is available
    if (this.tokenManager) {
      const token = this.tokenManager.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        throw new FileApiError({
          message: errorData.message || `HTTP ${response.status}`,
          status: response.status,
          traceId: errorData.traceId,
        });
      }

      return await response.json();
    } catch (error) {
      if (error instanceof FileApiError) {
        throw error;
      }
      throw new FileApiError({
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      });
    }
  }

  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      return await this.makeRequest<T>(endpoint, options);
    } catch (error) {
      // If 401 error and we have token manager, try to refresh token once
      if (error instanceof FileApiError && error.status === 401 && this.tokenManager) {
        const refreshed = await this.tokenManager.refreshToken();
        if (refreshed) {
          return await this.makeRequest<T>(endpoint, options);
        }
      }
      throw error;
    }
  }

  // Upload file
  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', request.file);

    return this.requestWithRetry<FileUploadResponse>(FILE_ENDPOINTS.UPLOAD, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let browser set it with boundary for multipart/form-data
    });
  }
}

// File API Error class
class FileApiError extends Error {
  public status: number;
  public traceId?: string;

  constructor(params: { message: string; status: number; traceId?: string }) {
    super(params.message);
    this.status = params.status;
    this.traceId = params.traceId;
    this.name = 'FileApiError';
  }
}

export { FileApiError };