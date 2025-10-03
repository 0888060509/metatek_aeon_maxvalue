
'use client';

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
    Calendar as CalendarIcon,
} from "lucide-react";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { RegionPerformanceChart } from "@/components/dashboard/region-performance-chart";


export default function DashboardPage() {
  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,021</div>
            <p className="text-xs text-muted-foreground">Tỷ lệ hoàn thành 82%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vấn đề được báo cáo</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57</div>
            <p className="text-xs text-muted-foreground">+12 so với tuần trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công việc quá hạn</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">5 việc mới quá hạn trong tuần</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Xu hướng hoàn thành công việc</CardTitle>
            <CardDescription>Tỷ lệ hoàn thành công việc hàng tháng.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <PerformanceChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Hiệu suất theo Khu vực</CardTitle>
                <CardDescription>So sánh tỷ lệ hoàn thành giữa các khu vực.</CardDescription>
            </CardHeader>
            <CardContent>
                <RegionPerformanceChart />
            </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle>Công việc gần đây</CardTitle>
            <CardDescription>Danh sách các công việc được giao hoặc cập nhật gần đây.</CardDescription>
          </CardHeader>
          <CardContent>
            <TasksOverview />
          </CardContent>
        </Card>
    </div>
  );
}
