'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Row, Cell } from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
// Columns
// -----------------
export const timelineColumns: ColumnDef<TimelineRow>[] = [
  { id: 'order', header: '#', cell: ({ row, table }) => table.getRowModel().rows.indexOf(row) + 1, size: 50 },
  { accessorKey: 'title', header: 'Title', size: 200 },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      const date = row.original.startDate;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-fit justify-between text-left">
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
            <Button variant="outline" size="sm" className="w-fit justify-between text-left">
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <TimelineActionsCell
        timeline={row.original} // row.original must be of type Timeline
        onDelete={(id) => console.log("Delete timeline with id:", id)}
      />
    ),
  }
];

// -----------------
// Sortable Row
// -----------------
function SortableRow({ row }: { row: Row<TimelineRow> }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.original.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {row.getVisibleCells().map((cell: Cell<TimelineRow, unknown>) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// -----------------
// Timeline DataTable
// -----------------
type Props = { data: TimelineRow[] };

export default function TimelineDataTable({ data }: Props) {
  const [tableData, setTableData] = useState<TimelineRow[]>(data);
  const [search, setSearch] = useState('');

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tableData.findIndex((row) => row.id === active.id);
      const newIndex = tableData.findIndex((row) => row.id === over.id);
      setTableData((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  // Filtered data based on search
  const filteredData = useMemo(() => {
    if (!search) return tableData;
    return tableData.filter((row) =>
      row.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, tableData]);

  const table = useReactTable({
    data: filteredData,
    columns: timelineColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search timelines..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-md p-2 w-full md:w-1/2"
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredData.map((row) => row.id)} strategy={verticalListSortingStrategy}>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <SortableRow key={row.original.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
