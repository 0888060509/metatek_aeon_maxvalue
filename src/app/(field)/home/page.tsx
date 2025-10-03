
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, ClipboardList, Clock, RefreshCw, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const summary = {
    pending: 2,
    overdue: 1,
    rework: 1,
};

const recentActivities = [
    { type: 'rework', description: 'Task "Holiday Promo Setup" was rejected.', time: '30m ago', link: '/field-tasks/TSK-003' },
    { type: 'approved', description: 'Task "Sanitation Audit" was approved.', time: '2h ago', link: '/field-tasks/TSK-002' },
    { type: 'new_task', description: 'New task assigned: "Fire Safety Inspection".', time: '1d ago', link: '/field-tasks/TSK-005' },
];

export default function FieldHomePage() {
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-3');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                {userAvatar && (
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={userAvatar.imageUrl} alt="Clara Garcia" data-ai-hint={userAvatar.imageHint}/>
                        <AvatarFallback>CG</AvatarFallback>
                    </Avatar>
                )}
                <div>
                    <h1 className="text-2xl font-bold">Chào mừng trở lại, Clara!</h1>
                    <p className="text-muted-foreground">Đây là tóm tắt công việc hôm nay của bạn.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang chờ</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.pending}</div>
                        <p className="text-xs text-muted-foreground">công việc cần hoàn thành</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
                        <Clock className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.overdue}</div>
                         <p className="text-xs text-muted-foreground">công việc đã trễ hạn</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cần làm lại</CardTitle>
                        <RefreshCw className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.rework}</div>
                         <p className="text-xs text-muted-foreground">công việc bị từ chối</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Công việc của tôi</CardTitle>
                        <CardDescription>Xem và bắt đầu thực hiện các công việc được giao.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                            <ClipboardList className="h-12 w-12 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mt-4">Sẵn sàng làm việc?</h3>
                            <p className="text-muted-foreground mt-2">Tất cả các công việc đang chờ, quá hạn và cần làm lại đều ở trong danh sách công việc của bạn.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" asChild>
                            <Link href="/tasks">
                                Đi đến danh sách công việc
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Hoạt động gần đây</CardTitle>
                        <CardDescription>Các cập nhật mới nhất về công việc của bạn.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivities.map((activity, index) => (
                             <div key={index} className="flex items-center">
                                <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{activity.description}</p>
                                <p className="text-sm text-muted-foreground">{activity.time}</p>
                                </div>
                                <Button asChild variant="secondary" size="sm" className="ml-auto">
                                    <Link href={activity.link}>Xem</Link>
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
