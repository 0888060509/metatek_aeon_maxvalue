// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Admin Account
  ADMIN_ACCOUNT: '/Admin/Account',
  ADMIN_ACCOUNT_DETAIL: (id: string) => `/Admin/Account/${id}`,
  ADMIN_ACCOUNT_RESTORE: (id: string) => `/Admin/Account/${id}/Restore`,
  
  // Identity
  IDENTITY_LOGIN_PASSWORD: '/Identity/Login/Password',
  IDENTITY_REFRESH_TOKEN: '/Identity/RefreshToken',
  
  // Admin Setting
  ADMIN_SETTING: '/Admin/Setting',
  
  // Admin TaskItem
  ADMIN_TASK_ITEM: '/Admin/TaskItem',
  ADMIN_TASK_ITEM_DETAIL: (id: string) => `/Admin/TaskItem/${id}`,
  ADMIN_TASK_ITEM_SUBMIT: (id: string) => `/Admin/TaskItem/${id}/Submit`,
  ADMIN_TASK_ITEM_APPROVE: (id: string) => `/Admin/TaskItem/${id}/Approve`,
  ADMIN_TASK_ITEM_DENY: (id: string) => `/Admin/TaskItem/${id}/Deny`,
  ADMIN_TASK_ITEM_RESTORE: (id: string) => `/Admin/TaskItem/${id}/Restore`
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const;

// Default pagination
export const DEFAULT_PAGINATION = {
  page: 1,
  size: 10
} as const;