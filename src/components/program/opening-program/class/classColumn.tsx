"use client";

import { Classes } from "@/types/opening-program";
import { ColumnDef } from "@tanstack/react-table";
import { ClassActionsCell } from "./class-action-cell";
import { programData } from "@/data/programData";
import { buildUniqueOptions } from "../../utils/buildUniqueOptions";

// 1️⃣ Flatten all classes from all opening programs
const allClasses = programData.flatMap((program) =>
  program.openingprogram.flatMap((op) => op.classes)
);


const shiftOptions = buildUniqueOptions(allClasses, (cls) => cls.shift);
const instructorOptions = buildUniqueOptions (allClasses,(ins) => ins.instructor)

// const shiftOption = Array.from(
//   new Set(programData.flatMap((item) => item.openingprogram.flatMap((p) => p.classes.map((s)=>s.shift))))
// ).map((type) => ({ label: type, value: type }));


export const classColumns: ColumnDef<Classes>[] = [
  {
    accessorKey: "classCode",
    header: "Class Code",
  },
  {
    accessorKey: "title",
    header: "Course",
    enableColumnFilter: true,
    meta:{
      variant:"text",
      placeholder:"Search courses...",
      label:"Course"
    }
  },
  {
    accessorKey: "shift",
    header: "Shift",
    enableColumnFilter:true,
    meta:{
      variant:"select",
      placeholder:"Select shift...",
      label:"Shift",
      options:shiftOptions
      // options:[
      //   {label:"Morning",value:"Morning"},
      //   {label:"Afternoon",value:"Afternoon"},
      //   {label:"Evening",value:"Evening"}
      // ]
    }
  },
  {
  id: "time",
  header: "Time",
  cell: ({ row }) => {
    const { startTime, endTime } = row.original;
    const start = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const end = new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${start} - ${end}`;
  },
},
  {
    accessorKey: "room",
    header: "Room",
    enableColumnFilter:true,
    meta:{
      variant:"select",
      placeholder:"Select room...",
      label:"Room",
      options:[
        {label:"Blockchain",value:"Blockchain"},
        {label:"DevOps",value:"DevOps"},
      ]
    }
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
    enableColumnFilter:true,
    meta:{
      variant:"select",
      placeholder:"Select instructors...",
      label:"Instructor",
      options:instructorOptions
      // options:[
      //   {label:"Kim Chansokpheng",value:"Kim Chansokpheng"},
      //   {label:"Chan Chhaya",value:"Chan Chhaya"},
      //   {label:"Eung Lyzhia",value:"Eung Lyzhia"},
      //   {label:"Sreng Chipor",value:"Sreng Chipor"}
      // ]
    }
  },
 {id: "actions",header: "Actions",cell: ({ row }) => <ClassActionsCell classData={row.original} />,},
];
