import { TaskItemListItem } from '@/api/app/types';

// Map task state from API to display status
export function getTaskStatus(state?: number | null): string {
  switch (state) {
    case 0:
      return 'Draft';
    case 1:
      return 'In Progress';
    case 2:
      return 'Completed';
    case 3:
      return 'Overdue';
    case 4:
      return 'Wait Review';
    case -2:
      return 'Issue';
    default:
      return 'Unknown';
  }
}

// Map priority from API to display text (Vietnamese)
export function getPriorityText(priority?: number | null): string {
  switch (priority) {
    case 1:
      return 'Thấp';
    case 2:
      return 'Trung bình';
    case 3:
      return 'Cao';
    default:
      return 'Bình thường';
  }
}

// Map priority from form string to API number
export function getPriorityValue(priority: string): number {
  switch (priority) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 2; // default to medium
  }
}

// Map priority from API number to form string
export function getPriorityKey(priority?: number | null): 'high' | 'medium' | 'low' {
  switch (priority) {
    case 3:
      return 'high';
    case 2:
      return 'medium';
    case 1:
      return 'low';
    default:
      return 'medium';
  }
}

// Convert timestamp to readable date (server returns milliseconds)
export function formatDate(timestamp?: number | null): string {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleDateString('vi-VN');
}

// Convert timestamp to ISO date string for input fields (server returns milliseconds)
export function formatDateForInput(timestamp?: number | null): string {
  if (!timestamp) return '';
  return new Date(timestamp).toISOString().split('T')[0];
}

// Generate task code from ID
export function generateTaskCode(id: string): string {
  // Take first 8 characters of UUID and make uppercase
  const shortId = id.replace(/-/g, '').substring(0, 8).toUpperCase();
  return `TSK-${shortId}`;
}

// Convert TaskItemListItem to the format expected by the table
export interface TaskDisplayItem {
  id: string;
  code: string;
  title: string;
  description?: string;
  assignedTo: string;
  assigneeId?: string;
  status: 'Completed' | 'Pending Approval' | 'Issue' | 'Overdue' | 'In Progress' | 'Draft' | 'Wait Review';
  priority: string;
  dueDate: string;
  startDate: string;
  createDate: string;
  submitDate: string;
  approveDate: string;
  state?: number | null; // Add state for canEditTask check
}

export function convertTaskItemToDisplayItem(task: TaskItemListItem): TaskDisplayItem {
  return {
    id: task.id,
    code: generateTaskCode(task.id),
    title: task.name || 'Untitled Task',
    description: task.description || undefined,
    assignedTo: task.assigneeName || 'Unassigned',
    assigneeId: task.assigneeId || undefined,
    status: getTaskStatus(task.state) as TaskDisplayItem['status'],
    priority: getPriorityText(task.priority),
    dueDate: formatDate(task.endAt),
    startDate: formatDate(task.startAt),
    createDate: formatDate(task.createAt),
    submitDate: formatDate(task.submitAt),
    approveDate: formatDate(task.approveAt),
    state: task.state, // Include state for canEditTask check
  };
}

// Get status badge variant based on status
export function getStatusVariant(status: TaskDisplayItem['status']) {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Pending Approval':
      return 'warning';
    case 'Issue':
      return 'destructive';
    case 'Overdue':
      return 'info';
    case 'In Progress':
      return 'secondary';
    case 'Draft':
      return 'outline';
    case 'Wait Review':
      return 'warning';
    default:
      return 'outline';
  }
}

// Get priority color class (Vietnamese)
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'Cao':
      return 'text-red-600 font-semibold';
    case 'Trung bình':
      return 'text-yellow-600 font-medium';
    case 'Thấp':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}