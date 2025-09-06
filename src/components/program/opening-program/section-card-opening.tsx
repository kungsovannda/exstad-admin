  "use client"

  import { Label, LabelList, Pie, PieChart } from "recharts"

  import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

  // Donut-style StatCard
  interface StatCardProps {
    description: string
    value: number
    color?: string
  }

  function DonutStatCard({ description, value, color = "var(--chart-1)" }: StatCardProps) {
    const chartData = [
      { name: description, value, fill: color },
      { name: "Remaining", value:  value- value, fill: "var(--muted-background)" },
    ]


const footerTextMap: Record<string, string> = {
  "Total Opening Program": "All opening programs in the system",
  "Closed Opening Program": "Programs that are closed",
  "Short Courses": "All short courses ",
  "Scholarship Courses": "Eligible for scholarships",
};
    const chartConfig = {
      [description.toLowerCase().replace(/\s/g, "_")]: { label: description, color },
    } satisfies ChartConfig
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
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan className="fill-foreground text-xl font-bold">{value}</tspan>
                        </text>
                      )
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
    )
  }
  // Section with 4 donut stat cards + existing LevelPieCard
  export function SectionCardsOpening() {
    const stats = [
      { description: "Total Opening Program", value: 19, color: "var(--chart-1)" },
      { description: "Closed Opening Program", value: 7, color: "var(--chart-2)" },
      { description: "Short Courses", value: 17, color: "var(--chart-3)" },
      { description: "Scholarship Courses", value: 1, color: "var(--chart-4)" },
    ]
    return (
      <div className="grid grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
        {stats.map((stat, i) => (
          <DonutStatCard key={i} {...stat} />
        ))}
      </div>
    )
  }
