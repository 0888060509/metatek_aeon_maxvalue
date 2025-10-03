

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Clock, Info, CheckCircle2, RefreshCw, ClipboardList, Search, Filter as FilterIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";


const tasks = [
    { id: 'TSK-002', title: 'Sanitation Audit (AI)', store: 'Uptown', status: 'In Progress', dueDate: '2023-10-20', points: 150, priority: 'High' },
    { id: 'TSK-003', title: 'Holiday Promo Setup (Rework)', store: 'Eastside', status: 'Rework', dueDate: '2023-10-18', points: 250, priority: 'High' },
    { id: 'TSK-004', title: 'Weekly Stock Count (Overdue)', store: 'Suburbia', status: 'Overdue', dueDate: '2023-10-12', points: 100, priority: 'Medium' },
    { id: 'TSK-005', title: 'Fire Safety Inspection (New)', store: 'Downtown', status: 'New', dueDate: '2023-10-25', points: 200, priority: 'Medium' },
    { id: 'TSK-001', title: 'Q3 Product Display Check', store: 'Downtown', status: 'Completed', dueDate: '2023-10-15', points: 120, priority: 'Low' },
    { id: 'TSK-011', title: 'Temperature Log (Input)', store: 'Eastside', status: 'In Progress', dueDate: '2023-10-28', points: 50, priority: 'Low' },
    { id: 'TSK-012', title: 'End-of-day Report (Multiple Criteria)', store: 'Downtown', status: 'New', dueDate: '2023-10-29', points: 300, priority: 'High' },
];

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'New':
            return {
                icon: <Info className="h-4 w-4 text-muted-foreground" />,
                textColor: 'text-muted-foreground'
            };
        case 'In Progress':
            return {
                icon: <Clock className="h-4 w-4 text-info" />,
                textColor: 'text-info'
            };
        case 'Overdue':
            return {
                icon: <Clock className="h-4 w-4 text-destructive" />,
                textColor: 'text-destructive'
            };
        case 'Completed':
            return {
                icon: <CheckCircle2 className="h-4 w-4 text-success" />,
                textColor: 'text-success'
            };
        case 'Rework':
            return {
                icon: <RefreshCw className="h-4 w-4 text-destructive" />,
                textColor: 'text-destructive'
            };
        default:
            return {
                icon: <Info className="h-4 w-4 text-muted-foreground" />,
                textColor: 'text-muted-foreground'
            };
    }
};

const TaskCard = ({ task }: { task: typeof tasks[0] }) => {
    const statusInfo = getStatusInfo(task.status);
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="line-clamp-2">{task.title}</CardTitle>
                <CardDescription>{task.store}</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-2 text-sm font-medium">
                   {statusInfo.icon}
                   <span className={statusInfo.textColor}>Hạn chót: {task.dueDate}</span>
               </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto">
                <span className="text-sm font-semibold">{task.points} điểm</span>
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
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ priority: 'all', points: [0] });

    const filteredTasks = useMemo(() => {
        return tasks
            .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(task => filters.priority === 'all' || task.priority === filters.priority)
            .filter(task => task.points >= filters.points[0]);
    }, [searchQuery, filters]);

    const pendingTasks = filteredTasks.filter(t => ['New', 'In Progress', 'Rework'].includes(t.status));
    const overdueTasks = filteredTasks.filter(t => t.status === 'Overdue');
    const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

    const handleApplyFilters = (newFilters: { priority: string; points: number[] }) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({ priority: 'all', points: [0] });
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Tác vụ của tôi</h1>

            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm theo tên công việc..."
                        className="w-full rounded-lg bg-background pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            <FilterIcon className="mr-2 h-4 w-4" />
                            Bộ lọc
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Bộ lọc nâng cao</SheetTitle>
                            <SheetDescription>
                                Lọc danh sách công việc để tìm kiếm nhanh hơn.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-3">
                                <Label htmlFor="priority">Mức độ ưu tiên</Label>
                                <RadioGroup
                                    id="priority"
                                    value={filters.priority}
                                    onValueChange={(value) => setFilters(f => ({ ...f, priority: value }))}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="p-all" />
                                        <Label htmlFor="p-all">Tất cả</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="High" id="p-high" />
                                        <Label htmlFor="p-high">Cao</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Medium" id="p-medium" />
                                        <Label htmlFor="p-medium">Trung bình</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Low" id="p-low" />
                                        <Label htmlFor="p-low">Thấp</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="points">Điểm thưởng tối thiểu: {filters.points[0]}</Label>
                                <Slider
                                    id="points"
                                    min={0}
                                    max={500}
                                    step={50}
                                    value={filters.points}
                                    onValueChange={(value) => setFilters(f => ({ ...f, points: value }))}
                                />
                            </div>
                        </div>
                        <SheetFooter>
                             <Button variant="ghost" onClick={handleClearFilters}>Xóa bộ lọc</Button>
                            <SheetClose asChild>
                                <Button>Áp dụng</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Đang chờ ({pendingTasks.length})</TabsTrigger>
                    <TabsTrigger value="overdue">Quá hạn ({overdueTasks.length})</TabsTrigger>
                    <TabsTrigger value="completed">Hoàn thành ({completedTasks.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    {pendingTasks.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                            {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
                        </div>
                    ) : (
                        <EmptyState title="Không có tác vụ nào" description="Bạn đã hoàn thành hết các công việc được giao. Làm tốt lắm!" />
                    )}
                </TabsContent>
                <TabsContent value="overdue">
                    {overdueTasks.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                            {overdueTasks.map(task => <TaskCard key={task.id} task={task} />)}
                        </div>
                    ) : (
                        <EmptyState title="Không có tác vụ quá hạn" description="Tất cả các công việc của bạn đều đang trong thời hạn." />
                    )}
                </TabsContent>
                <TabsContent value="completed">
                    {completedTasks.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
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
