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
import { Enrollment } from "@/types/enrollment";
import React from "react";
import { LabelList, Pie, PieChart } from "recharts";

type ChartDataItem = {
  level: string;
  count: number;
  fill: string;
};

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
];

function QualificationLevelPieCard({
  chartData,
}: {
  chartData: ChartDataItem[];
}) {
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      const key = item.level.toLowerCase().replace(/\s+/g, "");
      config[key] = {
        label: item.level,
        color: chartColors[index % chartColors.length],
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Enrollment by Qualification</CardTitle>
        <CardDescription>
          Distribution of scholars across qualification levels
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer config={chartConfig} className="mx-auto h-fit w-full">
          <PieChart>
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
      <CardFooter className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
        <span className="text-xs font-medium">
          Total: {chartData.reduce((sum, item) => sum + item.count, 0)}
        </span>
      </CardFooter>
    </Card>
  );
}

function ShiftPieCard({ chartData }: { chartData: ChartDataItem[] }) {
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      const key = item.level.toLowerCase().replace(/\s+/g, "");
      config[key] = {
        label: item.level,
        color: chartColors[index % chartColors.length],
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Enrollments by Class Shift</CardTitle>
        <CardDescription>
          Distribution of scholars based on class shifts
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer config={chartConfig} className="mx-auto h-fit w-full">
          <PieChart>
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
                offset={20}
                style={{
                  dominantBaseline: "central",
                  paintOrder: "stroke",
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            ></div>
            <span className="text-xs">{item.level}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}

export default function EnrollmentChart({ data }: { data: Enrollment[] }) {
  const qualificationChartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const qualificationCounts: Record<string, number> = {};

    data.forEach((enrollment: Enrollment) => {
      const qualification = enrollment.educationQualification?.trim();
      if (qualification) {
        qualificationCounts[qualification] =
          (qualificationCounts[qualification] || 0) + 1;
      }
    });

    return Object.entries(qualificationCounts)
      .map(([level, count], index) => ({
        level,
        count,
        fill: chartColors[index % chartColors.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  // Process class shift data
  const shiftChartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const shiftCounts: Record<string, number> = {};

    data.forEach((enrollment: Enrollment) => {
      const shift = enrollment._class?.shift?.trim();
      if (shift) {
        shiftCounts[shift] = (shiftCounts[shift] || 0) + 1;
      }
    });

    return Object.entries(shiftCounts)
      .map(([level, count], index) => ({
        level,
        count,
        fill: chartColors[index % chartColors.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="grid grid-cols-2 gap-5 h-full">
      <QualificationLevelPieCard chartData={qualificationChartData} />
      <ShiftPieCard chartData={shiftChartData} />
    </div>
  );
}
