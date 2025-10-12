"use client";

// import { OpeningSectionCards } from '@/components/program/opening-program/opening-section-card';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { Heading } from "@/components/Heading";
import OpeningProgramTable from "@/features/opening-program/components/table/opening-program-table";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { openingProgramType } from "@/types/opening-program";
import { openingProgramColumns } from "@/features/opening-program/components/table/column";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { OpeningProgramStatisticCard } from "@/features/opening-program/components/StatisticCard";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";

// Flatten all openingprograms from all programs
// const allOpeningPrograms = programData.flatMap(program => program.openingprogram || []);

export default function OpeningProgramPage() {
  const { data :openingProgram=[], isLoading, error } = useGetAllOpeningProgramsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {data:masterProgram=[]} = useGetAllMasterProgramsQuery();

  const openingPrograms: openingProgramType[] = openingProgram ?? [];
  const columns = openingProgramColumns(openingPrograms);
  console.log("Programs length:", openingPrograms.length);
  console.log("Programs:", openingPrograms);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-10">
        <Heading
          title="Opening Program "
          description="Opening Program Mangement"
        />
        <Link href="/opening-program/create">
          <Button variant="outline" className="flex items-center gap-2.5">
            <FiPlus className="text-[18px]" />
            <span className="text-[14px] cursor-pointer">Crete New Opening Program</span>
          </Button>
        </Link>
      </div>
      <OpeningProgramStatisticCard OpeningProgram={openingProgram} isLoading={isLoading}
      MasterProgram={masterProgram}  />
      {isLoading ? (
        <DataTableSkeleton columnCount={5} />
      ):(
        <OpeningProgramTable
          data={openingPrograms}
          totalItems={openingPrograms.length}
          columns={columns}
        />
      )}
    </div>
  );
}
