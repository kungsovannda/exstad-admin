"use client";
import { ActivityColumns } from "./activityColumn";
import {ActivityType } from "@/types/opening-program";
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
import { DefaultTableDnd } from "@/components/table/default-table-dnd";

interface ActivityTableProps {
  data:ActivityType[];
  totalItems:number;
  columns:ReturnType<typeof ActivityColumns>;
}
export default function ActivityTable
({
  data,
  totalItems,
  columns,
  onReorder
}:ActivityTableProps & {onReorder? : (newData: ActivityType[]) => void}) {
  return (
     <DefaultTableDnd
          data={data}
          totalItems={totalItems}
          columns={columns}
          getRowId={(row) => String(row._clientId)}
          onReorder={onReorder} 
          enableExport
          exportFilename="acitivity.xlsx"
          exportType
        />
  );
}
