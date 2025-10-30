"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { University } from "@/types/university";

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

  const sortedData = React.useMemo(() => {
    return [...(data as University[])].sort((a, b) => {
      const aName = a.shortName;
      const bName = b.shortName;

      if (aName === "ISTAD" && bName === "ISTAD") return 0;
      if (aName === "ISTAD") return -1;
      if (bName === "ISTAD") return 1;

      return aName.localeCompare(bName);
    });
  }, [data]);

  const { table } = useDataTable({
    data: sortedData as TData[],
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
