'use client';

import React  from 'react';
import { ColumnDef} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { TimelineActionsCell } from './timeline-action-cell';

// -----------------
// TimelineRow type
// -----------------
export type TimelineRow = {
  id: number;
  title: string;
  startDate?: Date;
  endDate?: Date;
};

// -----------------
// DateCell component
// -----------------
interface DateCellProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
} 

export function DateCell({ value, onChange, placeholder = 'Select' }: DateCellProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-fit justify-between text-left"
         onPointerDown={(e) => e.stopPropagation()} >
          {value ? format(value, 'PPP') : placeholder}
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" onPointerDown={(e) => e.stopPropagation()} >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => date && onChange(date)}
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
  handleDateChange: (rowId: number, field: 'startDate' | 'endDate', date: Date) => void,
  handleDelete: (id: number) => void
): ColumnDef<TimelineRow>[] => [
  { id: 'order', header: '#', cell: ({ row, table }) => table.getRowModel().rows.indexOf(row) + 1, size: 50 },
  { accessorKey: 'title', header: 'Title', size: 200 },
   {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => (
      <DateCell
        value={row.original.startDate}
        onChange={(date) => handleDateChange(row.original.id, 'startDate', date)}
        placeholder="Start"
      />
    ),
  },
{
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => (
      <DateCell
        value={row.original.endDate}
        onChange={(date) => handleDateChange(row.original.id, 'endDate', date)}
        placeholder="End"
      />
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <TimelineActionsCell
        timeline={row.original}
        onDelete={() => handleDelete(row.original.id)}
      />
    ),
  },
];
