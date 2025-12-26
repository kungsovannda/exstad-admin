"use client";

import { useEffect, useState } from "react";
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
import { MasterProgramType } from "@/types/program";

interface MasterStatisticCardProps {
  MasterProgram: MasterProgramType[];
  isLoading?: boolean;
}

interface State {
  total: number;
}

export function MasterProgramPieChart({
  MasterProgram,
  isLoading = false,
}: MasterStatisticCardProps) {
  const [total, setTotal] = useState<State>({ total: 0 });
  const [shortCourses, setShortCourses] = useState<State>({ total: 0 });
  const [scholarshipCourses, setScholarshipCourses] = useState<State>({
    total: 0,
  });
  const [otherPrograms, setOtherPrograms] = useState<State>({ total: 0 });

  useEffect(() => {
    if (MasterProgram && Array.isArray(MasterProgram)) {
      const totalMasterProgram = getState(MasterProgram);
      const shortCoursesPrograms = MasterProgram.filter(
        (mp) => mp.programType === "SHORT_COURSE" && mp.visibility !== "PRIVATE"
      );
      const scholarshipPrograms = MasterProgram.filter(
        (mp) => mp.programType === "SCHOLARSHIP" && mp.visibility !== "PRIVATE"
      );

      const other = MasterProgram.filter(
        (mp) =>
          mp.visibility !== "PRIVATE" &&
          mp.programType !== "SHORT_COURSE" &&
          mp.programType !== "SCHOLARSHIP"
      );

      setTotal(totalMasterProgram);
      setShortCourses(getState(shortCoursesPrograms));
      setScholarshipCourses(getState(scholarshipPrograms));
      setOtherPrograms(getState(other));
    }
  }, [MasterProgram]);

  // Pie chart data
  const chartData = [
    { name: "Short Courses", value: shortCourses.total, fill: "var(--chart-1)" },
    { name: "Scholarship Courses", value: scholarshipCourses.total, fill: "var(--chart-2)" },
    { name: "Other Programs", value: otherPrograms.total, fill: "var(--chart-4)" },
  ];

  const chartConfig = {
    short: { label: "Short Courses", color: "var(--chart-2)" },
    scholarship: { label: "Scholarship Courses", color: "var(--chart-3)" },
    other: { label: "Other Programs", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Master Programs</CardTitle>
        <CardDescription>Distribution of programs by type</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <ChartContainer config={chartConfig} className="mx-auto h-fit w-full">
          <PieChart width={320} height={320}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="value"
                  hideLabel
                  className="rounded-md border bg-background p-2 shadow-md"
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={40}
              paddingAngle={2}
              strokeWidth={2}
            >
              <LabelList
                dataKey="name"
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
        <span className="text-xs font-medium">Total Programs: {total.total}</span>
      </CardFooter>
    </Card>
  );
}

const getState = (data: MasterProgramType[]): State => {
  return { total: data.length };
};
