"use client";

import { useState } from "react";
import { ScholarClassType } from "@/types/opening-program";
import { ScholarClassColumns } from "./scholar-class-Column";
import { useSearchParams } from "next/navigation";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useMarkCompletedCourseMutation } from "@/features/scholar/scholarApi";
import { toast } from "sonner";

interface ScholarClassDataTableProps {
  data: ScholarClassType[];
  totalItems: number;
  columns: ReturnType<typeof ScholarClassColumns>;
  openingProgramUuid?: string;
}

export default function ScholarClassDataTable({
  data,
  totalItems,
  columns,
  openingProgramUuid,
}: ScholarClassDataTableProps) {
  const [isMarkCompletedCourse, setIsMarkCompletedCourse] = useState(false);
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

  const handleMarkCompleted = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const alreadyCompleted: string[] = [];
    const newlyMarked: string[] = [];

    for (const row of selectedRows) {
      const scholar = row.original.scholar;

      const hasCompleted =
        scholar.completedCourses?.includes(openingProgramUuid!) ?? false;

      if (hasCompleted) {
        alreadyCompleted.push(scholar.englishName || scholar.username);
        continue;
      }

      try {
        await markCompletedCourse({
          scholarUuid: scholar.uuid,
          openingProgramUuid: openingProgramUuid!,
        }).unwrap();

        newlyMarked.push(scholar.englishName || scholar.username);
      } catch (error) {
        console.error(`❌ Failed to mark ${scholar.englishName}:`, error);
        toast.error(`Failed to mark ${scholar.englishName}`);
      }
    }

    if (alreadyCompleted.length > 0) {
      toast.warning(
        `These scholars were already completed:\n${alreadyCompleted.join(", ")}`
      );
    }

    if (newlyMarked.length > 0) {
      toast.success(`Marked completed: ${newlyMarked.join(", ")}`);
    }

    setIsMarkCompletedCourse(true);
  };

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Button
          size="sm"
          variant={isMarkCompletedCourse ? "secondary" : "outline"}
          onClick={handleMarkCompleted}
          disabled={table.getSelectedRowModel().rows.length === 0 || isLoading}
          className="flex items-center gap-2"
        >
          <CheckCircle
            className={`h-4 w-4 ${
              isMarkCompletedCourse ? "text-green-600" : "text-gray-600"
            }`}
          />
          {isLoading
            ? "Marking..."
            : isMarkCompletedCourse
            ? "Completed"
            : "Mark Completed Course"}
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
}
