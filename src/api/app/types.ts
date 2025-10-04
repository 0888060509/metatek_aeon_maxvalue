// Base API Response Types
export interface ApiMeta {
  traceId?: string | null;
  success: boolean;
  message?: string; // Error message from API
  total?: number;
  page?: number;
  size?: number;
  pageCount?: number;
  canNext?: boolean;
  canPrev?: boolean;
}

export interface ApiResponse<T = any> {
  meta?: ApiMeta | null;
  data?: T;
}

// Admin Account Types
export interface CreateAccountRequest {
  id?: string | null;
  name: string;
  avatarLink?: string | null;
  username?: string | null;
  password?: string | null;
}

export interface UpdateAccountRequest {
  name?: string | null;
  avatarLink?: string | null;
}

export interface AccountListItem {
  id: string;
  createAt?: number | null;
  updateAt?: number | null;
  deleteAt?: number | null;
  name?: string | null;
  avatarLink?: string | null;
}

export interface AccountDetail extends AccountListItem {
  username?: string | null;
}

export interface GetAccountsParams {
  name?: string | null;
  appCode?: string | null;
  status?: string | null;
  page?: number;
  size?: number;
}

// Identity Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken?: string | null;
  refreshToken?: string | null;
}

// Admin Setting Types
export interface SettingItem {
  code?: string | null;
  name?: string | null;
  description?: string | null;
  value?: string | null;
}

export interface UpdateSettingItem {
  code: number;
  value?: string | null;
}

export interface UpdateSettingsRequest {
  items?: UpdateSettingItem[] | null;
}

// Task Item Types
export interface TaskGoal {
  type: number; // 1 = ImageUpload
  detail: string;
  templateData?: string | null;
  point: number;
}

export interface CreateTaskItemRequest {
  name: string;
  description?: string | null;
  assigneeId: string; // UUID
  priority: number; // 1 = Low, 2 = Medium, 3 = High
  startAt?: number | null; // Unix timestamp
  endAt?: number | null; // Unix timestamp
  listGoal?: TaskGoal[] | null;
}

export interface UpdateTaskItemRequest {
  name?: string | null;
  description?: string | null;
  assigneeId?: string | null;
  priority?: number | null;
  startAt?: number | null;
  endAt?: number | null;
  listGoal?: TaskGoal[] | null;
}

export interface TaskItemListItem {
  id: string;
  createAt?: number | null;
  updateAt?: number | null;
  deleteAt?: number | null;
  name?: string | null;
  description?: string | null;
  assigneeId?: string | null;
  assigneeName?: string | null;
  priority?: number | null;
  state?: number | null; // 0=Draft, 1=InProgress, 2=Complete, 3=Overdue, -2=Deny
  startAt?: number | null;
  endAt?: number | null;
  submitAt?: number | null;
  approveAt?: number | null;
  denyAt?: number | null;
}

export interface TaskItemDetail extends TaskItemListItem {
  listGoal?: TaskGoal[] | null;
  creatorId?: string | null;
  creatorName?: string | null;
}

export interface GetTaskItemsParams {
  search?: string | null;
  assigneeId?: string | null;
  state?: number[] | null; // Array of state values
  priority?: number[] | null; // Array of priority values
  page?: number;
  size?: number;
}

// API Error Types
export interface ApiErrorResponse {
  message: string;
  status: number;
  traceId?: string;
}