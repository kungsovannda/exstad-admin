'use client';

import OpeningProgramDataTable from '@/app/opening-program/data-table';
import { openingProgramColumns } from './openingColumn';
import { programData } from '@/data/programData';
import ClassModal from './class-modal';

// Flatten all openingprograms from all programs
const allOpeningPrograms = programData.flatMap(program => program.openingprogram || []);

export default function ClassPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-10">
        <h1 className="text-3xl font-semibold">Class </h1>
          <ClassModal/>
      </div>
      <OpeningProgramDataTable
        columns={openingProgramColumns}
        data={allOpeningPrograms} // <- feed flattened data here
      />
    </div>
  );
}
