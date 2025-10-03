"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { AssignBadgeScholar } from "@/components/scholar/AssignBadgeScholar";
import { Scholar } from "@/types/scholar";

interface ScholarTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
}

export function ScholarTable<TData, TValue>({
  columns,
  data,
  totalItems,
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
  });

  const [isAssignBadgeOpen, setIsAssignBadgeOpen] = useState(false);

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={table.getSelectedRowModel().rows.length === 0}
              size={"sm"}
              variant={"outline"}
            >
              Actions
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsAssignBadgeOpen(true)}>
              Assign Badge
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DataTableToolbar>

      {isAssignBadgeOpen && (
        <AssignBadgeScholar
          onOpenChange={setIsAssignBadgeOpen}
          open={isAssignBadgeOpen}
          scholars={table
            .getSelectedRowModel()
            .rows.map((row) => row.original as Scholar)}
        />
      )}
    </DataTable>
  );
}
