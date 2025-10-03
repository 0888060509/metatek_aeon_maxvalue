
'use client';

import Link from "next/link";
import Image from "next/image";
import { 
    ChevronLeft, 
    CheckCircle2,
    XCircle,
    Send,
    ThumbsUp,
    RefreshCw,
    MessageSquarePlus,
    Camera,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const initialReviewData = {
  id: 'REV-002',
  taskId: 'TSK-003',
  taskTitle: 'Holiday Promo Setup',
  store: 'Eastside',
  submittedBy: 'Clara Garcia',
  submittedAt: '2023-10-18 02:30 PM',
  status: 'Pending Approval',
  aiStatus: 'Không Đạt',
  userAvatar: 'user-avatar-3',
  managerAvatar: 'user-avatar-1',
  criteria: [
    {
      id: 'crit-1',
      requirement: 'Chụp ảnh toàn cảnh khu vực trưng bày và đối chiếu với guideline',
      type: 'visual-compliance-ai',
      submittedImageId: 'task-image-2',
      aiResult: 'Không Đạt',
      aiReason: 'Sản phẩm "Festive Soda" đặt sai vị trí so với planogram. Planogram yêu cầu đặt ở kệ thứ 2, ảnh chụp cho thấy sản phẩm ở kệ thứ 3.',
      score: 0,
      maxScore: 100,
    },
    {
      id: 'crit-6',
      requirement: 'Chụp ảnh chi tiết các góc của khu vực trưng bày (tối thiểu 3 ảnh)',
      type: 'photo-capture',
      submittedImageIds: ['task-image-1', 'review-image-1', 'login-background'],
      score: 30,
      maxScore: 30,
    },
    {
      id: 'crit-2',
      requirement: 'Hoàn thành checklist vệ sinh khu vực trưng bày',
      type: 'checklist',
      score: 40,
      maxScore: 50,
      checklistItems: [
        { label: 'Lau sạch bụi trên kệ', checked: true },
        { label: 'Sắp xếp sản phẩm gọn gàng, đúng hàng lối', checked: true },
        { label: 'Kiểm tra và thay thế bảng giá bị hỏng', checked: false },
        { label: 'Dọn dẹp rác xung quanh khu vực', checked: true },
      ]
    },
    {
        id: 'crit-3',
        requirement: 'Bảng hiệu khuyến mãi đã được đặt ở đúng vị trí chưa?',
        type: 'multiple-choice',
        score: 25,
        maxScore: 25,
        options: [
            { label: 'Đúng vị trí' },
            { label: 'Sai vị trí' },
            { label: 'Chưa có bảng hiệu' },
        ],
        selectedOption: 'Đúng vị trí'
    },
    {
        id: 'crit-4',
        requirement: 'Báo cáo các vấn đề phát sinh (nếu có)',
        type: 'text-input',
        value: 'Khách hàng phàn nàn về việc khó tìm thấy sản phẩm khuyến mãi do bị che khuất.',
        score: 10,
        maxScore: 10,
    },
    {
        id: 'crit-5',
        requirement: 'Nhập số lượng sản phẩm tồn kho trên kệ',
        type: 'number-input',
        value: '150',
        score: 5,
        maxScore: 5,
    }
  ],
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
};

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const [reviewData, setReviewData] = useState<typeof initialReviewData | null>(null);
  const [newComment, setNewComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Simulate fetching data and avoid hydration mismatch
    setReviewData(initialReviewData);
    setIsClient(true);
  }, []);


  const handleAddComment = () => {
    if (newComment.trim() === "" || !reviewData) return;

    const commentToAdd = {
      author: 'Ana Miller', // Assuming the manager is commenting
      avatarId: 'user-avatar-1',
      text: newComment,
      timestamp: 'Vừa xong',
      type: 'comment' as const,
    };

    setReviewData(prevData => prevData ? ({
      ...prevData,
      comments: [...prevData.comments, commentToAdd],
    }) : null);
    setNewComment("");
  };

  const handleRequestRework = () => {
    if (rejectionReason.trim() === "" || !reviewData) return;

     const commentToAdd = {
      author: 'Ana Miller',
      avatarId: 'user-avatar-1',
      text: rejectionReason,
      timestamp: 'Vừa xong',
      type: 'rework_request' as const,
    };

    setReviewData(prevData => prevData ? ({
      ...prevData,
      comments: [...prevData.comments, commentToAdd],
      status: 'Rework Requested'
    }) : null);
    setRejectionReason("");
    setShowRejectionInput(false);
  }

  const getAiStatusBadge = (status: string) => {
    switch (status) {
      case 'Đạt':
        return <Badge className="bg-success hover:bg-success/90 text-success-foreground"><CheckCircle2 className="mr-2 h-4 w-4" />AI: Đạt</Badge>;
      case 'Không Đạt':
        return <Badge variant="destructive"><XCircle className="mr-2 h-4 w-4" />AI: Không Đạt</Badge>;
      default:
        return <Badge variant="secondary">Lỗi phân tích</Badge>;
    }
  };

  const ApproveButton = () => {
    if (!reviewData) return null;
    const button = (
        <Button className="w-full sm:w-auto">
            <ThumbsUp className="mr-2 h-4 w-4" /> Duyệt
        </Button>
    );

    if (reviewData.aiStatus === 'Không Đạt') {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    {button}
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận ghi đè và phê duyệt?</AlertDialogTitle>
                        <AlertDialogDescription>
                            AI gợi ý tác vụ này "Không Đạt". Bạn có chắc chắn muốn ghi đè quyết định và phê duyệt báo cáo này không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction>Xác nhận Phê duyệt</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }
    return button;
  };
  
  if (!reviewData || !isClient) {
      return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-6 w-48" />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
      );
  }

  const managerAvatar = PlaceHolderImages.find(p => p.id === reviewData.managerAvatar);
  
  const renderCriterion = (criterion: any) => {
    switch (criterion.type) {
      case 'visual-compliance-ai':
        const reviewImage = PlaceHolderImages.find(p => p.id === criterion.submittedImageId);
        if (!reviewImage) return null;

        return (
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer group">
                <Image
                  src={reviewImage.imageUrl}
                  alt="Submitted task evidence"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                  data-ai-hint={reviewImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <span className="text-white font-semibold">Xem chi tiết & Phân tích AI</span>
                </div>
                <div className="absolute top-2 right-2">
                  {getAiStatusBadge(criterion.aiResult)}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>Chi tiết hình ảnh và phân tích của AI</DialogTitle>
                <DialogDescription>
                  Tiêu chuẩn: "{criterion.requirement}"
                </DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <Image
                  src={reviewImage.imageUrl}
                  alt="Submitted task evidence"
                  width={1200}
                  height={800}
                  className="rounded-lg object-contain"
                />
                <div className="space-y-4">
                  <Alert variant={criterion.aiResult === 'Đạt' ? 'default' : 'destructive'} className={cn(criterion.aiResult === 'Đạt' ? 'bg-success/10 border-success/50' : '')}>
                    <div className="flex items-center">
                      {criterion.aiResult === 'Đạt' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      <AlertTitle className="ml-2 font-semibold">Kết quả phân tích của AI: {criterion.aiResult}</AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {criterion.aiReason}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                     <p className="text-sm font-medium">Tài liệu tham khảo</p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                Xem Planogram.pdf
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl h-[90vh]">
                            <DialogHeader>
                                <DialogTitle>Planogram.pdf</DialogTitle>
                                <DialogDescription>Tài liệu hướng dẫn trưng bày sản phẩm được sử dụng để đối chiếu.</DialogDescription>
                            </DialogHeader>
                            <div className="h-full w-full border rounded-md">
                                <iframe src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" className="h-full w-full" />
                            </div>
                        </DialogContent>
                    </Dialog>
                  </div>

                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">Xem chi tiết phân tích của AI</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tính năng đang phát triển</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tính năng xem chi tiết phân tích của AI đang được phát triển và sẽ sớm ra mắt.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>Đã hiểu</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      
      case 'checklist':
        return (
            <Card className="bg-secondary/50">
                <CardContent className="pt-6 space-y-3">
                    {criterion.checklistItems.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                            <Checkbox id={`checklist-${criterion.id}-${index}`} checked={item.checked} disabled />
                            <Label htmlFor={`checklist-${criterion.id}-${index}`} className={cn("text-sm", item.checked ? "" : "text-muted-foreground")}>
                                {item.label}
                            </Label>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );

      case 'multiple-choice':
        return (
            <Card className="bg-secondary/50">
                <CardContent className="pt-6">
                    <RadioGroup value={criterion.selectedOption} disabled>
                        <div className="space-y-2">
                        {criterion.options.map((option: any, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.label} id={`option-${criterion.id}-${index}`} />
                                <Label htmlFor={`option-${criterion.id}-${index}`}>{option.label}</Label>
                            </div>
                        ))}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
        );
        
      case 'text-input':
          return (
              <Card className="bg-secondary/50">
                  <CardContent className="pt-6">
                      <p className="text-sm text-foreground">{criterion.value}</p>
                  </CardContent>
              </Card>
          );

      case 'number-input':
          return (
              <Card className="bg-secondary/50">
                  <CardContent className="pt-6">
                      <p className="text-sm font-semibold text-foreground">{criterion.value}</p>
                  </CardContent>
              </Card>
          );
      
      case 'photo-capture':
          const images = criterion.submittedImageIds.map((id: string) => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);
          return (
              <Card className="bg-secondary/50">
                  <CardContent className="pt-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {images.map((image: any, index: number) => (
                              <Dialog key={index}>
                                  <DialogTrigger asChild>
                                    <div className="relative cursor-pointer group aspect-square">
                                        <Image
                                            src={image.imageUrl}
                                            alt={`Submitted photo ${index + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            className="rounded-lg object-cover"
                                            data-ai-hint={image.imageHint}
                                        />
                                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                            <span className="text-white font-semibold text-xs text-center">Xem ảnh</span>
                                        </div>
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                      <DialogHeader>
                                          <DialogTitle>Ảnh đã nộp {index + 1}</DialogTitle>
                                      </DialogHeader>
                                      <Image
                                          src={image.imageUrl}
                                          alt={`Submitted photo ${index + 1}`}
                                          width={1920}
                                          height={1080}
                                          className="rounded-lg object-contain max-h-[75vh]"
                                      />
                                  </DialogContent>
                              </Dialog>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          );

      default:
        return null;
    }
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 mb-32">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/app/reviews">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to reviews</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Review: {reviewData.taskTitle}
          </h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Kết quả thực hiện</h2>
                <p className="text-sm text-muted-foreground mt-1">Báo cáo do <strong>{reviewData.submittedBy}</strong> gửi lúc {reviewData.submittedAt}.</p>
              </div>
              <div className="mt-4 space-y-6">
                {reviewData.criteria.map((criterion, index) => (
                  <div key={criterion.id}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-base flex-1">{`${index + 1}. ${criterion.requirement}`}</h3>
                        <span className="text-sm font-bold text-foreground/80">{criterion.score}/{criterion.maxScore}</span>
                      </div>
                      <div className="grid gap-4 items-start">
                          {renderCriterion(criterion)}
                      </div>
                  </div>
                ))}
              </div>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                  <CardTitle>Trao đổi & Lịch sử</CardTitle>
              </CardHeader>
              <CardContent>
                  <ScrollArea className="h-96 pr-4">
                      <div className="space-y-4">
                      {reviewData.comments.map((comment, index) => {
                          const authorAvatar = PlaceHolderImages.find(p => p.id === comment.avatarId);
                          return (
                              <div key={index} className="flex gap-3">
                              {authorAvatar && <Avatar>
                                      <AvatarImage src={authorAvatar.imageUrl} alt={comment.author} data-ai-hint={authorAvatar.imageHint}/>
                                      <AvatarFallback>{comment.author.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                  </Avatar>}
                                  <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                          <p className="font-semibold text-sm">{comment.author}</p>
                                          <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                                      </div>
                                      <div className={cn(
                                          "p-3 rounded-lg mt-1 text-sm",
                                          comment.type === 'rework_request' ? "border bg-transparent" : "bg-secondary"
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
                              </div>
                          );
                      })}
                      </div>
                  </ScrollArea>
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
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chung</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cửa hàng:</span>
                  <span>{reviewData.store}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người nộp:</span>
                  <span>{reviewData.submittedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian:</span>
                  <span>{reviewData.submittedAt}</span>
                </div>
                 <Separator className="my-2"/>
                <div className="flex justify-between items-center font-semibold">
                  <span>Tổng điểm:</span>
                  <span className="text-xl">{reviewData.criteria.reduce((acc, c) => acc + c.score, 0)}/{reviewData.criteria.reduce((acc, c) => acc + c.maxScore, 0)}</span>
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between font-semibold">
                  <span>Trạng thái hiện tại:</span>
                  <Badge variant={reviewData.status === 'Rework Requested' ? 'destructive' : 'secondary'}>{reviewData.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/95 backdrop-blur-sm">
        <div className={cn("flex flex-col sm:flex-row items-center gap-4 p-4", "md:ml-56")}>
            {showRejectionInput ? (
                <div className="w-full flex-1 space-y-2">
                    <Label htmlFor="rejection-reason">Lý do từ chối</Label>
                    <div className="relative">
                        <Textarea
                            id="rejection-reason"
                            placeholder="Nhập lý do yêu cầu làm lại..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="pr-20"
                        />
                         <Button 
                            variant="secondary"
                            size="sm" 
                            className="absolute right-2 top-1/2 -translate-y-1/2" 
                            disabled={!rejectionReason.trim()}
                            onClick={handleRequestRework}
                        >
                            <Send className="mr-2 h-4 w-4" /> Gửi
                        </Button>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowRejectionInput(false)}>Hủy</Button>
                </div>
            ) : (
                <>
                    <Button variant="destructive" className="w-full sm:w-auto flex-1 sm:flex-initial" onClick={() => setShowRejectionInput(true)}>
                        <XCircle className="mr-2 h-4 w-4" /> Từ chối
                    </Button>
                    <div className="w-full sm:w-auto flex-1 sm:flex-initial">
                        <ApproveButton />
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
}

    

    

    
