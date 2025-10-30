"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface ProgramBarCardProps {
  data: { name: string; count: number; fill?: string }[];
}

export default function ProgramBarCard({ data }: ProgramBarCardProps) {
  // Filter out programs with 0 openings
  const filteredData = data.filter((d) => d.count > 0);

  // Assign colors (use CSS variables or customize)
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
  const chartData = filteredData.map((d, i) => ({
    name: d.name,
    count: d.count,
    fill: d.fill ?? colors[i % colors.length],
  }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill! };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Opening Programs</CardTitle>
        <CardDescription>Bar chart by Master Progr  am</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <ChartContainer config={chartConfig} className="mx-auto  w-full h-80">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="count"
                    hideLabel
                    className="rounded-md border bg-background p-2 shadow-md"
                  />
                }
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} strokeWidth={0}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            ></div>
            <span className="text-xs">{item.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 border-l border-border pl-4 ml-2 text-xs font-medium">
            Total: {chartData.reduce((sum, item) => sum + item.count, 0)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
