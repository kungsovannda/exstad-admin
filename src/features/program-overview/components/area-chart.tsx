
"use client";

import * as React from "react";
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
import { Loader2 } from "lucide-react";

import { useGetAllClassesQuery } from "@/features/opening-program/components/class/classApi";
import { useGetAllScholarClassesQuery } from "@/features/opening-program/components/scholar-class.tsx/scholarClassApi";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";

export function ChartBarComparison() {
  const { data: openingPrograms = [], isLoading: loadingPrograms } = useGetAllOpeningProgramsQuery();
  const { data: classes = [], isLoading: loadingClasses } = useGetAllClassesQuery();
  const { data: scholarClasses = [], isLoading: loadingScholars } = useGetAllScholarClassesQuery();

  // Dynamic chart colors
  const colors = [
  "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  // Map class UUID → program UUID
  const classToProgramUuid = React.useMemo(() => {
    const map = new Map<string, string>();
    classes.forEach((cls) => {
      const openingProgramName = cls.openingProgramName?.trim().toLowerCase();
      const program = openingPrograms.find(
        (op) =>
          (op.programName?.trim().toLowerCase() === openingProgramName) ||
          (op.title?.trim().toLowerCase() === openingProgramName)
      );
      if (program) map.set(cls.uuid, program.uuid);
    });
    return map;
  }, [classes, openingPrograms]);

  // Count scholars per program
  const programTotals = React.useMemo(() => {
    const totals: Record<string, number> = {};
    openingPrograms.forEach((p) => (totals[p.uuid] = 0));

    scholarClasses.forEach((sc) => {
      const programUuid = classToProgramUuid.get(sc.classUuid);
      if (programUuid && totals[programUuid] !== undefined) {
        totals[programUuid] += 1;
      }
    });

    return openingPrograms.map((program, i) => ({
      name: program.programName || program.title,
      count: totals[program.uuid] || 0,
      fill: colors[i % colors.length],
    }));
  }, [scholarClasses, classToProgramUuid, openingPrograms]);



  // Filter & prepare chart data
  const filteredData = programTotals.filter((d) => d.count > 0);
  const chartData = filteredData.map((d, i) => ({
    name: d.name,
    count: d.count,
    fill: d.fill ?? colors[i % colors.length],
  }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill! };
    return acc;
  }, {} as ChartConfig);

  // ✅ Updated modern UI (ProgramBarCard style)
  return (
    <Card className="flex flex-col rounded-lg shadow-sm ">
      <CardHeader className="items-center pb-2">
        <CardTitle>Scholars by Opening Program</CardTitle>
        <CardDescription>Compare total scholar enrollment</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <ChartContainer config={chartConfig} className="mx-auto h-80 w-full">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
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
              <Bar dataKey="count" radius={[4, 4, 0, 0]} strokeWidth={0}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2 flex-wrap">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            ></div>
            <span className="text-xs">{item.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 border-l border-border pl-4 ml-2 text-xs font-medium">
          Total: {chartData.reduce((sum, item) => sum + item.count, 0)}
        </div>
      </CardFooter>
    </Card>
  );
}
