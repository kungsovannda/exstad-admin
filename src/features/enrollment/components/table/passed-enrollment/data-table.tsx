// PASSED ENROLLMENT TABLE
"use client";

import { type ColumnDef } from "@tanstack/react-table";

import ExportToExcelModal from "@/components/ExportToExcelModal";
import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { exportToExcel } from "@/services/export-to-excel";
import { Enrollment } from "@/types/enrollment";
import { ChevronDown, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { HandleToScholar } from "./handle-to-scholar";
import { useAppSelector } from "@/lib/hooks";

interface PassedEnrollmentTableProps<TValue> {
  columns: ColumnDef<Enrollment, TValue>[];
  data: Enrollment[];
  totalItems: number;
}

export function PassedEnrollmentTable<TValue>({
  columns,
  data,
  totalItems,
}: PassedEnrollmentTableProps<TValue>) {
  const searchParams = useSearchParams();
  const perPage = searchParams.get("perPage")
    ? Number(searchParams.get("perPage"))
    : 10;
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMode, setExportMode] = useState<"selected" | "all">("selected");
  const [isToScholarOpen, setIsToScholarOpen] = useState(false);
  const preference = useAppSelector((state) => state.preference);

  const handleExport = async (selectedFields: string[]) => {
    const exportData =
      exportMode === "all"
        ? data
        : table
            .getSelectedRowModel()
            .rows.map((row) => row.original as Enrollment);

    await exportToExcel({
      data: exportData,
      selectedFields,
      filename: `passed-enrollments-${exportMode}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`,
      exportType: preference.export,
    });
  };

  const openExportModal = (mode: "selected" | "all") => {
    setExportMode(mode);
    setIsExportModalOpen(true);
  };

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

  const hasSelectedRows = table.getSelectedRowModel().rows.length > 0;

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant={"outline"}>
              <Printer />
              Export
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!hasSelectedRows}
              onClick={() => openExportModal("selected")}
            >
              Export Selected ({table.getSelectedRowModel().rows.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openExportModal("all")}>
              Export All ({data.length})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!hasSelectedRows} size={"sm"} variant={"outline"}>
              Actions
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsToScholarOpen(true)}>
              Create Scholar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DataTableToolbar>

      {isExportModalOpen && (
        <ExportToExcelModal
          data={
            exportMode === "all"
              ? data
              : table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original as Enrollment)
          }
          open={isExportModalOpen}
          onOpenChange={setIsExportModalOpen}
          onExport={handleExport}
        />
      )}

      {isToScholarOpen && (
        <HandleToScholar
          enrollment={table.getSelectedRowModel().rows.map((r) => r.original)}
          open={isToScholarOpen}
          onOpenChange={setIsToScholarOpen}
        />
      )}
    </DataTable>
  );
}
