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
  selectedRows?: TData[];
  isPaid?: boolean;
  isReminded?: boolean;
  onAddMultipleScholars?: (
    uuids: string[],
    options: { isPaid: boolean; isReminded: boolean }
  ) => Promise<void>;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
}

export default function AddScholarClassTable<
  TData extends { uuid: string },
  TValue
>({
  columns,
  data,
  totalItems,
  selectedRows = [],
  isPaid = false,
  isReminded = false,
  onAddMultipleScholars,
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
    enableRowSelection: true,
  });

  // Sync selected rows
  useEffect(() => {
    if (onRowSelectionChange) {
      const selected = table.getSelectedRowModel().flatRows.map((r) => r.original);
      onRowSelectionChange(selected);
    }
  }, [table.getSelectedRowModel().flatRows.map((r) => r.id).join(",")]);

  const selectedCount = table.getSelectedRowModel().flatRows.length;

  return (
    <DataTable isPagination={false} table={table}>
      <DataTableToolbar table={table}>
        {onAddMultipleScholars && (
          <Button
            size="sm"
            variant="default"
            disabled={selectedCount === 0}
            onClick={() => {
              const uuids = table
                .getSelectedRowModel()
                .flatRows.map((row) => row.original.uuid);
              onAddMultipleScholars(uuids, { isPaid, isReminded });
            }}
          >
            Add Selected ({selectedCount})
          </Button>
        )}
      </DataTableToolbar>
    </DataTable>
  );
}
