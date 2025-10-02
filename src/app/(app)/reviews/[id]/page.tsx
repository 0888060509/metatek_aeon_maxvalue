

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

import { cn } from "@/lib/utils";

const reviewData = {
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
      }
  ]
};

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const reviewImage = PlaceHolderImages.find(p => p.id === reviewData.criteria[0].submittedImageId);
  const userAvatar = PlaceHolderImages.find(p => p.id === reviewData.userAvatar);
  const managerAvatar = PlaceHolderImages.find(p => p.id === reviewData.managerAvatar);
  
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

  const ApproveButton = ({ isMobile = false }: { isMobile?: boolean }) => {
    const button = (
        <Button className={isMobile ? "w-full" : ""}>
            <ThumbsUp className="mr-2 h-4 w-4" /> Phê duyệt
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


  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/reviews">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to reviews</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Review: {reviewData.taskTitle}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Yêu cầu làm lại
          </Button>
          <ApproveButton />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Kết quả thực hiện</h2>
              <p className="text-sm text-muted-foreground mt-1">Báo cáo do <strong>{reviewData.submittedBy}</strong> gửi lúc {reviewData.submittedAt}.</p>
            </div>
             <div className="mt-4 space-y-4">
              {reviewData.criteria.map(criterion => (
                <div key={criterion.id}>
                    <h3 className="font-semibold mb-2 text-base">{criterion.requirement}</h3>
                    <div className="grid gap-4 items-start">
                        {reviewImage && (
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
                                        <div>
                                            <Alert variant={criterion.aiResult === 'Đạt' ? 'default' : 'destructive'} className={cn(criterion.aiResult === 'Đạt' ? 'bg-success/10 border-success/50' : '')}>
                                                <div className="flex items-center">
                                                    {criterion.aiResult === 'Đạt' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                                    <AlertTitle className="ml-2 font-semibold">Kết quả phân tích của AI: {criterion.aiResult}</AlertTitle>
                                                </div>
                                                <AlertDescription className="mt-2">
                                                {criterion.aiReason}
                                                </AlertDescription>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                         <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-xs">Xem chi tiết phân tích của AI</Button>
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
                                            </Alert>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
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
            <CardContent className="space-y-6">
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
            </CardContent>
            <CardFooter className="flex gap-2">
                {managerAvatar && <Avatar>
                    <AvatarImage src={managerAvatar.imageUrl} alt="Manager" data-ai-hint={managerAvatar.imageHint}/>
                    <AvatarFallback>AM</AvatarFallback>
                </Avatar>}
                <div className="relative w-full">
                    <Textarea placeholder="Nhập bình luận hoặc lý do yêu cầu làm lại..." className="pr-12"/>
                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Send className="h-5 w-5"/>
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
              <div className="flex justify-between font-semibold">
                <span>Trạng thái hiện tại:</span>
                <Badge variant="secondary">{reviewData.status}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <div className="md:hidden flex items-center gap-2 mt-4">
          <Button variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Yêu cầu làm lại
          </Button>
          <ApproveButton isMobile={true} />
        </div>
    </div>
  );

    
}
