import { DefaultTableModel } from "@/components/table/default-table-model";
import { programData } from "@/data/programData";
import { openingProgramColumns } from "./openingColumn";

// Flatten all openingprograms from all programs
const allOpeningPrograms = programData.flatMap(
  (program) => program.openingprogram || []
);

export default function OpeningProgramTable() {
  return (
    <div>
      <DefaultTableModel
        columns={openingProgramColumns}
        data={allOpeningPrograms}
        totalItems={programData.length}
      />
    </div>
  );
}
