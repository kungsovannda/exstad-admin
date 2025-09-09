"use client";

import { Label, LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Donut-style StatCard
interface StatCardProps {
  description: string;
  value: number;
  color?: string;
}

function DonutStatCard({
  description,
  value,
  color = "var(--chart-1)",
}: StatCardProps) {
  const chartData = [
    { name: description, value, fill: color },
    {
      name: "Remaining",
      value: value - value,
      fill: "var(--muted-background)",
    },
  ];

  const footerTextMap: Record<string, string> = {
    "Total Scholar": "All programs in the system",
    "Active Scholar": "Programs in draft",
    Graduated: "All short courses ",
    Dropped: "Eligible for scholarships",
  };

  const chartConfig = {
    [description.toLowerCase().replace(/\s/g, "_")]: {
      label: description,
      color,
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="pb-0">
        <CardDescription className="text-[18px] font-semibold">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[150px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan className="fill-foreground text-xl font-bold">
                          {value}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {footerTextMap[description]}
      </CardFooter>
    </Card>
  );
}

const chartData = [
  { level: "Beginner", count: 10, fill: "var(--color-beginner)" },
  { level: "Intermediate", count: 6, fill: "var(--color-intermediate)" },
  { level: "Advanced", count: 3, fill: "var(--color-advanced)" },
];

const chartConfig = {
  beginner: {
    label: "Beginner",
    color: "var(--chart-1)",
  },
  intermediate: {
    label: "Intermediate",
    color: "var(--chart-2)",
  },
  advanced: {
    label: "Advanced",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function LevelPieCard() {
  return (
    <Card className="flex flex-col rounded-lg h shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardDescription className="text-[20px] font-semibold tabular-nums @[250px]/card:text-3xl">
          Program Levels
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[150px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={chartData} dataKey="count" nameKey="level">
              <LabelList
                dataKey="level"
                className="fill-background"
                stroke="none"
                fontSize={10}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        All program level
      </CardFooter>
    </Card>
  );
}

export function StatisticCard() {
  const stats = [
    { description: "Total Scholar", value: 19, color: "var(--primary)" },
    {
      description: "Active Scholar",
      value: 1,
      color: "var(--primary)",
    },
    { description: "Graduated", value: 17, color: "var(--primary)" },
    { description: "Dropped", value: 1, color: "var(--primary)" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      {stats.map((stat, i) => (
        <DonutStatCard key={i} {...stat} />
      ))}
      {/* Keep LevelPieCard exactly the same */}
      <LevelPieCard />
    </div>
  );
}
