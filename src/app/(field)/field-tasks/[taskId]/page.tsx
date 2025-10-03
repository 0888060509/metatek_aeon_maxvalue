
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeft, RefreshCw, FileText, Send, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';


// In a real app, you would fetch task details based on params.taskId
const tasks = {
    'TSK-001': {
        id: 'TSK-001',
        reviewId: 'REV-001',
        title: 'Q3 Product Display Check',
        description: 'Review the product displays for the Q3 campaign to ensure they are compliant with brand guidelines.',
        store: 'Downtown',
        dueDate: '2023-10-15',
        status: 'Completed',
        rejectionReason: null,
        points: 120,
        comments: [],
    },
    'TSK-002': {
        id: 'TSK-002',
        reviewId: 'REV-008',
        title: 'Sanitation Audit',
        description: 'Perform a comprehensive sanitation audit of the store premises, including shelves, floors, and storage areas. Ensure compliance with health and safety regulations.',
        store: 'Uptown',
        dueDate: '2023-10-20',
        status: 'In Progress',
        rejectionReason: null,
        points: 150,
        comments: [],
    },
    'TSK-003': {
        id: 'TSK-003',
        reviewId: 'REV-002',
        title: 'Holiday Promo Setup',
        description: 'Set up the main promotional display for the holiday season according to the provided planogram.',
        store: 'Eastside',
        dueDate: '2023-10-18',
        status: 'Rework',
        rejectionReason: 'Sản phẩm "Festive Soda" đặt sai vị trí so với planogram. Planogram yêu cầu đặt ở kệ thứ 2, ảnh chụp cho thấy sản phẩm ở kệ thứ 3.',
        points: 250,
        comments: [
            {
                author: 'Ana Miller',
                avatarId: 'user-avatar-1',
                text: 'AI đã phát hiện sản phẩm đặt sai vị trí. Em kiểm tra lại giúp chị nhé.',
                timestamp: '15 phút trước',
                type: 'rework_request'
            },
            {
                author: 'Clara Garcia',
                avatarId: 'user-avatar-3',
                text: 'Dạ em đã nhận được yêu cầu. Em sẽ kiểm tra và nộp lại ngay ạ.',
                timestamp: '10 phút trước',
                type: 'comment'
            },
        ]
    },
    'TSK-004': {
        id: 'TSK-004',
        reviewId: 'REV-004',
        title: 'Weekly Stock Count',
        description: 'Perform weekly stock count for all high-value items.',
        store: 'Suburbia',
        dueDate: '2023-10-12',
        status: 'Overdue',
        rejectionReason: null,
        points: 100,
        comments: [],
    },
    'TSK-005': {
        id: 'TSK-005',
        reviewId: 'REV-005',
        title: 'Fire Safety Inspection',
        description: 'Check all fire extinguishers and emergency exits are clear.',
        store: 'Downtown',
        dueDate: '2023-10-25',
        status: 'New',
        rejectionReason: null,
        points: 200,
        comments: [],
    }
};

type Task = typeof tasks[keyof typeof tasks];

export default function FieldTaskDetailPage() {
  const params = useParams();
  const taskId = params.taskId as string;
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (taskId) {
      const data = tasks[taskId as keyof typeof tasks];
      setTaskData(data || null);
    }
  }, [taskId]);

  const handleAddComment = () => {
    if (newComment.trim() === "" || !taskData) return;

    const commentToAdd = {
      author: 'Clara Garcia', // Assuming the field user is commenting
      avatarId: 'user-avatar-3',
      text: newComment,
      timestamp: 'Vừa xong',
      type: 'comment' as const,
    };

    setTaskData(prevData => prevData ? ({
      ...prevData,
      comments: [...prevData.comments, commentToAdd],
    }) : null);
    setNewComment("");
  };

  const getAction = () => {
    if (!taskData) {
        return null; // Don't render any button while data is loading
    }

    const { status, id, reviewId } = taskData;
    
    if (status === 'Completed') {
        return (
            <Button size="lg" className="w-full" asChild>
                <Link href={`/app/reviews/${reviewId}`}> 
                    Xem lại báo cáo đã nộp
                </Link>
            </Button>
        );
    }
    
    if (status === 'Rework') {
        return (
             <Button size="lg" className="w-full" asChild>
                <Link href={`/field-tasks/${id}/execute?rework=true`}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Bắt đầu làm lại
                </Link>
            </Button>
        );
    }

    // Default action for 'In Progress', 'New', 'Overdue' etc.
    return (
        <Button size="lg" className="w-full" asChild>
            <Link href={`/field-tasks/${id}/execute`}>
                Bắt đầu thực hiện
            </Link>
        </Button>
    );
  };
  
  if (!taskData) {
      return (
        <div className="space-y-4 pb-20 2xl:pb-0">
            <div className="flex items-center gap-4">
                 <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
                 <CardFooter className="flex-col items-start gap-2 border-t pt-4">
                    <Skeleton className="h-5 w-1/5" />
                    <Skeleton className="h-20 w-full" />
                </CardFooter>
            </Card>
        </div>
      );
  }

  return (
    <div className="space-y-4 pb-20 2xl:pb-0">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href="/tasks">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back to tasks</span>
                </Link>
            </Button>
        </div>
       
        <Card className="overflow-hidden">
            <div className="bg-card-foreground/5 p-6">
                <CardTitle className="text-2xl">{taskData.title}</CardTitle>
                <CardDescription className="mt-2">
                    Hạn chót: {taskData.dueDate} • {taskData.points} điểm
                </CardDescription>
            </div>
             <CardContent className="p-6 space-y-6">
                 {taskData.status === 'Rework' && taskData.rejectionReason && (
                    <Alert variant="destructive">
                        <RefreshCw className="h-4 w-4" />
                        <AlertTitle>Yêu cầu làm lại</AlertTitle>
                        <AlertDescription>
                            {taskData.rejectionReason}
                        </AlertDescription>
                    </Alert>
                )}

                 <div>
                    <h3 className="font-semibold text-base mb-2">Chi tiết</h3>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">Cửa hàng</span>
                            <span className="font-medium">{taskData.store}</span>
                        </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">Trạng thái</span>
                            <span className="font-medium">{taskData.status}</span>
                        </div>
                    </div>
                </div>

                <Separator />
                
                <div>
                    <h3 className="font-semibold text-base mb-2">Mô tả</h3>
                    <p className="text-muted-foreground text-sm">{taskData.description}</p>
                </div>
                
                <Separator />

                <div>
                    <h3 className="font-semibold text-base mb-2">Tài liệu & Yêu cầu</h3>
                     <Button variant="outline" size="sm" className="mt-1">
                        <FileText className="mr-2 h-4 w-4" />
                        Xem Planogram.pdf
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Trao đổi</CardTitle>
            </CardHeader>
            <CardContent>
                {taskData.comments.length > 0 ? (
                    <ScrollArea className="h-72 pr-4">
                        <div className="space-y-4">
                        {taskData.comments.map((comment, index) => {
                            const authorAvatar = PlaceHolderImages.find(p => p.id === comment.avatarId);
                            const isUser = comment.author === 'Clara Garcia';
                            return (
                                <div key={index} className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                                    {!isUser && authorAvatar && (
                                        <Avatar>
                                            <AvatarImage src={authorAvatar.imageUrl} alt={comment.author} data-ai-hint={authorAvatar.imageHint}/>
                                            <AvatarFallback>{comment.author.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("flex-initial max-w-xs md:max-w-md", isUser ? "order-1" : "order-2")}>
                                        <div className={cn("flex items-center", isUser ? "justify-end" : "justify-between")}>
                                            {!isUser && <p className="font-semibold text-sm">{comment.author}</p>}
                                            <p className="text-xs text-muted-foreground ml-2">{comment.timestamp}</p>
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-lg mt-1 text-sm",
                                            isUser ? "bg-primary text-primary-foreground" : (comment.type === 'rework_request' ? "border bg-transparent" : "bg-secondary")
                                        )}>
                                            {comment.type === 'rework_request' && 
                                                <p className="font-semibold text-foreground flex items-center mb-2">
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Yêu cầu làm lại
                                                </p>
                                            }
                                            <p>{comment.text}</p>
                                        </div>
                                    </div>
                                     {isUser && authorAvatar && (
                                        <Avatar className="order-2">
                                            <AvatarImage src={authorAvatar.imageUrl} alt={comment.author} data-ai-hint={authorAvatar.imageHint}/>
                                            <AvatarFallback>{comment.author.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            );
                        })}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-72">
                        <MessageSquare className="h-10 w-10 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mt-4">Chưa có trao đổi</h3>
                        <p className="text-muted-foreground mt-2">Hãy là người đầu tiên đặt câu hỏi hoặc gửi bình luận về công việc này.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 border-t pt-4">
                <Label htmlFor="new-comment">Thêm bình luận</Label>
                 <div className="relative w-full">
                      <Textarea 
                          id="new-comment"
                          placeholder="Nhập bình luận của bạn..." 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment();
                          }
                          }}
                          className="pr-10"
                      />
                      <Button 
                          type="submit" 
                          size="icon" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7" 
                          disabled={!newComment.trim()}
                          onClick={handleAddComment}
                      >
                          <Send className="h-4 w-4" />
                      </Button>
                  </div>
            </CardFooter>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 border-t bg-background/95 backdrop-blur-sm 2xl:hidden">
            {getAction()}
        </div>
        <div className="hidden pt-4 2xl:flex 2xl:justify-end">
            {getAction()}
        </div>
    </div>
  );
}
