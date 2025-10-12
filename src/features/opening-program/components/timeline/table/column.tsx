"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TimelineActionsCell } from "./action-cell";
import { TimelineType } from "@/types/opening-program";

// -----------------
// DateCell component
// -----------------
interface DateCellProps {
  value?: string; // ✅ now string (from backend)
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DateCell({ value, onChange, placeholder = "Select" }: DateCellProps) {
  const parsedDate = value ? new Date(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-fit justify-between text-left"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {parsedDate ? format(parsedDate, "PPP") : placeholder}
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={(date) => date && onChange(date.toISOString().split("T")[0])} 
          // ✅ save back as string "YYYY-MM-DD"
          required={false}
          captionLayout="dropdown"
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
  handleDateChange: (rowId: string, field: "startDate" | "endDate", date: string) => void,
  action?: {
    onEdit?: (t: TimelineType) => void;
    onDelete?: (t: TimelineType) => void;
  }
): ColumnDef<TimelineType>[] => {
  return [
    {
      id: "order",
      header: "#",
      cell: ({ row, table }) => table.getRowModel().rows.indexOf(row) + 1,
      size: 50,
    },
    { accessorKey: "title",
       header: "Title", 
       size: 200,
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        <DateCell
          value={row.original.startDate}
          onChange={(date) => handleDateChange(row.original._clientId, "startDate", date)}
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
          onChange={(date) => handleDateChange(row.original._clientId, "endDate", date)}
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
