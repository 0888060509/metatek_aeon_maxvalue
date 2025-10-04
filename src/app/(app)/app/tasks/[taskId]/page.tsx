
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGetTaskItemDetail, useDeleteTaskItem, useUpdateTaskItem, useSubmitTaskItem } from '@/api/app/hooks';
import { getTaskStatus, getPriorityText, formatDate, generateTaskCode } from '@/lib/task-display-utils';
import { TASK_STATES } from '@/api/app/task-utils';
import { useFileUpload } from '@/api/file/hooks';
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
    Upload,
    Image,
    X,
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileApiClient } from '@/api/file/client';
import { FILE_API_CONFIG } from '@/api/file/config';

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
      return <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200">Hoàn thành</Badge>;
    case 'Pending Approval':
      return <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200">Chờ duyệt</Badge>;
    case 'Wait Review':
      return <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200">Chờ xem xét</Badge>;
    case 'Issue':
      return <Badge variant="destructive">Có vấn đề</Badge>;
    case 'Overdue':
      return <Badge className="bg-red-100 hover:bg-red-200 text-red-800 border-red-200">Quá hạn</Badge>;
    case 'In Progress':
      return <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200">Đang thực hiện</Badge>;
    case 'Draft':
      return <Badge variant="outline">Bản nháp</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};





// --- Main Component ---

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.taskId as string;
  const { userRole } = useCurrentUser();
  const { toast } = useToast();

  const { data: taskDetail, loading, error, execute } = useGetTaskItemDetail();
  const { execute: deleteTask, loading: deleting } = useDeleteTaskItem();
  const { execute: updateTask, loading: updating } = useUpdateTaskItem();
  const { execute: submitTask, loading: submitting } = useSubmitTaskItem();
  const fileClient = React.useMemo(() => {
    const tokenManager = {
      getToken: () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1M2RjNGQ0LWNhMDUtNDVhYy04M2NkLWU5OGZhOTFiODkwZiIsIm5hbWUiOiJSb290Iiwic2NvcGUiOiJhZG1pbiIsImV4cCI6NjE3NTk1ODUxMTYsImlzcyI6IkRFTU8ifQ.IzybC-hdennp_t0ulF2-271NOZ9cIIh8GQwD5ScdOAU',
      refreshToken: async () => {
        // Fixed token, no refresh needed
        return true;
      }
    };
    return new FileApiClient(tokenManager);
  }, []);
  const { uploadFile, isUploading } = useFileUpload(fileClient);

  // State for managing uploaded images for each goal
  const [goalImages, setGoalImages] = React.useState<{[goalIndex: number]: string[]}>({});
  
  // State for image popup
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  // Handle delete task
  const handleDeleteTask = async () => {
    if (confirm('Bạn có chắc muốn xóa tác vụ này không? Thao tác này không thể hoàn tác.')) {
      try {
        await deleteTask(taskId);
        router.push('/app/tasks');
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Không thể xóa tác vụ. Vui lòng thử lại.');
      }
    }
  };

  // Handle image upload for goals
  const handleImageUpload = async (goalIndex: number, file: File) => {
    try {
      const uploadResult = await uploadFile({ file });

      if (uploadResult.meta?.success && uploadResult.data?.url) {
        const imageUrl = uploadResult.data.url;
        setGoalImages(prev => ({
          ...prev,
          [goalIndex]: [...(prev[goalIndex] || []), imageUrl]
        }));
        
        toast({
          title: "Upload thành công",
          description: "Ảnh đã được tải lên thành công.",
        });
      }
    } catch (error) {
      toast({
        title: "Upload thất bại",
        description: "Không thể tải ảnh lên. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Remove uploaded image
  const handleRemoveImage = (goalIndex: number, imageUrl: string) => {
    setGoalImages(prev => ({
      ...prev,
      [goalIndex]: (prev[goalIndex] || []).filter(url => url !== imageUrl)
    }));
  };

  // Handle save progress without completing task
  const handleSaveProgress = async () => {
    if (!taskDetail) return;

    try {
      // Update the task with progress values (uploaded images)
      const updatedGoals = taskDetail.listGoal?.map((goal, index) => ({
        ...goal,
        progressValue: goalImages[index]?.join(',') || goal.progressValue || null
      })) || [];

      await updateTask({
        id: taskId,
        data: {
          name: taskDetail.name || '',
          description: taskDetail.description || null,
          assigneeId: taskDetail.assigneeId || '',
          priority: taskDetail.priority || 1,
          startAt: taskDetail.startAt || Math.floor(Date.now() / 1000),
          endAt: taskDetail.endAt || Math.floor(Date.now() / 1000) + 86400,
          listGoal: updatedGoals
        }
      });
      
      toast({
        title: "Lưu tiến độ thành công",
        description: "Tiến độ làm việc đã được lưu lại.",
      });

      // Refresh task detail to show updated progress
      execute(taskId);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu tiến độ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Handle task completion
  const handleCompleteTask = async () => {
    if (!taskDetail) return;

    try {
      // First, update the task with progress values (uploaded images)
      const updatedGoals = taskDetail.listGoal?.map((goal, index) => ({
        ...goal,
        progressValue: goalImages[index]?.join(',') || goal.progressValue || null
      })) || [];

      await updateTask({
        id: taskId,
        data: {
          name: taskDetail.name || '',
          description: taskDetail.description || null,
          assigneeId: taskDetail.assigneeId || '',
          priority: taskDetail.priority || 1,
          startAt: taskDetail.startAt || Math.floor(Date.now() / 1000),
          endAt: taskDetail.endAt || Math.floor(Date.now() / 1000) + 86400,
          listGoal: updatedGoals
        }
      });

      // Then submit the task for completion
      await submitTask(taskId);
      
      toast({
        title: "Hoàn thành thành công",
        description: "Tác vụ đã được báo cáo hoàn thành.",
      });

      // Refresh task detail
      execute(taskId);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể hoàn thành tác vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Check if task can be completed
  const canCompleteTask = taskDetail && 
    taskDetail.state !== null && 
    taskDetail.state !== undefined &&
    [TASK_STATES.IN_PROGRESS, TASK_STATES.OVERDUE, TASK_STATES.DENY].includes(taskDetail.state as any);

  // Execute the API call when taskId is available
  React.useEffect(() => {
    if (taskId) {
      execute(taskId);
    }
  }, [taskId]);

  // Load existing progress images when taskDetail is loaded
  React.useEffect(() => {
    if (taskDetail?.listGoal) {
      const initialImages: {[goalIndex: number]: string[]} = {};
      taskDetail.listGoal.forEach((goal, index) => {
        if (goal.type === 1 && goal.progressValue) {
          const imageUrls = goal.progressValue.split(',').map(url => url.trim()).filter(url => url);
          if (imageUrls.length > 0) {
            initialImages[index] = imageUrls;
          }
        }
      });
      setGoalImages(initialImages);
    }
  }, [taskDetail]);

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
                        {userRole === 'admin' && (
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={handleDeleteTask}
                            disabled={deleting}
                          >
                            {deleting ? 'Đang xóa...' : 'Xóa tác vụ'}
                          </DropdownMenuItem>
                        )}
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

                        {/* Image Section for ImageUpload type - Show for all task states */}
                        {goal.type === 1 && (
                          <div className="mt-4 space-y-3">
                            {/* Upload section - only show for editable task states */}
                            {taskDetail && [TASK_STATES.IN_PROGRESS, TASK_STATES.OVERDUE, TASK_STATES.DENY].includes(taskDetail.state as any) && (
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Tải ảnh lên:</label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(index, file);
                                      e.target.value = ''; // Reset input
                                    }
                                  }}
                                  disabled={isUploading}
                                  className="max-w-xs"
                                />
                                {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                              </div>
                            )}

                            {/* Display uploaded images from goalImages state */}
                            {goalImages[index] && goalImages[index].length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Ảnh đã tải lên:</p>
                                <div className="flex flex-wrap gap-2">
                                  {goalImages[index].map((imageUrl, imgIndex) => (
                                    <div key={imgIndex} className="relative group">
                                      <img
                                        src={imageUrl}
                                        alt={`Uploaded image ${imgIndex + 1}`}
                                        className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setSelectedImage(imageUrl)}
                                      />
                                      {taskDetail && [TASK_STATES.IN_PROGRESS, TASK_STATES.OVERDUE, TASK_STATES.DENY].includes(taskDetail.state as any) && (
                                        <button
                                          onClick={() => handleRemoveImage(index, imageUrl)}
                                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Display progress value for other types */}
                        {goal.type !== 1 && goal.progressValue && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Tiến độ hoàn thành:</p>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {goal.progressValue}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Task Action Buttons */}
              {(canCompleteTask || (taskDetail && taskDetail.state === TASK_STATES.IN_PROGRESS)) && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Show Save Progress Button - same logic as Complete Task Button */}
                    {taskDetail && taskDetail.state !== null && taskDetail.state !== undefined &&
                      [TASK_STATES.IN_PROGRESS, TASK_STATES.OVERDUE, TASK_STATES.DENY].includes(taskDetail.state as any) && (
                      <Button 
                        onClick={handleSaveProgress}
                        disabled={updating}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        {updating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Lưu tiến độ
                          </>
                        )}
                      </Button>
                    )}

                    {/* Show Complete Task Button when can complete */}
                    {canCompleteTask && (
                      <Button 
                        onClick={handleCompleteTask}
                        disabled={updating || submitting}
                        className="w-full sm:w-auto"
                      >
                        {updating || submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Hoàn thành tác vụ
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Xem ảnh</DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6">
              {selectedImage && (
                <div className="flex justify-center">
                  <img
                    src={selectedImage}
                    alt="Full size image"
                    className="max-w-full max-h-[70vh] object-contain rounded"
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}

    