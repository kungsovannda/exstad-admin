import { ClassColumns } from './classColumn';
import { DefaultTableModel } from '@/components/table/default-table-model'
import { ClassType } from '@/types/opening-program';
import React from 'react'

interface ClassTableProps {
    data:ClassType[];
    totalItems:number;
    columns:ReturnType<typeof ClassColumns>;
}
export default function ClassDataTable({data,totalItems,columns}: ClassTableProps) {
  return (
    <div>
      <DefaultTableModel
        data={data}
        totalItems={totalItems}
        columns={columns}
      />
    </div>
  )
}
