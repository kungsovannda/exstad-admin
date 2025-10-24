import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Enrollment } from "@/types/enrollment";
import React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
];

export default function OverviewEnrollmentByUniversity({
  data,
}: {
  data: Enrollment[];
}) {
  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const universityCounts: Record<string, number> = {};

    data.forEach((enrollment: Enrollment) => {
      const university = enrollment.university?.trim();
      if (university) {
        universityCounts[university] = (universityCounts[university] || 0) + 1;
      }
    });

    return Object.entries(universityCounts)
      .map(([university, count], index) => ({
        university,
        count,
        fill: chartColors[index % chartColors.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      const key = item.university.toLowerCase().replace(/\s+/g, "");
      config[key] = {
        label: item.university,
        color: chartColors[index % chartColors.length],
      };
    });
    return config;
  }, [chartData]);

  const totalEnrollments = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex h-full flex-col rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>Enrollment by University</CardTitle>
        <CardDescription>
          Distribution of {totalEnrollments} scholars across {chartData.length}{" "}
          universities
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
          >
            <XAxis type="number" />
            <YAxis
              dataKey="university"
              type="category"
              width={150}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="rounded-md border bg-background p-2 shadow-md"
                  labelFormatter={(value) => `University: ${value}`}
                />
              }
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="var(--chart-1)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
