import { ScholarClassType } from "@/types/opening-program";
import { ScholarClassColumns } from "./scholar-class-Column";
import { DefaultTableModel } from "@/components/table/default-table-model";


interface ScholarClassDataTableProps {
    data:ScholarClassType[];
    totalItems:number;
    columns:ReturnType<typeof ScholarClassColumns>;
}
export default function ScholarClassDataTable({data,totalItems,columns}:ScholarClassDataTableProps) {
    return (
        <>
        <div>
          <DefaultTableModel
            data={data}
            totalItems={totalItems}
            columns={columns}
          />
        </div>
        </>
    )
}