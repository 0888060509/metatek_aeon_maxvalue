
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Activity,
    CheckCircle2,
    AlertCircle,
    Clock,
    ChevronLeft,
} from "lucide-react";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Link from "next/link";
import { Skeleton } from '@/components/ui/skeleton';

const regionNames: { [key: string]: string } = {
    north: 'Miền Bắc',
    central: 'Miền Trung',
    south: 'Miền Nam',
    west: 'Miền Tây'
};

export default function RegionDashboardPage({ params }: { params: { region: string } }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-64" />
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="lg:col-span-4 h-80" />
                <Skeleton className="lg:col-span-3 h-80" />
            </div>
        </div>
    );
  }

  const regionName = regionNames[params.region] || params.region;

  // In a real app, you would fetch data specific to this region
  // For now, we'll use mock data as an example.
  const regionData = {
    totalTasks: 310,
    completed: 295,
    issues: 15,
    overdue: 4,
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <Link href="/app/dashboard">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back to main dashboard</span>
                    </Link>
                </Button>
                 <h1 className="text-3xl font-bold tracking-tight">Dashboard: {regionName}</h1>
            </div>
            <div className="flex items-center gap-2">
                <DateRangePicker />
                <Button>Lọc</Button>
            </div>
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số công việc</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regionData.totalTasks}</div>
            <p className="text-xs text-muted-foreground">+18.2% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regionData.completed}</div>
            <p className="text-xs text-muted-foreground">Tỷ lệ hoàn thành 95%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vấn đề được báo cáo</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regionData.issues}</div>
            <p className="text-xs text-muted-foreground">+3 so với tuần trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công việc quá hạn</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regionData.overdue}</div>
            <p className="text-xs text-muted-foreground">1 việc mới quá hạn trong tuần</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Xu hướng hoàn thành công việc</CardTitle>
            <CardDescription>Tỷ lệ hoàn thành công việc hàng tháng trong khu vực.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <PerformanceChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Công việc gần đây</CardTitle>
            <CardDescription>Danh sách các công việc được giao hoặc cập nhật gần đây.</CardDescription>
          </CardHeader>
          <CardContent>
            <TasksOverview />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
