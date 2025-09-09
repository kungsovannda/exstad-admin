// 'use client';

// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { format } from "date-fns";

// // 1️⃣ Define your form values type
// type TimelineFormValues = {
//   applicationPeriodStarted?: Date;
//   applicationPeriodEnded?: Date;
//   preliminaryLearningStarted?: Date;
//   preliminaryLearningEnded?: Date;
//   applicationList?: Date;
//   orientation?: Date;
//   writingTest?: Date;
//   courseTrainingStarted?: Date;
//   courseTrainingEnded?: Date;
//   interviewTest?: Date;
//   finalProjectStarted?: Date;
//   finalProjectEnded?: Date;
//   finalResult?: Date;
//   closingDay?: Date;
// };

// // 2️⃣ Validation schema
// const timelineSchema = z.object({
//   applicationPeriodStarted: z.date().optional(),
//   applicationPeriodEnded: z.date().optional(),
//   preliminaryLearningStarted: z.date().optional(),
//   preliminaryLearningEnded: z.date().optional(),
//   applicationList: z.date().optional(),
//   orientation: z.date().optional(),
//   writingTest: z.date().optional(),
//   courseTrainingStarted: z.date().optional(),
//   courseTrainingEnded: z.date().optional(),
//   interviewTest: z.date().optional(),
//   finalProjectStarted: z.date().optional(),
//   finalProjectEnded: z.date().optional(),
//   finalResult: z.date().optional(),
//   closingDay: z.date().optional(),
// });

// // 3️⃣ Modal / Table Form props type
// type TimelineTableFormProps = {
//   open?: boolean; // optional, for parent modal control
//   onOpenChange?: (open: boolean) => void;
// };

// export default function TimelineTableForm({ open, onOpenChange }: TimelineTableFormProps) {
//   const { control, handleSubmit } = useForm<TimelineFormValues>({
//     resolver: zodResolver(timelineSchema),
//     defaultValues: {},
//   });

//   const onSubmit = (data: TimelineFormValues) => {
//     console.log("Form Data:", data);
//   };

//   // 4️⃣ Timeline rows
//   const rows = [
//     { label: "Application Period", start: "applicationPeriodStarted", end: "applicationPeriodEnded" },
//     { label: "Preliminary Learning", start: "preliminaryLearningStarted", end: "preliminaryLearningEnded" },
//     { label: "Application List", start: "applicationList" },
//     { label: "Orientation", start: "orientation" },
//     { label: "Writing Test", start: "writingTest" },
//     { label: "Course Training", start: "courseTrainingStarted", end: "courseTrainingEnded" },
//     { label: "Interview Test", start: "interviewTest" },
//     { label: "Final Project", start: "finalProjectStarted", end: "finalProjectEnded" },
//     { label: "Final Result", start: "finalResult" },
//     { label: "Closing Day", start: "closingDay" },
//   ];

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="overflow-x-auto">
//       <table className="w-full border border-gray-300 border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2 text-left">Timeline Item</th>
//             <th className="border p-2 text-left">Start Date</th>
//             <th className="border p-2 text-left">End Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row, index) => (
//             <tr key={row.label} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
//               <td className="border p-2">{row.label}</td>

//               {/* Start Date */}
//               <td className="border p-2">
//                 {row.start ? (
//                   <Controller
//                     name={row.start as keyof TimelineFormValues}
//                     control={control}
//                     render={({ field }) => (
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="w-full justify-between text-left"
//                           >
//                             <span>{field.value ? format(field.value, "PPP") : "Select"}</span>
//                             <CalendarIcon className="h-4 w-4 text-muted-foreground" />
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                             mode="single"
//                             selected={field.value || undefined}
//                             onSelect={(date) => field.onChange(date)}
//                             captionLayout="dropdown"
//                             className="rounded-md border"
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     )}
//                   />
//                 ) : "-"}
//               </td>

//               {/* End Date */}
//               <td className="border p-2">
//                 {row.end ? (
//                   <Controller
//                     name={row.end as keyof TimelineFormValues}
//                     control={control}
//                     render={({ field }) => (
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="w-full justify-between text-left"
//                           >
//                             <span>{field.value ? format(field.value, "PPP") : "Select"}</span>
//                             <CalendarIcon className="h-4 w-4 text-muted-foreground" />
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                             mode="single"
//                             selected={field.value || undefined}
//                             onSelect={(date) => field.onChange(date)}
//                             captionLayout="dropdown"
//                             className="rounded-md border"
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     )}
//                   />
//                 ) : "-"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex justify-end mt-4">
//         <Button type="submit" className="bg-primary text-white">
//           Save
//         </Button>
//       </div>
//     </form>
//   );
// }
