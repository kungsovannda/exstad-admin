"use client";

import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Label, LabelList } from "recharts";

// Donut-style StatCard
interface StatCardProps {
  description: string;
  value: number;
  color?: string;
}

function DonutStatCard({ description, value, color = "var(--chart-1)" }: StatCardProps) {
  const chartData = [
    { name: description, value, fill: color },
    { name: "Remaining", value: 0, fill: "var(--muted-background)" },
  ];

  const footerTextMap: Record<string, string> = {
    "Total Program": "All programs in the system",
    "Draft Program": "Programs in draft",
    "Short Courses": "All short courses",
    "Scholarship Courses": "Eligible for scholarships",
  };

  const chartConfig = {
    [description.toLowerCase().replace(/\s/g, "_")]: { label: description, color },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col rounded-2xl shadow-sm">
      <CardHeader className="pb-0">
        <CardDescription className="text-[18px] font-semibold">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[150px]">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan className="fill-foreground text-xl font-bold">{value}</tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">{footerTextMap[description]}</CardFooter>
    </Card>
  );
}

// LevelPieCard
function LevelPieCard({ levelCounts }: { levelCounts: Record<string, number> }) {
  const chartData = [
    { level: "Beginner", count: levelCounts.basic, fill: "var(--color-beginner)" },
    { level: "Intermediate", count: levelCounts.intermediate, fill: "var(--color-intermediate)" },
    { level: "Advanced", count: levelCounts.advanced, fill: "var(--color-advanced)" },
  ];

  const chartConfig = {
    beginner: { label: "Beginner", color: "var(--chart-1)" },
    intermediate: { label: "Intermediate", color: "var(--chart-2)" },
    advanced: { label: "Advanced", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col rounded-2xl shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardDescription className="text-[20px] font-semibold tabular-nums @[250px]/card:text-3xl">
          Program Levels
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[150px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="level">
              <LabelList dataKey="level" className="fill-background" stroke="none" fontSize={10} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">All program levels</CardFooter>
    </Card>
  );
}

// Main SectionCards component
export function SectionCards() {
  const { data: masterPrograms = [], isLoading } = useGetAllMasterProgramsQuery();

  if (isLoading) return <div>Loading...</div>;

  // Compute stats dynamically
  const totalProgram = masterPrograms.length;
  const draftProgram = masterPrograms.filter((p) => p.status === "draft").length;
  const shortCourses = masterPrograms.filter((p) => p.programType === "SHORT_COURSE").length;
  const scholarshipCourses = masterPrograms.filter((p) => p.programType === "SCHOLARSHIP").length;

  const stats = [
    { description: "Total Program", value: totalProgram, color: "var(--chart-1)" },
    { description: "Draft Program", value: draftProgram, color: "var(--chart-2)" },
    { description: "Short Courses", value: shortCourses, color: "var(--chart-3)" },
    { description: "Scholarship Courses", value: scholarshipCourses, color: "var(--chart-4)" },
  ];

  // Compute level counts dynamically
  const levelCounts = masterPrograms.reduce(
    (acc, program) => {
      const level = program.programLevel?.toLowerCase();
      if (level === "basic") acc.basic += 1;
      else if (level === "intermediate") acc.intermediate += 1;
      else if (level === "advanced") acc.advanced += 1;
      return acc;
    },
    { basic: 0, intermediate: 0, advanced: 0 }
  );

  return (
    <div className="grid grid-cols-5 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      {stats.map((stat, i) => (
        <DonutStatCard key={i} {...stat} />
      ))}
      <LevelPieCard levelCounts={levelCounts} />
    </div>
  );
}
