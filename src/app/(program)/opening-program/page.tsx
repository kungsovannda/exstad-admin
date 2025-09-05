'use client';

import { OpeningSectionCards } from '@/components/program/opening-program/opening-section-card';
import { Button } from '@/components/ui/button';
import { programData } from '@/data/programData';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import OpeningProgramDataTable from './data-table';
import { openingProgramColumns } from './openingColumn';

// Flatten all openingprograms from all programs
const allOpeningPrograms = programData.flatMap(program => program.openingprogram || []);

export default function OpeningProgramPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-10">
        <h1 className="text-3xl font-semibold">Program Management</h1>
        <Link href="/opening-program/create">
          <Button variant="outline" className="flex items-center gap-2.5">
            <FiPlus className="text-[18px]" />
            <span className="text-[14px] font-bold">Crete New Opening Program</span>
          </Button>
        </Link>
      </div>
      <OpeningSectionCards />
      <OpeningProgramDataTable
        columns={openingProgramColumns}
        data={allOpeningPrograms} // <- feed flattened data here
      />
    </div>
  );
}
