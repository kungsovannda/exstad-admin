"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

interface UniversityTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
}

export function UniversityTable<TData, TValue>({
  columns,
  data,
  totalItems,
}: UniversityTableProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const perPage = searchParams.get("perPage")
    ? Number(searchParams.get("perPage"))
    : 10;

  const [sorting, setSorting] = useState([{ id: "name", desc: false }]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / perPage),
    shallow: true,
    debounceMs: 200,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    onSortingChange: setSorting,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
