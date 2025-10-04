// TaskItem utility functions and constants

// Task priorities
export const TASK_PRIORITIES = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
} as const;

export const PRIORITY_LABELS = {
  [TASK_PRIORITIES.LOW]: 'Thấp',
  [TASK_PRIORITIES.MEDIUM]: 'Trung bình', 
  [TASK_PRIORITIES.HIGH]: 'Cao'
} as const;

// Task states
export const TASK_STATES = {
  DRAFT: 0,
  IN_PROGRESS: 1,
  COMPLETE: 2,
  OVERDUE: 3,
  WAIT_REVIEW: 4,
  DENY: -2
} as const;

export const STATE_LABELS = {
  [TASK_STATES.DRAFT]: 'Nháp',
  [TASK_STATES.IN_PROGRESS]: 'Đang thực hiện',
  [TASK_STATES.COMPLETE]: 'Hoàn thành',
  [TASK_STATES.OVERDUE]: 'Quá hạn',
  [TASK_STATES.WAIT_REVIEW]: 'Chờ duyệt',
  [TASK_STATES.DENY]: 'Từ chối'
} as const;

export const STATE_COLORS = {
  [TASK_STATES.DRAFT]: 'gray',
  [TASK_STATES.IN_PROGRESS]: 'blue',
  [TASK_STATES.COMPLETE]: 'green',
  [TASK_STATES.OVERDUE]: 'red',
  [TASK_STATES.WAIT_REVIEW]: 'yellow',
  [TASK_STATES.DENY]: 'orange'
} as const;

// Goal types
export const GOAL_TYPES = {
  IMAGE_UPLOAD: 1
} as const;

export const GOAL_TYPE_LABELS = {
  [GOAL_TYPES.IMAGE_UPLOAD]: 'Tải ảnh lên'
} as const;

// Utility functions
export function getPriorityLabel(priority?: number | null): string {
  if (!priority) return 'Không xác định';
  return PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS] || 'Không xác định';
}

export function getStateLabel(state?: number | null): string {
  if (state === null || state === undefined) return 'Không xác định';
  return STATE_LABELS[state as keyof typeof STATE_LABELS] || 'Không xác định';
}

export function getStateColor(state?: number | null): string {
  if (state === null || state === undefined) return 'gray';
  return STATE_COLORS[state as keyof typeof STATE_COLORS] || 'gray';
}

export function getGoalTypeLabel(type?: number | null): string {
  if (!type) return 'Không xác định';
  return GOAL_TYPE_LABELS[type as keyof typeof GOAL_TYPE_LABELS] || 'Không xác định';
}

export function formatDate(timestamp?: number | null): string {
  if (!timestamp) return 'Chưa xác định';
  return new Date(timestamp * 1000).toLocaleDateString('vi-VN');
}

export function formatDateTime(timestamp?: number | null): string {
  if (!timestamp) return 'Chưa xác định';
  return new Date(timestamp * 1000).toLocaleString('vi-VN');
}

export function isTaskOverdue(endAt?: number | null, state?: number | null): boolean {
  if (!endAt || state === TASK_STATES.COMPLETE || state === TASK_STATES.WAIT_REVIEW) return false;
  return Date.now() > endAt * 1000;
}

export function getTaskProgress(state?: number | null): number {
  switch (state) {
    case TASK_STATES.DRAFT:
      return 0;
    case TASK_STATES.IN_PROGRESS:
      return 50;
    case TASK_STATES.COMPLETE:
      return 100;
    case TASK_STATES.OVERDUE:
      return 75; // Partially done but overdue
    case TASK_STATES.WAIT_REVIEW:
      return 90; // Task completed, waiting for review
    case TASK_STATES.DENY:
      return 0;
    default:
      return 0;
  }
}

export function canSubmitTask(state?: number | null): boolean {
  return state === TASK_STATES.DRAFT || state === TASK_STATES.IN_PROGRESS;
}

export function canApproveTask(state?: number | null): boolean {
  return state === TASK_STATES.WAIT_REVIEW;
}

export function canDenyTask(state?: number | null): boolean {
  return state === TASK_STATES.WAIT_REVIEW;
}

export function canEditTask(state?: number | null): boolean {
  // Can only edit Draft tasks, not completed tasks
  return state === TASK_STATES.DRAFT;
}

export function canDeleteTask(state?: number | null): boolean {
  return state === TASK_STATES.DRAFT;
}