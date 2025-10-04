import { 
  ApiResponse, 
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountListItem,
  AccountDetail,
  GetAccountsParams,
  LoginRequest,
  RefreshTokenRequest,
  AuthResponse,
  SettingItem,
  UpdateSettingsRequest,
  CreateTaskItemRequest,
  UpdateTaskItemRequest,
  TaskItemListItem,
  TaskItemDetail,
  GetTaskItemsParams
} from './types';

export class ApiClient {
  private baseUrl: string;
  private accessToken?: string;
  private refreshTokenCallback?: () => Promise<boolean>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  setRefreshTokenCallback(callback: () => Promise<boolean>) {
    this.refreshTokenCallback = callback;
  }

  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      return await this.request<T>(endpoint, options);
    } catch (error) {
      // If it's a 401 error and we have a refresh callback, try to refresh token once
      if (error instanceof ApiError && error.status === 401 && this.refreshTokenCallback) {
        try {
          const refreshSuccess = await this.refreshTokenCallback();
          if (refreshSuccess) {
            // Retry the original request with the new token
            return await this.request<T>(endpoint, options);
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
        }
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    if (this.accessToken) {
      headers.Authorization = this.accessToken;
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      // Always try to parse JSON response first
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new ApiError({
          message: `Failed to parse response: ${response.statusText}`,
          status: response.status
        });
      }

      if (!response.ok) {
        // If we have API error response, use that message
        const errorMessage = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new ApiError({
          message: errorMessage,
          status: response.status,
          traceId: data?.meta?.traceId,
        });
      }

      // Check if API response indicates failure
      if (data?.meta && data.meta.success === false) {
        throw new ApiError({
          message: data.error.message || 'API call failed',
          status: response.status,
          traceId: data.meta.traceId
        });
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError({
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 0
      });
    }
  }

  // Admin Account APIs
  async createAccount(data: CreateAccountRequest): Promise<ApiResponse<string>> {
    return this.requestWithRetry<string>('/Admin/Account', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getAccounts(params?: GetAccountsParams): Promise<ApiResponse<AccountListItem[]>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      if (params.name) searchParams.append('name', params.name);
      if (params.appCode) searchParams.append('appCode', params.appCode);
      if (params.status) searchParams.append('status', params.status);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.size) searchParams.append('size', params.size.toString());
    }

    const query = searchParams.toString();
    const endpoint = query ? `/Admin/Account?${query}` : '/Admin/Account';
    
    return this.requestWithRetry<AccountListItem[]>(endpoint);
  }

  async getAccountDetail(id: string): Promise<ApiResponse<AccountDetail>> {
    return this.requestWithRetry<AccountDetail>(`/Admin/Account/${id}`);
  }

  async updateAccount(id: string, data: UpdateAccountRequest): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>(`/Admin/Account/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteAccount(id: string): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>(`/Admin/Account/${id}`, {
      method: 'DELETE'
    });
  }

  async restoreAccount(id: string): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>(`/Admin/Account/${id}/Restore`, {
      method: 'PUT'
    });
  }

  // Identity APIs
  async loginWithPassword(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/Identity/Login/Password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/Identity/RefreshToken', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Admin Settings APIs
  async getSettings(): Promise<ApiResponse<SettingItem[]>> {
    return this.requestWithRetry<SettingItem[]>('/Admin/Setting');
  }

  async updateSettings(data: UpdateSettingsRequest): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>('/Admin/Setting', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Admin TaskItem APIs
  async createTaskItem(data: CreateTaskItemRequest): Promise<ApiResponse<string>> {
    return this.requestWithRetry<string>('/Admin/TaskItem', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getTaskItems(params?: GetTaskItemsParams): Promise<ApiResponse<TaskItemListItem[]>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      if (params.search) searchParams.append('search', params.search);
      if (params.assigneeId) searchParams.append('assigneeId', params.assigneeId);
      if (params.state) {
        params.state.forEach(s => searchParams.append('state', s.toString()));
      }
      if (params.priority) {
        params.priority.forEach(p => searchParams.append('priority', p.toString()));
      }
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.size) searchParams.append('size', params.size.toString());
    }

    const query = searchParams.toString();
    const endpoint = query ? `/Admin/TaskItem?${query}` : '/Admin/TaskItem';
    
    return this.requestWithRetry<TaskItemListItem[]>(endpoint);
  }

  async getTaskItemDetail(id: string): Promise<ApiResponse<TaskItemDetail>> {
    return this.requestWithRetry<TaskItemDetail>(`/Admin/TaskItem/${id}`);
  }

  async updateTaskItem(id: string, data: UpdateTaskItemRequest): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>(`/Admin/TaskItem/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteTaskItem(id: string): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>(`/Admin/TaskItem/${id}`, {
      method: 'DELETE'
    });
  }

  async restoreTaskItem(id: string): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>(`/Admin/TaskItem/${id}/Restore`, {
      method: 'PUT'
    });
  }

  async submitTaskItem(id: string): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>(`/Admin/TaskItem/${id}/Submit`, {
      method: 'PUT'
    });
  }

  async approveTaskItem(id: string): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>(`/Admin/TaskItem/${id}/Approve`, {
      method: 'PUT'
    });
  }

  async denyTaskItem(id: string): Promise<ApiResponse<boolean>> {
    return this.requestWithRetry<boolean>(`/Admin/TaskItem/${id}/Deny`, {
      method: 'PUT'
    });
  }
}

class ApiError extends Error {
  status: number;
  traceId?: string;

  constructor({ message, status, traceId }: { message: string; status: number; traceId?: string }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.traceId = traceId;
  }
}

export { ApiError };