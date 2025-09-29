// import { useDataTable } from '@/hooks/use-data-table'
// import { masterProgramColumns } from './column'
// import { DefaultTableModel } from '@/components/table/default-table-model'
// // import { programData } from '@/data/programData'
// import { programType } from '@/types/program'
// import { ColumnDef } from '@tanstack/react-table'
// import { useSearchParams } from 'next/navigation'
// import React from 'react'
// import { DataTable } from '@/components/table/data-table'
// import { DataTableToolbar } from '@/components/table/data-table-toolbar'

// interface MasterProgramTableProps<TData,TValue>{
//   columns: ColumnDef<TData,TValue>[];
//   data: TData[];
//   totalItems:number;
// }

// export  function MasterProgramTable<TData,TValue>({
//   columns,
//   data,
//   totalItems,
// }: MasterProgramTableProps<TData,TValue>) {
//   const searchParams = useSearchParams();
//     const perPage = searchParams.get("perPage")
//       ? Number(searchParams.get("perPage"))
//       : 10;
//   const { table } = useDataTable({
//       data,
//       columns,
//       pageCount: Math.ceil(totalItems / perPage),
//       shallow: true,
//       debounceMs: 200,
//       enableGlobalFilter: true,
//       enableColumnFilters: true,
//       enableSorting: true,
//     });
//   return (
//     <div>
//       <DataTable table={table}>
//         <DataTableToolbar table={table}/>
//       </DataTable>
//       {/* <DefaultTableModel columns={masterProgramColumns} data={data} totalItems={data.length}/> */}
//     </div>
//   )
// }


import { DefaultTableModel } from "@/components/table/default-table-model";
import { masterProgramColumns } from "./column";
import { MasterProgramType } from "@/types/program";

interface MasterProgramTableProps {
  data:MasterProgramType[];
  totalItems:number;
  columns:ReturnType<typeof masterProgramColumns>;
}


export default function MasterProgramTable({ data, totalItems, columns }: MasterProgramTableProps) {
  return (
    <div>
      <DefaultTableModel
          data={data}
          totalItems={totalItems}
          columns={columns}
      />
    </div>
  );
}
