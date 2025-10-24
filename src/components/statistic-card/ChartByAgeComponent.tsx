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
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const ageRanges = [
  { min: 13, max: 15, label: "13-15" },
  { min: 16, max: 17, label: "16-17" },
  { min: 18, max: 24, label: "18-24" },
  { min: 25, max: 34, label: "25-34" },
  { min: 35, max: 44, label: "35-44" },
  { min: 45, max: 54, label: "45-54" },
  { min: 55, max: 100, label: "55+" },
];

function calculateAge(dob: string): number | null {
  if (!dob) return null;

  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function AgeDistributionChart({
  data,
  title,
}: {
  data: { dob: string }[];
  title: string;
}) {
  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const rangeCounts: Record<string, number> = {};
    ageRanges.forEach((range) => {
      rangeCounts[range.label] = 0;
    });

    data.forEach((d) => {
      const age = calculateAge(d.dob);
      if (age !== null && age >= 0) {
        const range = ageRanges.find((r) => age >= r.min && age <= r.max);
        if (range) {
          rangeCounts[range.label]++;
        }
      }
    });

    return ageRanges.map((range, index) => ({
      range: range.label,
      count: rangeCounts[range.label],
      fill: `var(--chart-${(index % 7) + 1})`,
    }));
  }, [data]);

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      config[item.range] = {
        label: item.range,
        color: `var(--chart-${(index % 7) + 1})`,
      };
    });
    return config;
  }, [chartData]);

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>{title} by Age Group</CardTitle>
        <CardDescription>
          Distribution of {total} scholars across age ranges
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            data={chartData}
            margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="range"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="rounded-md border bg-background p-2 shadow-md"
                  labelFormatter={(value) => `Age: ${value}`}
                />
              }
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="var(--chart-1)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
