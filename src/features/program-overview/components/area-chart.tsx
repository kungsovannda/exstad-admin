// "use client";

// import * as React from "react";
// import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2 } from "lucide-react";
// import { useGetAllClassesQuery } from "@/features/opening-program/components/class/classApi";
// import { useGetAllScholarClassesQuery } from "@/features/opening-program/components/scholar-class.tsx/scholarClassApi";
// import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";

// // Dynamic colors for programs
// const COLORS = [
//   "hsl(var(--chart-1))",
//   "hsl(var(--chart-2))",
//   "hsl(var(--chart-3))",
//   "hsl(var(--chart-4))",
//   "hsl(var(--chart-5))",
// ];

// export function ChartAreaInteractive() {
//   const [timeRange, setTimeRange] = React.useState("90d");

//   const { data: openingPrograms = [], isLoading: loadingPrograms } = useGetAllOpeningProgramsQuery();
//   const { data: classes = [], isLoading: loadingClasses } = useGetAllClassesQuery();
//   const { data: scholarClasses = [], isLoading: loadingScholars } = useGetAllScholarClassesQuery();
// console.log(openingPrograms)
// console.log(classes)
// console.log(scholarClasses)
//   // Build chart config dynamically based on opening programs
//   const chartConfig = React.useMemo(() => {
//     const config: ChartConfig = {};
//     openingPrograms.forEach((program, index) => {
//       config[program.uuid] = {
//         label: program.programName || program.title,
//         color: COLORS[index % COLORS.length],
//       };
//     });
//     return config;
//   }, [openingPrograms]);

//   // Build classUuid -> programUuid map to ensure reliable mapping
//   const classToProgramUuid = React.useMemo(() => {
//     const map = new Map<string, string>();
//     classes.forEach((cls) => {
//       const openingProgramName = cls.openingProgramName?.trim().toLowerCase();
//       const program = openingPrograms.find(
//         (op) =>
//           (op.programName?.trim().toLowerCase() === openingProgramName) ||
//           (op.title?.trim().toLowerCase() === openingProgramName)
//       );
//       if (program) map.set(cls.uuid, program.uuid);
//     });
//     return map;
//   }, [classes, openingPrograms]);

//   // Build chart data: count scholars per opening program per date
//   const chartData = React.useMemo(() => {
//     if (!scholarClasses.length || !classes.length || !openingPrograms.length) return [];

//     const dataByDate: Record<string, Record<string, number>> = {};

//     scholarClasses.forEach((sc) => {
//       const dateStr = sc.scholar.audit?.createdAt || sc.audit?.createdAt || new Date().toISOString();
//       const date = new Date(dateStr).toISOString().split("T")[0];

//       const programUuid = classToProgramUuid.get(sc.classUuid);
//       if (!programUuid) {
//         console.warn(`No program UUID found for class ${sc.classUuid}`);
//         return;
//       }

//       if (!dataByDate[date]) dataByDate[date] = {};
//       dataByDate[date][programUuid] = (dataByDate[date][programUuid] || 0) + 1;
//     });

//     return Object.entries(dataByDate)
//       .map(([date, programs]) => ({
//         date,
//         ...programs,
//       }))
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//   }, [scholarClasses, classToProgramUuid]);

//   // Filter data by selected time range
//   const filteredData = React.useMemo(() => {
//     if (!chartData.length) return [];
//     const referenceDate = new Date();
//     const daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
//     const startDate = new Date(referenceDate);
//     startDate.setDate(startDate.getDate() - daysToSubtract);

//     return chartData.filter((item) => new Date(item.date) >= startDate);
//   }, [chartData, timeRange]);

//   // Calculate totals per program
//   const programTotals = React.useMemo(() => {
//     const totals: Record<string, number> = {};
//     openingPrograms.forEach((program) => {
//       totals[program.uuid] = 0;
//     });

//     filteredData.forEach((item) => {
//       Object.keys(item).forEach((key) => {
//         if (key !== "date" && totals[key] !== undefined) {
//           totals[key] += (item as Record<string, number | string>)[key] as number || 0;
//         }
//       });
//     });

//     return totals;
//   }, [filteredData, openingPrograms]);

//   if (loadingPrograms || loadingClasses || loadingScholars) {
//     return (
//       <Card className="flex items-center justify-center p-6">
//         <Loader2 className="animate-spin mr-2" />
//         <span>Loading scholar data...</span>
//       </Card>
//     );
//   }

//   return (
//     <Card className="pt-0">
//       <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
//         <div className="grid flex-1 gap-1">
//           <CardTitle>Scholars by Opening Program</CardTitle>
//           <CardDescription>
//             Scholar enrollment trends across all opening programs
//           </CardDescription>
//         </div>

//         <Select value={timeRange} onValueChange={setTimeRange}>
//           <SelectTrigger className="w-[160px] rounded-lg">
//             <SelectValue placeholder="Last 3 months" />
//           </SelectTrigger>
//           <SelectContent className="rounded-xl">
//             <SelectItem value="90d">Last 3 months</SelectItem>
//             <SelectItem value="30d">Last 30 days</SelectItem>
//             <SelectItem value="7d">Last 7 days</SelectItem>
//           </SelectContent>
//         </Select>
//       </CardHeader>

//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         {/* Program Stats Summary */}
//         <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-3 lg:grid-cols-4">
//           {openingPrograms.map((program, index) => (
//             <div key={program.uuid} className="flex items-center gap-2">
//               <div
//                 className="w-3 h-3 rounded-full"
//                 style={{ backgroundColor: COLORS[index % COLORS.length] }}
//               />
//               <div className="text-sm">
//                 <div className="font-medium">{program.programName || program.title}</div>
//                 <div className="text-muted-foreground">
//                   {programTotals[program.uuid] || 0} scholars
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
//           <AreaChart data={filteredData}>
//             <defs>
//               {openingPrograms.map((program, index) => (
//                 <linearGradient key={program.uuid} id={`fill-${program.uuid}`} x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
//                   <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1} />
//                 </linearGradient>
//               ))}
//             </defs>

//             <CartesianGrid vertical={false} strokeDasharray="3 3" />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(v) =>
//                 new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
//               }
//             />
//             <YAxis tickLine={false} axisLine={false} tickMargin={8} />
//             <ChartTooltip
//               cursor={{ strokeDasharray: "3 3" }}
//               content={
//                 <ChartTooltipContent
//                   labelFormatter={(v) =>
//                     new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
//                   }
//                   indicator="dot"
//                 />
//               }
//             />

//             {openingPrograms.map((program) => (
//               <Area
//                 key={program.uuid}
//                 dataKey={program.uuid}
//                 type="monotone"
//                 fill={`url(#fill-${program.uuid})`}
//                 stroke={chartConfig[program.uuid]?.color}
//                 strokeWidth={2}
//                 stackId="scholars"
//               />
//             ))}

//             <ChartLegend content={<ChartLegendContent />} />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
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

  if (loadingPrograms || loadingClasses || loadingScholars) {
    return (
      <Card className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading scholar data...</span>
      </Card>
    );
  }

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
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle>Scholars by Opening Program</CardTitle>
        <CardDescription>Compare total scholar enrollment</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <ChartContainer config={chartConfig} className="mx-auto h-fit w-full">
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
