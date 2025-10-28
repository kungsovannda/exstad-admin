"use client";

import ExportToExcelModal from "@/components/ExportToExcelModal";
import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useMarkCompletedCourseMutation } from "@/features/scholar/scholarApi";
import { useDataTable } from "@/hooks/use-data-table";
import { useAppSelector } from "@/lib/hooks";
import { exportToExcel } from "@/services/export-to-excel";
import { ScholarClassType } from "@/types/opening-program";
import { CheckCircle, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ScholarClassColumns } from "./scholar-class-Column";

interface ScholarClassDataTableProps {
  data: ScholarClassType[];
  totalItems: number;
  columns: ReturnType<typeof ScholarClassColumns>;
  openingProgramUuid?: string;
  refetch?: () => void;
}

export default function ScholarClassDataTable({
  data,
  totalItems,
  columns,
  openingProgramUuid,
  refetch,
}: ScholarClassDataTableProps) {
  const [markCompletedCourse, { isLoading }] = useMarkCompletedCourseMutation();
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

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const preference = useAppSelector((state) => state.preference);

  const handleExport = async (selectedFields: string[]) => {
    await exportToExcel({
      data,
      selectedFields,
      filename: "scholar-class.xlsx",
      exportType: preference.export,
    });
  };

  const handleMarkCompleted = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const skipped: string[] = [];
    const marked: string[] = [];

    for (const row of selectedRows) {
      const scholar = row.original.scholar;
      const completedCourses = scholar.completedCourses ?? [];

      if (
        completedCourses.find((d) => d.uuid === openingProgramUuid)
          ? true
          : false
      ) {
        skipped.push(scholar.englishName || scholar.username);
        continue;
      }

      try {
        await markCompletedCourse({
          scholarUuid: scholar.uuid,
          openingProgramUuid: openingProgramUuid!,
        }).unwrap();
        marked.push(scholar.englishName || scholar.username);
      } catch (error) {
        console.error(`❌ Failed to mark ${scholar.englishName}:`, error);
        toast.error(`Failed to mark ${scholar.englishName}`);
      }
    }

    if (marked.length > 0) {
      toast.success(`Marked completed: ${marked.join(", ")}`);
      if (typeof refetch === "function") refetch(); // refresh table
    }

    if (skipped.length > 0) {
      toast.warning(`Skipped already completed: ${skipped.join(", ")}`);
    }
  };

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Button
          size="sm"
          variant="outline"
          onClick={handleMarkCompleted}
          disabled={table.getSelectedRowModel().rows.length === 0 || isLoading}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4 text-gray-600" />
          {isLoading ? "Marking..." : "Mark Completed Course"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={table.getSelectedRowModel().rows.length === 0}
          onClick={() => setIsExportModalOpen(true)}
        >
          <Printer />
          Export
        </Button>
      </DataTableToolbar>

      {isExportModalOpen && (
        <ExportToExcelModal
          data={data}
          open={isExportModalOpen}
          onOpenChange={setIsExportModalOpen}
          onExport={handleExport}
        />
      )}
    </DataTable>
  );
}
