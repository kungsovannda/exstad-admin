// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { Pie, PieChart, LabelList } from "recharts";
// import { useGetAllScholarClassesQuery } from "./scholarClassApit";

// interface ChartDataItem {
//   className: string;
//   count: number;
//   fill: string;
// }

// const colors = [
//   "var(--chart-1)",
//   "var(--chart-2)",
//   "var(--chart-3)",
//   "var(--chart-4)",
//   "var(--chart-5)",
//   "var(--chart-6)",
// ];

// export default function ScholarByClassChart({ openingProgramUuid }: { openingProgramUuid: string }) {
//   const { data: scholarClasses = [], isLoading } = useGetAllScholarClassesQuery(openingProgramUuid);
//   const [chartData, setChartData] = useState<ChartDataItem[]>([]);

//   useEffect(() => {
//     if (!scholarClasses || scholarClasses.length === 0) return;

//     // Group scholars by classUuid
//     const grouped: Record<string, { room: string; count: number }> = {};
//     scholarClasses.forEach((scholar) => {
//       const key = scholar.classUuid;
//       if (!grouped[key]) {
//         grouped[key] = { room: scholar.room || `Class ${key}`, count: 0 };
//       }
//       grouped[key].count += 1;
//     });

//     // Transform to chart data
//     const data: ChartDataItem[] = Object.values(grouped).map((item, index) => ({
//       className: item.room,
//       count: item.count,
//       fill: colors[index % colors.length],
//     }));

//     setChartData(data);
//   }, [scholarClasses]);

//   if (isLoading) return <p>Loading chart...</p>;

//   return (
//     <Card className="flex flex-col rounded-lg shadow-sm">
//       <CardHeader className="items-center pb-2">
//         <CardTitle>Scholars by Class</CardTitle>
//         <CardDescription>
//           Pie chart showing total scholars in each class
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-2">
//         <ChartContainer className="mx-auto h-72 w-full">
//           <PieChart>
//             <ChartTooltip
//               content={
//                 <ChartTooltipContent
//                   nameKey="count"
//                   hideLabel
//                   className="rounded-md border bg-background p-2 shadow-md"
//                 />
//               }
//             />
//             <Pie
//               data={chartData}
//               dataKey="count"
//               nameKey="className"
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               innerRadius={40}
//               paddingAngle={2}
//               strokeWidth={2}
//             >
//               <LabelList
//                 dataKey="className"
//                 fontSize={12}
//                 position="outside"
//                 fill="var(--primary)"
//                 offset={10}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
//         <span className="text-xs font-medium">
//           Total Scholars: {chartData.reduce((sum, item) => sum + item.count, 0)}
//         </span>
//       </CardFooter>
//     </Card>
//   );
// }
