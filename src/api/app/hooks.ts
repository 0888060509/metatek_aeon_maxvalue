// Task Note hooks
export function useGetTaskNotes() {
  return useApiCall<TaskNote[], GetTaskNotesParams>(
    (params) => apiClient.getTaskNotes(params)
  );
}
import { useState, useCallback, useRef, useEffect } from 'react';
import { apiClient } from './config';
import { ApiError } from './client';
import type { 
  ApiResponse, 
  CreateAccountRequest,
  UpdateAccountRequest,
  GetAccountsParams,
  LoginRequest,
  RefreshTokenRequest,
  UpdateSettingsRequest,
  AccountListItem,
  AccountDetail,
  AuthResponse,
  SettingItem,
  CreateTaskItemRequest,
  UpdateTaskItemRequest,
  GetTaskItemsParams,
  TaskItemListItem,
  TaskItemDetail,
  DashboardStatistics,
  TaskStatistics,
  MonthlyPerformanceItem,
  RecentTask,
  GetDashboardParams,
  TaskNote,
  GetTaskNotesParams,
  CreateTaskNoteRequest
} from './types';

// Generic hook for API calls
export function useApiCall<TData, TParams = void>(
  apiFunction: (params: TParams) => Promise<ApiResponse<TData>>
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to store the latest apiFunction without causing re-renders
  const apiFunctionRef = useRef(apiFunction);
  
  // Update ref when apiFunction changes
  useEffect(() => {
    apiFunctionRef.current = apiFunction;
  }, [apiFunction]);

  const execute = useCallback(async (params: TParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunctionRef.current(params);
      
      // If we get here, the response is successful
      setData(response.data || null);
      return response.data;
    } catch (err) {
      let errorMessage = 'Unknown error';
      
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - execute function is stable

  return { data, loading, error, execute };
}

// Account hooks
export function useCreateAccount() {
  return useApiCall<string, CreateAccountRequest>(
    (data) => apiClient.createAccount(data)
  );
}

export function useGetAccounts() {
  return useApiCall<AccountListItem[], GetAccountsParams | undefined>(
    (params) => apiClient.getAccounts(params)
  );
}

export function useGetAccountDetail() {
  return useApiCall<AccountDetail, string>(
    (id) => apiClient.getAccountDetail(id)
  );
}

export function useUpdateAccount() {
  return useApiCall<boolean, { id: string; data: UpdateAccountRequest }>(
    ({ id, data }) => apiClient.updateAccount(id, data)
  );
}

export function useDeleteAccount() {
  return useApiCall<boolean, string>(
    (id) => apiClient.deleteAccount(id)
  );
}

export function useRestoreAccount() {
  return useApiCall<boolean, string>(
    (id) => apiClient.restoreAccount(id)
  );
}

// Auth hooks
export function useLogin() {
  return useApiCall<AuthResponse, LoginRequest>(
    (data) => apiClient.loginWithPassword(data)
  );
}

export function useRefreshToken() {
  return useApiCall<AuthResponse, RefreshTokenRequest>(
    (data) => apiClient.refreshToken(data)
  );
}

// Settings hooks
export function useGetSettings() {
  return useApiCall<SettingItem[], void>(
    () => apiClient.getSettings()
  );
}

export function useUpdateSettings() {
  return useApiCall<boolean, UpdateSettingsRequest>(
    (data) => apiClient.updateSettings(data)
  );
}

// TaskItem hooks
export function useCreateTaskItem() {
  return useApiCall<string, CreateTaskItemRequest>(
    (data) => apiClient.createTaskItem(data)
  );
}

export function useGetTaskItems() {
  return useApiCall<TaskItemListItem[], GetTaskItemsParams | undefined>(
    (params) => apiClient.getTaskItems(params)
  );
}

export function useGetTaskItemDetail() {
  return useApiCall<TaskItemDetail, string>(
    (id) => apiClient.getTaskItemDetail(id)
  );
}

export function useUpdateTaskItem() {
  return useApiCall<boolean, { id: string; data: UpdateTaskItemRequest }>(
    ({ id, data }) => apiClient.updateTaskItem(id, data)
  );
}

export function useDeleteTaskItem() {
  return useApiCall<boolean, string>(
    (id) => apiClient.deleteTaskItem(id)
  );
}

export function useRestoreTaskItem() {
  return useApiCall<boolean, string>(
    (id) => apiClient.restoreTaskItem(id)
  );
}

export function usePublishTaskItem() {
  return useApiCall<boolean, string>(
    (id) => apiClient.publishTaskItem(id)
  );
}

export function useSubmitTaskItem() {
  return useApiCall<boolean, string>(
    (id) => apiClient.submitTaskItem(id)
  );
}

export function useApproveTaskItem() {
  return useApiCall<boolean, string>(
    (id) => apiClient.approveTaskItem(id)
  );
}

export function useDenyTaskItem() {
  return useApiCall<boolean, string>(
    (id) => apiClient.denyTaskItem(id)
  );
}

// Dashboard Hooks
export function useGetDashboardStatistics() {
  return useApiCall<DashboardStatistics, GetDashboardParams | undefined>(
    (params) => apiClient.getDashboardStatistics(params)
  );
}

export function useGetTaskStatistics() {
  return useApiCall<TaskStatistics, GetDashboardParams | undefined>(
    (params) => apiClient.getTaskStatistics(params)
  );
}

export function useGetMonthlyPerformance() {
  return useApiCall<MonthlyPerformanceItem[], GetDashboardParams | undefined>(
    (params) => apiClient.getMonthlyPerformance(params)
  );
}

export function useGetRecentTasks() {
  return useApiCall<RecentTask[], GetDashboardParams | undefined>(
    (params) => apiClient.getRecentTasks(params)
  );
}

export function useCreateTaskNote() {
  return useApiCall<TaskNote, CreateTaskNoteRequest>(
    (data) => apiClient.createTaskNote(data)
  );
}