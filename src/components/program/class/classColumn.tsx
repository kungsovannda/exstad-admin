"use client";

import { Classes } from "@/types/opening-program";
import { ColumnDef } from "@tanstack/react-table";
import { ClassActionsCell } from "./class-action-cell";
export const classColumns: ColumnDef<Classes>[] = [
  {
    accessorKey: "classCode",
    header: "Class Code",
  },
  {
    accessorKey: "title",
    header: "Course",
  },
  {
    accessorKey: "shift",
    header: "Shift",
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
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
  },
 {id: "actions",header: "Actions",cell: ({ row }) => <ClassActionsCell classData={row.original} />,},
];
