"use client";

import ClassModal from "./class-modal";
import ClassDataTable from "./data-table";
import { programData } from "@/data/programData";
import { Classes } from "@/types/openingProgramType";
import { classColumns } from "./classColumn";

// Flatten all classes from all opening programs
const allClasses: Classes[] = programData.flatMap(
  (program) => program.openingprogram?.flatMap((op) => op.classes || []) || []
);

export default function ClassPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-10">
        <h1 className="text-3xl font-semibold">Classes</h1>
        <ClassModal />
      </div>

      <ClassDataTable data={allClasses} columns={classColumns} />
    </div>
  );
}
