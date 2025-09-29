"use client";
import { ActivityColumns } from "./activityColumn";
import {ActivityType } from "@/types/opening-program";
import { DefaultTableModel } from "@/components/table/default-table-model";


interface ActivityTableProps {
  data:ActivityType[];
  totalItems:number;
  columns:ReturnType<typeof ActivityColumns>;
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
