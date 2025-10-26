import { ClassColumns } from "./classColumn";
import { DefaultTableModel } from "@/components/table/default-table-model";
import { ClassType } from "@/types/opening-program";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useDataTable } from "@/hooks/use-data-table";
import { useState } from "react";
import { exportToExcel } from "@/services/export-to-excel";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

import ExportToExcelModal from "@/components/ExportToExcelModal";
import { useAppSelector } from "@/lib/hooks";

interface ClassTableProps {
  data: ClassType[];
  totalItems: number;
  columns: ReturnType<typeof ClassColumns>;
}
export default function ClassDataTable({
  data,
  totalItems,
  columns,
}: ClassTableProps) {
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
      filename: "class.xlsx",
      exportType: preference.export,
    });
  };
  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Button
          size={"sm"}
          variant={"outline"}
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
