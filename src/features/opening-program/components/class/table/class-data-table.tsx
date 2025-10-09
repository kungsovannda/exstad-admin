import { ClassColumns } from './classColumn';
import { DefaultTableModel } from '@/components/table/default-table-model'
// import { programData } from '@/data/programData';
import { ClassType } from '@/types/opening-program';
import React from 'react'

// Flatten all classes from all opening programs
// const allClasses: Classes[] = programData.flatMap(
//   (program) => program.openingprograms?.flatMap((op) => op.classes || []) || []
// );

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
