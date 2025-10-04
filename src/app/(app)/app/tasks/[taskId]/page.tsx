
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetTaskItemDetail } from '@/api/app/hooks';
import { getTaskStatus, getPriorityText, formatDate, generateTaskCode } from '@/lib/task-display-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
    CheckCircle,
    XCircle,
    ChevronLeft,
    MoreHorizontal,
    FileText,
    Loader2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// --- Mock Data ---

const taskDetails = {
    id: 'TSK-002',
    title: 'Sanitation Audit',
    description: 'Perform a comprehensive sanitation audit of the store premises, including shelves, floors, and storage areas. Ensure compliance with health and safety regulations.',
    status: 'Pending Approval',
    dueDate: '2023-10-20',
    priority: 'High',
    assignedTo: 'Store Manager',
    store: 'All Stores',
    region: 'All Regions',
};

type Submission = {
  reviewId: string;
  store: string;
  submittedBy: string;
  submittedAt: string;
  aiStatus: 'Đạt' | 'Không Đạt' | 'Lỗi';
  reviewStatus: 'Pending' | 'Approved' | 'Rework'
};

const initialSubmissions: Submission[] = [
    { reviewId: 'REV-001', store: 'Uptown', submittedBy: 'John Smith', submittedAt: '2023-10-20', aiStatus: 'Đạt', reviewStatus: 'Approved' },
    { reviewId: 'REV-008', store: 'Downtown', submittedBy: 'Michael Johnson', submittedAt: '2023-10-19', aiStatus: 'Không Đạt', reviewStatus: 'Rework' },
    { reviewId: 'REV-012', store: 'Suburbia', submittedBy: 'Emily White', submittedAt: '2023-10-20', aiStatus: 'Đạt', reviewStatus: 'Pending' },
    { reviewId: 'REV-015', store: 'Eastside', submittedBy: 'Jessica Brown', submittedAt: '2023-10-21', aiStatus: 'Lỗi', reviewStatus: 'Pending' },
];

// --- Badge Components ---

const getAiStatusBadge = (status: Submission['aiStatus']) => {
  switch (status) {
    case 'Đạt':
      return <Badge className="bg-success hover:bg-success/90 text-success-foreground"><CheckCircle className="mr-1 h-3 w-3" />Đạt</Badge>;
    case 'Không Đạt':
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Không Đạt</Badge>;
    default:
      return <Badge variant="outline">Lỗi</Badge>;
  }
};

const getReviewStatusBadge = (status: Submission['reviewStatus']) => {
  switch (status) {
    case 'Approved':
      return <Badge className="bg-success hover:bg-success/90 text-success-foreground">Approved</Badge>;
    case 'Rework':
      return <Badge variant="destructive">Rework</Badge>;
    case 'Pending':
       return <Badge className="bg-warning hover:bg-warning/90 text-warning-foreground">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTaskStatusBadge = (status: string) => {
  switch (status) {
    case 'Completed':
      return <Badge className="bg-success hover:bg-success/90 text-success-foreground">Completed</Badge>;
    case 'Pending Approval':
      return <Badge className="bg-warning hover:bg-warning/90 text-warning-foreground">Pending Approval</Badge>;
    case 'Issue':
      return <Badge variant="destructive">Issue</Badge>;
    case 'Overdue':
      return <Badge className="bg-info hover:bg-info/90 text-info-foreground">Overdue</Badge>;
    case 'In Progress':
      return <Badge variant="secondary">In Progress</Badge>;
    case 'Draft':
      return <Badge variant="outline">Draft</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};





// --- Main Component ---

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params?.taskId as string;
  const { userRole } = useCurrentUser();

  const { data: taskDetail, loading, error, execute } = useGetTaskItemDetail();

  // Execute the API call when taskId is available
  React.useEffect(() => {
    if (taskId) {
      execute(taskId);
    }
  }, [taskId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/app/tasks">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại danh sách</span>
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/app/tasks">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại danh sách</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Chi tiết nhiệm vụ</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                Không thể tải thông tin nhiệm vụ: {error}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!taskDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/app/tasks">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại danh sách</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Nhiệm vụ không tồn tại</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              Nhiệm vụ với ID {taskId} không được tìm thấy.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const task = taskDetail;
  const taskStatus = getTaskStatus(task.state);

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/app/tasks">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Quay lại danh sách</span>
                </Link>
            </Button>
            <div className="flex-1 flex items-center gap-3">
                <h1 className="shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight">
                    {task.name || 'Nhiệm vụ không có tên'}
                </h1>
                <Badge variant="secondary" className="text-sm">
                    {generateTaskCode(task.id)}
                </Badge>
            </div>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác nhiệm vụ</DropdownMenuLabel>
                        {userRole === 'admin' && (
                          <DropdownMenuItem asChild>
                            <Link href={`/app/tasks/${taskId}/edit`}>
                              Chỉnh sửa
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Sao chép</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Xóa nhiệm vụ</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Tóm tắt nhiệm vụ</CardTitle>
                <CardDescription>
                    Tổng quan về chi tiết và yêu cầu của nhiệm vụ.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {task.description || 'Không có mô tả'}
                </p>
                <Separator />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Trạng thái</p>
                        <div>{getTaskStatusBadge(taskStatus)}</div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Ngày bắt đầu</p>
                        <p className="font-medium">{formatDate(task.startAt) || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Hạn hoàn thành</p>
                        <p className="font-medium">{formatDate(task.endAt) || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Ưu tiên</p>
                        <p className="font-medium">{getPriorityText(task.priority)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Người thực hiện</p>
                        <p className="font-medium">{task.assigneeName || 'Chưa phân công'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Người tạo</p>
                        <p className="font-medium">{task.creatorName || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Ngày tạo</p>
                        <p className="font-medium">{formatDate(task.createAt) || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Ngày nộp</p>
                        <p className="font-medium">{formatDate(task.submitAt) || '-'}</p>
                    </div>
                    {task.approveAt && (
                      <div className="space-y-1">
                          <p className="text-muted-foreground">Ngày duyệt</p>
                          <p className="font-medium">{formatDate(task.approveAt)}</p>
                      </div>
                    )}

                </div>

            </CardContent>
        </Card>

        {/* Task Goals Section */}
        {task.listGoal && task.listGoal.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mục tiêu nhiệm vụ</CardTitle>
              <CardDescription>
                Danh sách các mục tiêu cần hoàn thành cho nhiệm vụ này.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {task.listGoal.map((goal, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Mục tiêu {index + 1}</span>
                          <Badge variant="outline">
                            {goal.type === 1 ? 'Tải ảnh lên' : `Loại ${goal.type}`}
                          </Badge>
                          <Badge variant="secondary">
                            {goal.point} điểm
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {goal.detail}
                        </p>
                        {goal.templateData && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Dữ liệu mẫu:</p>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {goal.templateData}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

    