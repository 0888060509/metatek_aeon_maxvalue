
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Award, CheckCircle, Target, LogOut } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function FieldAccountPage() {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-3');

  return (
    <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
            {userAvatar && (
                 <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                    <AvatarImage src={userAvatar.imageUrl} alt="Clara Garcia" data-ai-hint={userAvatar.imageHint}/>
                    <AvatarFallback>CG</AvatarFallback>
                </Avatar>
            )}
            <div className="text-center">
                <h1 className="text-2xl font-bold">Clara Garcia</h1>
                <p className="text-muted-foreground">Store: Eastside</p>
            </div>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Thành tích của bạn</CardTitle>
                <CardDescription>Thống kê hiệu suất công việc trong tháng này.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
                 <div className="p-4 flex flex-col items-center justify-center rounded-lg bg-secondary/50">
                    <Award className="h-8 w-8 text-primary mb-2"/>
                    <p className="text-2xl font-bold">1,250</p>
                    <p className="text-sm text-muted-foreground">Tổng điểm</p>
                </div>
                 <div className="p-4 flex flex-col items-center justify-center rounded-lg bg-secondary/50">
                    <CheckCircle className="h-8 w-8 text-success mb-2"/>
                    <p className="text-2xl font-bold">25</p>
                    <p className="text-sm text-muted-foreground">Tác vụ hoàn thành</p>
                </div>
                 <div className="p-4 flex flex-col items-center justify-center rounded-lg bg-secondary/50">
                    <Target className="h-8 w-8 text-info mb-2"/>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-sm text-muted-foreground">Duyệt lần đầu</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">Sắp ra mắt</h3>
                    <p className="text-muted-foreground mt-2">Các tùy chọn cài đặt tài khoản sẽ có ở đây.</p>
                </div>
            </CardContent>
        </Card>

         <Button variant="outline" className="w-full" asChild>
            <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
            </Link>
        </Button>
    </div>
  );
}
