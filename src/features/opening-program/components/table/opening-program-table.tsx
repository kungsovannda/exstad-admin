import { DefaultTableModel } from "@/components/table/default-table-model";
import { openingProgramColumns } from "./openingColumn";
import { openingProgramType } from "@/types/opening-program";

// Flatten all openingprograms from all programs
// const allOpeningPrograms = programData.flatMap(
//   (program) => program.openingprogram || []
// );

interface OpeningProgramTableProps {
  data:openingProgramType[];
  totalItems:number;
  columns: ReturnType<typeof openingProgramColumns>;
}

export default function OpeningProgramTable({data, totalItems, columns}: OpeningProgramTableProps) {
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
