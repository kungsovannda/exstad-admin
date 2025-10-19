import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Enrollment } from "@/types/enrollment";
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type GradeChartData = { level: string; count: number; fill: string };

const chartDataGrade: GradeChartData[] = [
  { level: "Grade A", count: 0, fill: "var(--chart-1)" },
  { level: "Grade B", count: 0, fill: "var(--chart-2)" },
  { level: "Grade C", count: 0, fill: "var(--chart-3)" },
  { level: "Grade D", count: 0, fill: "var(--chart-4)" },
  { level: "Grade E", count: 0, fill: "var(--chart-5)" },
  { level: "Grade F", count: 0, fill: "var(--chart-6)" },
  { level: "Others", count: 0, fill: "var(--chart-7)" },
];

const chartConfigGrade = {
  gradeA: {
    label: "Grade A",
    color: "var(--chart-1)",
  },
  gradeB: {
    label: "Grade B",
    color: "var(--chart-2)",
  },
  gradeC: {
    label: "Grade C",
    color: "var(--chart-3)",
  },
  gradeD: {
    label: "Grade D",
    color: "var(--chart-4)",
  },
  gradeE: {
    label: "Grade E",
    color: "var(--chart-5)",
  },
  gradeF: {
    label: "Grade F",
    color: "var(--chart-6)",
  },
  others: {
    label: "Others",
    color: "var(--chart-7)",
  },
};

export function EnrollmentGradeCard({
  chartDataGrade,
}: {
  chartDataGrade: GradeChartData[];
}) {
  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Enrollment Grade Distribution</CardTitle>
        <CardDescription>
          Visual representation of students by grade level
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer
          config={chartConfigGrade}
          className="mx-auto w-full h-96"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartDataGrade}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="level"
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
      <CardFooter className="flex items-center justify-center flex-wrap gap-3 text-sm text-muted-foreground pt-2">
        {chartDataGrade.map((grade, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: grade.fill }}
            ></div>
            <span className="text-xs">
              {grade.level.replace("Grade ", "")}: {grade.count}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1 border-l border-border pl-3 ml-1">
          <span className="text-xs font-medium">
            Total: {chartDataGrade.reduce((sum, item) => sum + item.count, 0)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function EnrollmentGradeChart({ data }: { data: Enrollment[] }) {
  const processedChartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return chartDataGrade;
    }

    const gradeCounts: Record<string, number> = {
      "Grade A": 0,
      "Grade B": 0,
      "Grade C": 0,
      "Grade D": 0,
      "Grade E": 0,
      "Grade F": 0,
      Others: 0,
    };

    data.forEach((enrollment) => {
      const grade = enrollment.extra.grade;

      if (grade && typeof grade === "string") {
        const normalizedGrade = grade.trim().toUpperCase();

        if (normalizedGrade.includes("A") || normalizedGrade === "A") {
          gradeCounts["Grade A"]++;
        } else if (normalizedGrade.includes("B") || normalizedGrade === "B") {
          gradeCounts["Grade B"]++;
        } else if (normalizedGrade.includes("C") || normalizedGrade === "C") {
          gradeCounts["Grade C"]++;
        } else if (normalizedGrade.includes("D") || normalizedGrade === "D") {
          gradeCounts["Grade D"]++;
        } else if (normalizedGrade.includes("E") || normalizedGrade === "E") {
          gradeCounts["Grade E"]++;
        } else if (normalizedGrade.includes("F") || normalizedGrade === "F") {
          gradeCounts["Grade F"]++;
        } else {
          gradeCounts["Others"]++;
        }
      }
    });

    return [
      {
        level: "Grade A",
        count: gradeCounts["Grade A"],
        fill: "var(--chart-1)",
      },
      {
        level: "Grade B",
        count: gradeCounts["Grade B"],
        fill: "var(--chart-2)",
      },
      {
        level: "Grade C",
        count: gradeCounts["Grade C"],
        fill: "var(--chart-3)",
      },
      {
        level: "Grade D",
        count: gradeCounts["Grade D"],
        fill: "var(--chart-4)",
      },
      {
        level: "Grade E",
        count: gradeCounts["Grade E"],
        fill: "var(--chart-5)",
      },
      {
        level: "Grade F",
        count: gradeCounts["Grade F"],
        fill: "var(--chart-6)",
      },
      { level: "Others", count: gradeCounts["Others"], fill: "var(--chart-7)" },
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-5 h-fit">
      <EnrollmentGradeCard chartDataGrade={processedChartData} />
    </div>
  );
}
