

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Clock, Info, CheckCircle2, RefreshCw, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from 'react';

const tasks = [
    { id: 'TSK-002', title: 'Sanitation Audit (AI)', store: 'Uptown', status: 'In Progress', dueDate: '2023-10-20', points: 150 },
    { id: 'TSK-003', title: 'Holiday Promo Setup (Rework)', store: 'Eastside', status: 'Rework', dueDate: '2023-10-18', points: 250 },
    { id: 'TSK-004', title: 'Weekly Stock Count (Overdue)', store: 'Suburbia', status: 'Overdue', dueDate: '2023-10-12', points: 100 },
    { id: 'TSK-005', title: 'Fire Safety Inspection (New)', store: 'Downtown', status: 'New', dueDate: '2023-10-25', points: 200 },
    { id: 'TSK-001', title: 'Q3 Product Display Check', store: 'Downtown', status: 'Completed', dueDate: '2023-10-15', points: 120 },
    { id: 'TSK-011', title: 'Temperature Log (Input)', store: 'Eastside', status: 'In Progress', dueDate: '2023-10-28', points: 50 },
    { id: 'TSK-012', title: 'End-of-day Report (Multiple Criteria)', store: 'Downtown', status: 'New', dueDate: '2023-10-29', points: 300 },
];

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'New':
            return {
                badge: <Badge variant="secondary">Mới</Badge>,
                icon: <Info className="h-4 w-4 text-muted-foreground" />,
                textColor: 'text-foreground'
            };
        case 'In Progress':
            return {
                badge: <Badge className="bg-info text-info-foreground hover:bg-info/90">Đang thực hiện</Badge>,
                icon: <Clock className="h-4 w-4 text-info" />,
                textColor: 'text-info-foreground'
            };
        case 'Overdue':
            return {
                badge: <Badge variant="destructive">Quá hạn</Badge>,
                icon: <Clock className="h-4 w-4 text-destructive" />,
                textColor: 'text-destructive'
            };
        case 'Completed':
            return {
                badge: <Badge className="bg-success text-success-foreground hover:bg-success/90">Hoàn thành</Badge>,
                icon: <CheckCircle2 className="h-4 w-4 text-success" />,
                textColor: 'text-success-foreground'
            };
        case 'Rework':
            return {
                badge: <Badge variant="destructive">Yêu cầu làm lại</Badge>,
                icon: <RefreshCw className="h-4 w-4 text-destructive" />,
                textColor: 'text-destructive'
            };
        default:
            return {
                badge: <Badge variant="outline">{status}</Badge>,
                icon: <Info className="h-4 w-4 text-muted-foreground" />,
                textColor: 'text-muted-foreground'
            };
    }
};

const TaskCard = ({ task }: { task: typeof tasks[0] }) => {
    const statusInfo = getStatusInfo(task.status);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="line-clamp-2">{task.title}</CardTitle>
                <CardDescription>{task.store}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
               <div className="flex items-center gap-2 text-sm">
                   {statusInfo.icon}
                   <span className={statusInfo.textColor}>Hạn chót: {task.dueDate}</span>
               </div>
               <div className="flex items-center">
                   {statusInfo.badge}
               </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <span className="font-semibold">{task.points} điểm</span>
                <Button asChild variant="outline" size="sm">
                    <Link href={`/field-tasks/${task.id}`}>
                        {task.status === 'Completed' ? 'Xem báo cáo' : 'Xem chi tiết'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

const EmptyState = ({ title, description }: { title: string; description: string; }) => (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg mt-6">
        <ClipboardList className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-semibold mt-4">{title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
    </div>
);

export default function FieldTasksPage() {
    const pendingTasks = tasks.filter(t => ['New', 'In Progress', 'Rework'].includes(t.status));
    const overdueTasks = tasks.filter(t => t.status === 'Overdue');
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Tác vụ của tôi</h1>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Đang chờ</TabsTrigger>
                    <TabsTrigger value="overdue">Quá hạn</TabsTrigger>
                    <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    {pendingTasks.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                            {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
                        </div>
                    ) : (
                        <EmptyState title="Không có tác vụ nào" description="Bạn đã hoàn thành hết các công việc được giao. Làm tốt lắm!" />
                    )}
                </TabsContent>
                <TabsContent value="overdue">
                    {overdueTasks.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                            {overdueTasks.map(task => <TaskCard key={task.id} task={task} />)}
                        </div>
                    ) : (
                        <EmptyState title="Không có tác vụ quá hạn" description="Tất cả các công việc của bạn đều đang trong thời hạn." />
                    )}
                </TabsContent>
                <TabsContent value="completed">
                    {completedTasks.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                            {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                        </div>
                    ) : (
                        <EmptyState title="Chưa có tác vụ hoàn thành" description="Các công việc đã hoàn thành của bạn sẽ xuất hiện ở đây." />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
