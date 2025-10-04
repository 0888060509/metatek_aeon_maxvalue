"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import type { MonthlyPerformanceItem } from "@/api/app/types";

interface PerformanceChartProps {
  data?: MonthlyPerformanceItem[] | null;
}

const defaultChartData = [
  { month: "January", completedTasks: 186, pendingTasks: 80 },
  { month: "February", completedTasks: 305, pendingTasks: 200 },
  { month: "March", completedTasks: 237, pendingTasks: 120 },
  { month: "April", completedTasks: 273, pendingTasks: 190 },
  { month: "May", completedTasks: 209, pendingTasks: 130 },
  { month: "June", completedTasks: 214, pendingTasks: 140 },
];

const chartConfig = {
  completedTasks: {
    label: "Hoàn thành",
    color: "hsl(var(--primary))",
  },
  pendingTasks: {
    label: "Đang chờ",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data && data.length > 0 ? data : defaultChartData;
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="completedTasks" fill="var(--color-completedTasks)" radius={4} />
          <Bar dataKey="pendingTasks" fill="var(--color-pendingTasks)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
