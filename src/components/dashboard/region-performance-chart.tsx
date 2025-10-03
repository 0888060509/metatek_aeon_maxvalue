
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useRouter } from 'next/navigation';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"


const chartData = [
  { region: "Miền Bắc", completionRate: 92, link: "/app/dashboard/north" },
  { region: "Miền Trung", completionRate: 85, link: "/app/dashboard/central" },
  { region: "Miền Nam", completionRate: 88, link: "/app/dashboard/south" },
  { region: "Miền Tây", completionRate: 95, link: "/app/dashboard/west" },
]

const chartConfig = {
  completionRate: {
    label: "Tỷ lệ hoàn thành",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function RegionPerformanceChart() {
  const router = useRouter();

  const handleBarClick = (data: any) => {
    if (data.link) {
      router.push(data.link);
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            left: 10,
            right: 20
          }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="region"
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            width={80}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 14 }}

          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar 
            dataKey="completionRate" 
            fill="var(--color-completionRate)" 
            radius={5}
            layout="vertical"
            label={{ position: 'right', fill: 'hsl(var(--foreground))', fontSize: 12, formatter: (value: number) => `${value}%` }}
            onClick={handleBarClick}
            style={{ cursor: 'pointer' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
