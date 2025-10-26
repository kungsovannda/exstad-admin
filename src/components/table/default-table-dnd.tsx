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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { getCommonPinningStyles } from "@/services/data-table";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { exportToExcel } from "@/services/export-to-excel";
import ExportToExcelModal from "@/components/ExportToExcelModal";
import { useAppSelector } from "@/lib/hooks";

interface DefaultTableDndProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  totalItems: number;
  getRowId: (row: TData) => string | number;
  onReorder?: (newData: TData[]) => void;
  isPagination?: boolean;
  enableExport?: boolean; // ✅ new prop
  exportFilename?: string; // ✅ new prop
  exportType?:boolean;
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
  isPagination = true,
  enableExport = false, // ✅ default off
  exportFilename = "export.xlsx", // ✅ default filename
}: DefaultTableDndProps<TData>) {
  const [search, setSearch] = useState("");
  const [dragData, setDragData] = useState(data);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const preference = useAppSelector((state) => state.preference);

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

    setDragData(newData);
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

  const handleExport = async (selectedFields: string[]) => {
    await exportToExcel({
      data,
      selectedFields,
      filename: exportFilename,
      exportType: preference.export,
    });
  };

  return (
    <div className="flex flex-col space-y-4 min-h-[560px]">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-40 lg:w-56"
        />
        <DataTableToolbar table={table}>
          {enableExport && (
            <Button
              size="sm"
              variant="outline"
              disabled={table.getSelectedRowModel().rows.length === 0} 
              onClick={() => setIsExportModalOpen(true)}
              className="h-8" // match toolbar height
            >
              <Printer className="mr-1 h-4 w-4" />
              Export
            </Button>
          )}
        </DataTableToolbar>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredData.map((row) => getRowId(row))}
          strategy={verticalListSortingStrategy}
        >
          <div className="relative flex-1 flex overflow-hidden rounded-lg border">
            <ScrollArea className="h-full w-full">
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            ...getCommonPinningStyles({
                              column: header.column,
                            }),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row, index) => (
                      <SortableRow
                        key={String(getRowId(row.original))}
                        id={String(getRowId(row.original))}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            style={{
                              ...getCommonPinningStyles({
                                column: cell.column,
                              }),
                            }}
                            className={
                              index % 2 === 0 ? "bg-primary/5" : "bg-primary/2"
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </SortableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </SortableContext>
      </DndContext>

      {isPagination && <DataTablePagination table={table} />}

      {enableExport && isExportModalOpen && (
        <ExportToExcelModal
          data={filteredData}
          open={isExportModalOpen}
          onOpenChange={setIsExportModalOpen}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
