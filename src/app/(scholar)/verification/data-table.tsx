"use client";
import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import React from "react";

interface VerificationDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
}

export default function VerificationDataTable<TData, TValue>({
  columns,
  data,
  totalItems,
}: VerificationDataTableProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const perPage = searchParams.get("perPage")
    ? parseInt(searchParams.get("perPage") as string, 10)
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
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
