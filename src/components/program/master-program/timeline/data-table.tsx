'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Row,
  Cell,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { useSortable, SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TimelineColumns } from './timelineColumn';
import { TimelineRow } from './timelineColumn';
import { Input } from '@/components/ui/input';

type Props = {
  data: TimelineRow[];
  handleDateChange: (rowId: number, field: 'startDate' | 'endDate', date: Date) => void;
};

// -----------------
// Sortable Row
// -----------------
function SortableRow({ row }: { row: Row<TimelineRow> }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.original.id });
  const style = { transform: CSS.Transform.toString(transform), transition, cursor: 'grab' };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {row.getVisibleCells().map((cell: Cell<TimelineRow, unknown>) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

// -----------------
// Timeline DataTable
// -----------------
export default function TimelineDataTable({ data, handleDateChange }: Props) {
  const [tableData, setTableData] = React.useState<TimelineRow[]>(data);
  const [search, setSearch] = React.useState('');

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tableData.findIndex((row) => row.id === active.id);
      const newIndex = tableData.findIndex((row) => row.id === over.id);
      setTableData((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const filteredData = useMemo(() => {
    if (!search) return tableData;
    return tableData.filter((row) => row.title.toLowerCase().includes(search.toLowerCase()));
  }, [search, tableData]);

  const handleDelete = (id: number) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));
  };

  const table = useReactTable({
    data: filteredData,
    columns: TimelineColumns(handleDateChange, handleDelete),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search timelines..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-52"
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
