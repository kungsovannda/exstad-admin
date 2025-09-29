"use client";

import { ClassType } from "@/types/opening-program";
import { ColumnDef } from "@tanstack/react-table";
import { ClassActionsCell } from "./class-action-cell";
import { buildUniqueOptions } from "../../../../../components/program/utils/buildUniqueOptions";

export const ClassColumns = (classes: ClassType[] , actions?: { onEdit?: (c: ClassType) => void; onDelete?: (c: ClassType) => void }
): ColumnDef<ClassType>[] => {
  const shiftOptions = buildUniqueOptions(classes, (cls) => cls.shift);
  // const instructorOptions = buildUniqueOptions(classes, (cls) => cls.instructor);

  return [
    {
      accessorKey: "classCode",
      header: "Class Code",
      enableColumnFilter: true,
      meta: {
        variant: "text",
        placeholder: "Search class...",
        label: "Class Code",
      },
    },
    {
      accessorKey: "shift",
      header: "Shift",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        placeholder: "Select shift...",
        label: "Shift",
        options: shiftOptions,
      },
    },
    {
      accessorKey: "totalSlot", // <-- fix: totalSlots
      header: "Total Slot",
    },
    {
      id: "time",
      header: "Time",
      cell: ({ row }) => {
  const { startTime, endTime } = row.original;
  const formatTime = (t: string) => t.slice(0, 5); // "HH:mm"
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
},

    },
    {
      accessorKey: "room",
      header: "Room",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        placeholder: "Select room...",
        label: "Room",
        options: [
          { label: "Blockchain", value: "Blockchain" },
          { label: "DevOps", value: "DevOps" },
        ],
      },
    },
    {
      accessorKey: "instructor",
      header: "Instructor",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        placeholder: "Select instructors...",
        label: "Instructor",
        options:[
          {label: "Chan Chhaya", value:"Chan Chhaya"}
        ]
        // options: instructorOptions,
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ClassActionsCell classes={row.original}  onEdit={actions?.onEdit}
          onDelete={actions?.onDelete} />, // <-- wired for edit/delete
    },
  ];
};
