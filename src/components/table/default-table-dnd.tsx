"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface DefaultTableDndProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  totalItems: number;
  getRowId: (row: TData) => string | number;
  onReorder?: (newData: TData[]) => void; // callback to parent/backend
}

function SortableRow({
  id,
  children,
}: {
  id: string | number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </TableRow>
  );
}

export function DefaultTableDnd<TData extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  onReorder,
}: DefaultTableDndProps<TData>) {
  const [search, setSearch] = useState("");
  const [dragData, setDragData] = useState(data);

  // Sync local dragData when parent data changes
  useEffect(() => {
    setDragData(data);
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dragData.findIndex((row) => getRowId(row) === active.id);
    const newIndex = dragData.findIndex((row) => getRowId(row) === over.id);

    const newData = arrayMove(dragData, oldIndex, newIndex);

    // 1️⃣ Update local UI instantly
    setDragData(newData);

    // 2️⃣ Notify parent/backend
    onReorder?.(newData);
  };

  const filteredData = useMemo(() => {
    if (!search) return dragData;
    return dragData.filter((row) =>
      Object.values(row).some(
        (val) =>
          val !== null &&
          val !== undefined &&
          String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, dragData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getRowId: (row) => String(getRowId(row)),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-52"
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredData.map((row) => getRowId(row))}
          strategy={verticalListSortingStrategy}
        >
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <SortableRow
                    key={String(getRowId(row.original))}
                    id={String(getRowId(row.original))}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </SortableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
