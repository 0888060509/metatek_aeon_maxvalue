'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGetTaskItemDetail, useApproveTaskItem, useDenyTaskItem, useGetTaskNotes, useCreateTaskNote } from '@/api/app/hooks';
import { getTaskStatus, getPriorityText, formatDate, generateTaskCode } from '@/lib/task-display-utils';
import { TASK_STATES } from '@/api/app/task-utils';
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
import {
    CheckCircle2,
    XCircle,
    ChevronLeft,
    MoreHorizontal,
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Get task status badge
const getTaskStatusBadge = (state: number) => {
  switch (state) {
    case TASK_STATES.WAIT_REVIEW:
      return <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200">Chờ duyệt</Badge>;
    case TASK_STATES.COMPLETE:
      return <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200">Đã duyệt</Badge>;
    case TASK_STATES.DENY:
      return <Badge variant="destructive">Từ chối</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;
  const { userRole } = useCurrentUser();
  const { toast } = useToast();

  // State for chat
  const [messageContent, setMessageContent] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  // API hooks
  const { data: taskDetail, loading, error, execute } = useGetTaskItemDetail();
  const { execute: approveTask, loading: approving } = useApproveTaskItem();
  const { execute: denyTask, loading: denying } = useDenyTaskItem();
  
  // Task notes hooks
  const {
    data: taskNotes,
    loading: notesLoading,
    error: notesError,
    execute: fetchNotes
  } = useGetTaskNotes();
  
  const { execute: createNote, loading: creatingNote } = useCreateTaskNote();

  // Fetch task detail and notes on mount
  React.useEffect(() => {
    if (taskId) {
      execute(taskId);
    }
  }, [taskId]);

  React.useEffect(() => {
    if (taskId) {
      fetchNotes({ taskItemId: taskId });
    }
  }, [taskId]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageContent.trim() || !taskId) return;

    try {
      await createNote({
        taskItemId: taskId,
        content: messageContent.trim()
      });

      // Clear input and refresh notes
      setMessageContent('');
      fetchNotes({ taskItemId: taskId });

      toast({
        title: "Gửi tin nhắn thành công",
        description: "Tin nhắn đã được gửi.",
      });
    } catch (error) {
      toast({
        title: "Lỗi gửi tin nhắn",
        description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Handle approve task
  const handleApprove = async () => {
    try {
      await approveTask(taskId);
      
      toast({
        title: "Phê duyệt thành công",
        description: "Nhiệm vụ đã được phê duyệt.",
      });
      
      // Refresh task detail
      execute(taskId);
      
      // Navigate back to reviews page
      router.push('/app/reviews');
    } catch (error) {
      toast({
        title: "Lỗi phê duyệt",
        description: "Không thể phê duyệt nhiệm vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Handle deny task
  const handleDeny = async () => {
    try {
      await denyTask(taskId);
      
      toast({
        title: "Từ chối thành công",
        description: "Nhiệm vụ đã được từ chối.",
      });
      
      // Refresh task detail
      execute(taskId);
      
      // Navigate back to reviews page
      router.push('/app/reviews');
    } catch (error) {
      toast({
        title: "Lỗi từ chối",
        description: "Không thể từ chối nhiệm vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Render task notes (chat interface)
  const renderTaskNotes = () => {
    if (notesLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Đang tải tin nhắn...</span>
        </div>
      );
    }

    if (notesError) {
      return (
        <div className="text-center py-8 text-red-500">
          Không thể tải tin nhắn: {notesError}
        </div>
      );
    }

    if (!taskNotes || taskNotes.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có tin nhắn nào
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-3 p-4 max-h-96 overflow-y-auto">
        {taskNotes.map((note) => (
          <div key={note.id} className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {note.authorName ? note.authorName.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
            
            {/* Message bubble */}
            <div className="flex-1 max-w-[80%]">
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="mb-1">
                  <span className="text-sm font-medium">{note.authorName}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatDate(note.createAt)}
                  </span>
                </div>
                <p className="text-sm">{note.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (userRole === 'store') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Không có quyền truy cập</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Bạn không có quyền truy cập trang này.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/app/reviews">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại danh sách review</span>
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/app/reviews">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại danh sách review</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Chi tiết review</h1>
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
            <Link href="/app/reviews">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại danh sách review</span>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/app/reviews">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Quay lại danh sách review</span>
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
              <DropdownMenuLabel>Thao tác review</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/app/tasks/${taskId}`}>
                  Xem chi tiết task
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{task.name}</CardTitle>
                  <CardDescription>
                    {task.description || 'Không có mô tả'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getTaskStatusBadge(task.state || 0)}
                  <Badge variant="outline">
                    {getPriorityText(task.priority)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Người giao việc</p>
                  <p className="font-medium">{task.creatorName || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Người thực hiện</p>
                  <p className="font-medium">{task.assigneeName || '-'}</p>
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
                  Danh sách các mục tiêu đã hoàn thành cho nhiệm vụ này.
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

                          {/* Display submitted images */}
                          {goal.type === 1 && goal.progressValue && (
                            <div className="mt-4 space-y-3">
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Ảnh đã nộp:</p>
                                <div className="flex flex-wrap gap-2">
                                  {goal.progressValue.split(',').map((imageUrl, imgIndex) => {
                                    const cleanUrl = imageUrl.trim();
                                    if (!cleanUrl) return null;
                                    return (
                                      <div key={imgIndex} className="relative group">
                                        <img
                                          src={cleanUrl}
                                          alt={`Submitted image ${imgIndex + 1}`}
                                          className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                                          onClick={() => setSelectedImage(cleanUrl)}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
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

          {/* Review Actions */}
          {task.state === TASK_STATES.WAIT_REVIEW && (
            <Card>
              <CardHeader>
                <CardTitle>Hành động duyệt</CardTitle>
                <CardDescription>
                  Phê duyệt hoặc từ chối nhiệm vụ này.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={approving || denying}
                      >
                        {approving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang duyệt...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Phê duyệt
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận phê duyệt</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn phê duyệt nhiệm vụ này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApprove}>
                          Phê duyệt
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        disabled={approving || denying}
                      >
                        {denying ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang từ chối...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Từ chối
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận từ chối</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn từ chối nhiệm vụ này không? Nhiệm vụ sẽ được gửi lại cho người thực hiện để sửa đổi.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeny} className="bg-red-600 hover:bg-red-700">
                          Từ chối
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Task Notes (Chat interface) */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Tin nhắn</CardTitle>
              <CardDescription>
                Cuộc trò chuyện về nhiệm vụ này
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b">
                {renderTaskNotes()}
              </div>
              
              {/* Message Input */}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Nhập tin nhắn..." 
                    className="flex-1"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={creatingNote}
                  />
                  <Button 
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim() || creatingNote}
                  >
                    {creatingNote ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Gửi
                      </>
                    ) : (
                      'Gửi'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
