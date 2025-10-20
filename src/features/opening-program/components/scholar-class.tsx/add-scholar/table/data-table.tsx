"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface AddScholarClassTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  onRowSelectionChange?: (selectedRows: TData[]) => void; // 👈 important
   
}

export default function AddScholarClassTable<TData extends { uuid: string }, TValue>({
  columns,
  data,
  totalItems,
  onRowSelectionChange,
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
    enableRowSelection: true, // 👈 enable row selection
  });

  // Forward selected rows to parent
  useEffect(() => {
    if (onRowSelectionChange) {
      const selected = table.getSelectedRowModel().flatRows.map((row) => row.original);
      onRowSelectionChange(selected);
    }
  }, [table.getSelectedRowModel().flatRows.map((r) => r.id).join(","), table, onRowSelectionChange]);

  return (
    <DataTable isPagination={false} table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
