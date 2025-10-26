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
import { Pie, PieChart, LabelList } from "recharts";

interface LevelPieCardProps {
  levelCounts: {
    basic: number;
    intermediate: number;
    advanced: number;
  };
}
 
export default function LevelPieCard({ levelCounts }: LevelPieCardProps) {
  const chartData = [
    { level: "Beginner", count: levelCounts.basic, fill: "var(--chart-1)" },
    { level: "Intermediate", count: levelCounts.intermediate, fill: "var(--chart-2)" },
    { level: "Advanced", count: levelCounts.advanced, fill: "var(--chart-3)" },
  ];

  const chartConfig = {
    beginner: { label: "Beginner", color: "var(--chart-1)" },
    intermediate: { label: "Intermediate", color: "var(--chart-2)" },
    advanced: { label: "Advanced", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Program Levels</CardTitle>
        <CardDescription>Pie chart of programs by level</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <ChartContainer config={chartConfig} className="mx-auto h-fit w-full">
          <PieChart width={320} height={320}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="count"
                  hideLabel
                  className="rounded-md border bg-background p-2 shadow-md"
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="level"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={40}
              paddingAngle={2}
              strokeWidth={2}
            >
              <LabelList
                dataKey="level"
                className="text-primary"
                fontSize={12}
                position="outside"
                fill="var(--primary)"
                strokeWidth={0}
                offset={10}
                style={{
                  dominantBaseline: "central",
                  paintOrder: "stroke",
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
        <span className="text-xs font-medium">
          Total: {chartData.reduce((sum, item) => sum + item.count, 0)}
        </span>
      </CardFooter>
    </Card>
  );
}
