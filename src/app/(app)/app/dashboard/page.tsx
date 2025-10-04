'use client';

import * as React from 'react';
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
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { useGetDashboardStatistics } from "@/api/app/hooks";

export default function DashboardPage() {
  const { data: dashboardData, loading, error, execute } = useGetDashboardStatistics();

  React.useEffect(() => {
    execute({
      recentTasksLimit: 10,
      performanceMonthsLimit: 6
    });
  }, []);

  const taskStats = dashboardData?.taskStatistics;

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Alert variant="destructive">
          <AlertDescription>
            Không thể tải dữ liệu dashboard: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhiệm vụ</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats?.totalTasks?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats?.totalTasksChangeDescription || 'Không có dữ liệu'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats?.completedTasks?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats?.completionRateDescription || `${Math.round(taskStats?.completionRate || 0)}% tỷ lệ hoàn thành`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vấn đề báo cáo</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats?.issuesReported || 0}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats?.issuesChangeDescription || 'Không có thay đổi'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats?.overdueTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats?.overdueTasksDescription || 'Không có dữ liệu'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Hiệu suất theo tháng</CardTitle>
            <CardDescription>Tỷ lệ hoàn thành nhiệm vụ hàng tháng.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <PerformanceChart data={dashboardData?.monthlyPerformance} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Nhiệm vụ gần đây</CardTitle>
            <CardDescription>Danh sách nhiệm vụ được cập nhật gần đây.</CardDescription>
          </CardHeader>
          <CardContent>
            <TasksOverview data={dashboardData?.recentTasks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
