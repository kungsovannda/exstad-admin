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
import { useGetAllScholarsQuery } from "@/features/scholar/scholarApi";
import { Gender } from "@/types/scholar";
import { useEffect, useState } from "react";
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

const chartConfig = {
  scholars: {
    label: "Scholars",
  },
} satisfies ChartConfig;

type StatusChartData = {
  status: string;
  count: number;
  fill: string;
};

function LevelPieCard({ chartData }: { chartData: StatusChartData[] }) {
  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Scholars by Status</CardTitle>
        <CardDescription>
          Pie chart of total scholars in each status
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
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={40}
              paddingAngle={2}
              strokeWidth={2}
            >
              <LabelList
                dataKey="status"
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
  const [statusDataChart, setStatusDataChart] = useState<StatusChartData[]>([]);

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

    if (Array.isArray(scholars)) {
      const colors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
      ];

      // Group scholars by status and count them
      const statusCounts = scholars.reduce((acc, scholar) => {
        const status = scholar.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array format for the chart
      const statusData = Object.entries(statusCounts).map(
        ([status, count], index) => ({
          status,
          count,
          fill: colors[index % colors.length],
        })
      );

      setStatusDataChart(statusData);
    }
  }, [scholars]);

  return (
    <div className="grid grid-cols-2 gap-5 h-fit">
      <LevelPieCard chartData={statusDataChart} />
      <GenderDemographicsCard chartDataGender={genderDataChart!} />
    </div>
  );
}
