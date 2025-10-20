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
