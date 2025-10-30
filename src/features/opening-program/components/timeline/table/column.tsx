"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TimelineActionsCell } from "./action-cell";
import { TimelineType } from "@/types/opening-program";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// -----------------
// DateCell component
// -----------------
interface DateCellProps {
  value?: string | Date; // ✅ supports both string ("YYYY-MM-DD") and Date
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DateCell({
  value,
  onChange,
  placeholder = "Select date",
}: DateCellProps) {
  // ✅ Safely handle both string and Date values
  const parsedDate =
    value instanceof Date
      ? value
      : value && !isNaN(Date.parse(value))
      ? new Date(value)
      : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-fit justify-between text-left font-normal",
            !parsedDate && "text-muted-foreground"
          )}
          onPointerDown={(e) => e.stopPropagation()} // prevent row click
        >
          {parsedDate ? format(parsedDate, "PPP") : placeholder}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onPointerDown={(e) => e.stopPropagation()} // prevent closing issue
      >
       
<Calendar
  mode="single"
  captionLayout="dropdown"
  selected={parsedDate}
  onSelect={(date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // remove time portion

      if (date < today) {
        toast.error("Date must be today or in the future"); 
        return; // prevent selecting past date
      }

      const formatted = format(date, "yyyy-MM-dd");
      onChange(formatted);
    }
  }}
  initialFocus
  className="rounded-md border"
/>
      </PopoverContent>
    </Popover>
  );
}

// -----------------
// Columns
// -----------------
export const TimelineColumns = (
  handleDateChange: (
    rowId: string,
    field: "startDate" | "endDate",
    date: string
  ) => void,
  action?: {
    onEdit?: (t: TimelineType) => void;
    onDelete?: (t: TimelineType) => void;
  }
): ColumnDef<TimelineType>[] => {
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
      id: "order",
      header: "#",
      cell: ({ row, table }) => table.getRowModel().rows.indexOf(row) + 1,
      size: 50,
    },
    { accessorKey: "title", header: "Title", size: 200 },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        <DateCell
          value={row.original.startDate}
          onChange={(date) =>
            handleDateChange(row.original._clientId, "startDate", date)
          }
          placeholder="Start"
        />
      ),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => (
        <DateCell
          value={row.original.endDate}
          onChange={(date) =>
            handleDateChange(row.original._clientId, "endDate", date)
          }
          placeholder="End"
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TimelineActionsCell
          timelines={row.original}
          onEdit={action?.onEdit}
          onDelete={action?.onDelete}
        />
      ),
    },
  ];
};
