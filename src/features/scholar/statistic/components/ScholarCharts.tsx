import React, { useEffect, useState } from "react";
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
import {
  Bar,
  BarChart,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useGetAllScholarsQuery } from "@/features/scholar/scholarApi";
import { Gender } from "@/types/scholar";

const chartData = [
  { level: "Pre-University", count: 15, fill: "var(--chart-1)" },
  { level: "Foundation", count: 8, fill: "var(--chart-2)" },
  {
    level: "Full Stack Web Development",
    count: 12,
    fill: "var(--chart-3)",
  },
  { level: "IT Expert", count: 6, fill: "var(--chart-4)" },
  { level: "IT Professional", count: 9, fill: "var(--chart-5)" },
];

const chartConfig = {
  preUniversity: {
    label: "Pre-University",
    color: "var(--chart-1)",
  },
  foundation: {
    label: "Foundation",
    color: "var(--chart-2)",
  },
  fullStack: {
    label: "Full Stack Web Development",
    color: "var(--chart-3)",
  },
  itExpert: {
    label: "IT Expert",
    color: "var(--chart-4)",
  },
  itProfessional: {
    label: "IT Professional",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

function LevelPieCard() {
  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Scholars by Program</CardTitle>
        <CardDescription>
          Pie chart of total scholars in each program
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

type GenderChartData = { gender: string; count: number; fill: string };

// const chartDataGender = [
//   { gender: "Female", count: 6420, fill: "var(--chart-1)" },
//   { gender: "Male", count: 5890, fill: "var(--chart-2)" },
//   { gender: "Others", count: 537, fill: "var(--chart-3)" },
// ];

const chartConfigGender = {
  count: {
    label: "Count",
  },
  female: {
    label: "Female",
    color: "var(--chart-1)",
  },
  male: {
    label: "Male",
    color: "var(--chart-2)",
  },
  others: {
    label: "Others",
    color: "var(--chart-3)",
  },
};

export function GenderDemographicsCard({
  chartDataGender,
}: {
  chartDataGender: GenderChartData[];
}) {
  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Scholar Gender Distribution</CardTitle>
        <CardDescription>
          Visual representation of scholars by gender
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer
          config={chartConfigGender}
          className="mx-auto h-fit  w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartDataGender}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="gender"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="count"
                    hideLabel
                    className="rounded-md border bg-background p-2 shadow-md"
                  />
                }
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} strokeWidth={0} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-[var(--chart-1)]"></div>
          <span className="text-xs">Female</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-[var(--chart-2)]"></div>
          <span className="text-xs">Male</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-[var(--chart-3)]"></div>
          <span className="text-xs">Others</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 border-l border-border pl-4 ml-2 text-xs font-medium">
            Total: {chartDataGender!.reduce((sum, item) => sum + item.count, 0)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function ScholarCharts() {
  const { data: scholars } = useGetAllScholarsQuery();
  const [genderDataChart, setGenderDataChart] = useState<GenderChartData[]>([]);
  useEffect(() => {
    const totalFemale = Array.isArray(scholars)
      ? scholars.filter((s) => s.gender === Gender.FEMALE)
      : [];
    const totalMale = Array.isArray(scholars)
      ? scholars.filter((s) => s.gender === Gender.MALE)
      : [];
    const totalOther = Array.isArray(scholars)
      ? scholars.length - totalFemale.length - totalMale.length
      : 0;

    setGenderDataChart([
      { gender: "Female", count: totalFemale.length, fill: "var(--chart-1)" },
      { gender: "Male", count: totalMale.length, fill: "var(--chart-2)" },
      { gender: "Other", count: totalOther, fill: "var(--chart-3)" },
    ]);
  }, [scholars]);

  return (
    <div className="grid grid-cols-2 gap-5 h-fit">
      <LevelPieCard />
      <GenderDemographicsCard chartDataGender={genderDataChart!} />
    </div>
  );
}
