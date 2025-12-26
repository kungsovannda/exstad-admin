"use client";

import { DefaultTableDnd } from "@/components/table/default-table-dnd";
import { TimelineType } from "@/types/opening-program";
import { TimelineColumns } from "./column";

interface TimelineTableProps {
  data: TimelineType[];
  totalItems: number;
  columns: ReturnType<typeof TimelineColumns>;
}
export default function TimelineTable({
  data,
  totalItems,
  columns,
  onReorder, 
}: TimelineTableProps & { onReorder?: (newData: TimelineType[]) => void }) {
  return (
    <DefaultTableDnd
      data={data}
      totalItems={totalItems}
      columns={columns}
      getRowId={(row) => String(row._clientId)}
      onReorder={onReorder} 
      enableExport
      exportFilename="timeline.xlsx"
      exportType
    />
  );
}
