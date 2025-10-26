"use client";

import { VisibilityState, type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge, CheckCircle2, ChevronDown, Printer } from "lucide-react";
import { useState } from "react";
import { AssignBadgeScholar } from "@/features/badge/components/AssignBadgeScholar";
import AssignScholarAchievement from "@/features/scholar-achievement/components/AssignScholarAchievement";
import { Scholar } from "@/types/scholar";
import { exportToExcel } from "@/services/export-to-excel";
import ExportToExcelModal from "@/components/ExportToExcelModal";
import { useAppSelector } from "@/lib/hooks";

interface ScholarTableProps<TValue> {
  columns: ColumnDef<Scholar, TValue>[];
  data: Scholar[];
  totalItems: number;
}

export function ScholarTable<TValue>({
  columns,
  data,
  totalItems,
}: ScholarTableProps<TValue>) {
  const searchParams = useSearchParams();
  const perPage = searchParams.get("perPage")
    ? Number(searchParams.get("perPage"))
    : 10;

  const [columnVisibility] = useState<VisibilityState>({
    isAbroad: false,
    university: false,
    province: false,
  });

  const [isAssignBadgeOpen, setIsAssignBadgeOpen] = useState(false);
  const [isAssignAchievementOpen, setIsAssignAchievementOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMode, setExportMode] = useState<"selected" | "all">("selected");
  const preference = useAppSelector((state) => state.preference);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / perPage),
    shallow: true,
    debounceMs: 200,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    initialState: {
      columnVisibility: columnVisibility,
    },
  });

  const handleExport = async (selectedFields: string[]) => {
    const exportData =
      exportMode === "all"
        ? data
        : table
            .getSelectedRowModel()
            .rows.map((row) => row.original as Scholar);

    await exportToExcel({
      data: exportData,
      selectedFields,
      filename: `scholars-${exportMode}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`,
      exportType: preference.export,
    });
  };

  const openExportModal = (mode: "selected" | "all") => {
    setExportMode(mode);
    setIsExportModalOpen(true);
  };

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
            <DropdownMenuItem onClick={() => setIsAssignBadgeOpen(true)}>
              <CheckCircle2 size={16} className="text-primary-hover" /> Assign
              Badge
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsAssignAchievementOpen(true)}>
              <Badge size={16} className="text-primary-hover" />
              Assign Achievement
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

      {isAssignAchievementOpen && (
        <AssignScholarAchievement
          open={isAssignAchievementOpen}
          onOpenChange={setIsAssignAchievementOpen}
          scholars={table
            .getSelectedRowModel()
            .rows.map((row) => row.original as Scholar)}
        />
      )}

      {isExportModalOpen && (
        <ExportToExcelModal
          data={
            exportMode === "all"
              ? data
              : table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original as Scholar)
          }
          open={isExportModalOpen}
          onOpenChange={setIsExportModalOpen}
          onExport={handleExport}
        />
      )}
    </DataTable>
  );
}
