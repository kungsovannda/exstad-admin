"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
// import { DataTablePagination } from "@/components/table/data-table-pagination";
// import { DataTableToolbar } from "@/components/table/data-table-toolbar";
// import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";

interface ScholarTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  onSelectionChange?: (scholarUuids: string[]) => void;
}

export function ScholarTable<TData, TValue>({
  columns,
  data,
  totalItems,
  onSelectionChange,
}: ScholarTableProps<TData, TValue>) {
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

  // Get stable reference to row selection state
  const rowSelection = table.getState().rowSelection;

  const rowSelectionString = useMemo(
    () => JSON.stringify(rowSelection),
    [rowSelection]
  );

  // Watch for selection changes
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows;

      const selectedUuids = selectedRows
        .map((row) => {
          const rowData = row.original as TData;

          // Type-safe access to UUID field
          const uuid =
            (rowData as Record<string, unknown>).uuid ??
            (rowData as Record<string, unknown>).scholarUuid ??
            (rowData as Record<string, unknown>).id;

          return typeof uuid === "string" ? uuid : undefined;
        })
        .filter((uuid): uuid is string => Boolean(uuid));

      onSelectionChange(selectedUuids);
    }
  }, [rowSelectionString, onSelectionChange, table]);

  return <DataTable table={table}></DataTable>;
}
