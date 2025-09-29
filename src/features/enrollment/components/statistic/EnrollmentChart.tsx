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
import { LabelList, Pie, PieChart } from "recharts";

const chartData = [
  { level: "First Year", count: 14, fill: "var(--chart-1)" },
  { level: "Second Year", count: 10, fill: "var(--chart-2)" },
  { level: "Third Year", count: 12, fill: "var(--chart-3)" },
  { level: "Fourth Year", count: 9, fill: "var(--chart-4)" },
  { level: "Others", count: 6, fill: "var(--chart-5)" },
];

const chartConfig = {
  firstYear: {
    label: "First Year",
    color: "var(--chart-1)",
  },
  secondYear: {
    label: "Second Year",
    color: "var(--chart-2)",
  },
  thirdYear: {
    label: "Third Year",
    color: "var(--chart-3)",
  },
  fourthYear: {
    label: "Fourth Year",
    color: "var(--chart-4)",
  },
  others: {
    label: "Others",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

function QualificationLevelPieCard() {
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

const chartDataGrade = [
  { level: "Grade A", count: 7, fill: "var(--chart-1)" },
  { level: "Grade B", count: 12, fill: "var(--chart-2)" },
  { level: "Grade C", count: 15, fill: "var(--chart-3)" },
  { level: "Grade D", count: 9, fill: "var(--chart-4)" },
  { level: "Grade E", count: 5, fill: "var(--chart-5)" },
  { level: "Grade F", count: 3, fill: "var(--chart-6)" },
  { level: "Others", count: 2, fill: "var(--chart-7)" },
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
} satisfies ChartConfig;

function GradePieCard() {
  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Enrollments by BacII Grade</CardTitle>
        <CardDescription>
          Distribution of scholars based on BacII results
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer
          config={chartConfigGrade}
          className="mx-auto h-fit w-full"
        >
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
              data={chartDataGrade}
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
        {chartDataGrade.map((item, index) => (
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

export default function EnrollmentChart() {
  return (
    <div className="grid grid-cols-2 gap-5 h-fit">
      <QualificationLevelPieCard />
      <GradePieCard />
    </div>
  );
}
