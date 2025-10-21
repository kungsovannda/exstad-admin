  "use client";

  import { ClassType } from "@/types/opening-program";
  import { ColumnDef } from "@tanstack/react-table";
  import { ClassActionsCell } from "./class-action-cell";
  import { buildUniqueOptions } from "../../../../../components/utils/buildUniqueOptions";
import { Checkbox } from "@/components/ui/checkbox";

  export const ClassColumns = (
    classes: ClassType[],
    actions?: {
      onEdit?: (c: ClassType) => void;
      onDelete?: (c: ClassType) => void;
    }
  ): ColumnDef<ClassType>[] => {
    const shiftOptions = buildUniqueOptions(classes, (cls) => cls.shift);
    return [
       {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 30,
    },
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
  accessorKey: "isWeekend",
  header: "Day Type",
  enableColumnFilter: true,
  meta: {
    variant: "select",
    placeholder: "Select day type...",
    label: "Day Type",
    options: [
      { label: "Weekend", value: "Weekend" },
      { label: "Weekday", value: "Weekday" },
    ],
  },
  // Display as Weekend/Weekday
  cell: ({ row }) => (row.getValue("isWeekend") ? "Weekend" : "Weekday"),
  // Filter logic
  filterFn: (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    return (value ? "Weekend" : "Weekday") === filterValue;
  },
},

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ClassActionsCell
            classes={row.original}
            onEdit={actions?.onEdit}
            onDelete={actions?.onDelete}
          />
        ), // <-- wired for edit/delete
      },
      
    ];
  };
