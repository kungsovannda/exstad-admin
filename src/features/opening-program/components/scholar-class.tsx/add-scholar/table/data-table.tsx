"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface AddScholarClassTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  onSelectionChange?: (selected: TData[]) => void; 
  onAddSelected?: (selected: TData[]) => void; 
}

export default function AddScholarClassTable<
  TData extends { uuid: string },
  
  TValue
>({
  columns,
  data,
  totalItems,
  onSelectionChange,
  onAddSelected,

}: AddScholarClassTableProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const perPage = searchParams.get("perPage")
    ? Number(searchParams.get("perPage"))
    : 10;
  
  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / perPage),
    shallow: true,
    debounceMs: 200,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enableRowSelection: true,
  });
    useEffect(() => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    onSelectionChange?.(selectedRows);
  }, [table.getSelectedRowModel().rows.length]);

  return (
    <DataTable isPagination={false} table={table}>
      <DataTableToolbar table={table}>
        <Button
          size={"sm"}
          onClick={() => {
            const selected = table.getSelectedRowModel().rows.map((r) => r.original);
            onAddSelected?.(selected);
          }}
        >
          Add Selected
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
}
