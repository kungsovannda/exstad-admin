'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export type TimelineRow = {
  id: number;
  title: string;
  startDate?: Date;
  endDate?: Date;
};

// -----------------
// Columns
// -----------------
export const timelineColumns: ColumnDef<TimelineRow>[] = [
  {
    id: 'order',
    header: '#',
    cell: ({ row, table }) => table.getRowModel().rows.indexOf(row) + 1,
    size: 50,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    size: 200,
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      const date = row.original.startDate;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-32 justify-between text-left">
              {date ? format(date, 'PPP') : 'Start'}
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => (row.original.startDate = d)}
              captionLayout="dropdown"
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => {
      const date = row.original.endDate;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-32 justify-between text-left">
              {date ? format(date, 'PPP') : 'End'}
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => (row.original.endDate = d)}
              captionLayout="dropdown"
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      );
    },
  },
];
