"use client";
import { activityColumns } from "./activityColumn";
import { ActivityDataType,ActivityType } from "@/types/opening-program";
import { MasterProgramType } from "@/types/program";
import { DefaultTableModel } from "@/components/table/default-table-model";


interface ActivityTableProps {
  data:ActivityType[];
  totalItems:number;
  columns:ReturnType<typeof activityColumns>;
}
export default function ActivityTable({data,totalItems,columns}:ActivityTableProps) {
  return (
    <div >
     <DefaultTableModel 
     data={data}
     totalItems={totalItems}
     columns={columns}
     />
    </div>
  );
}
