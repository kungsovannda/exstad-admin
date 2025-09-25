"use client";

// import { OpeningSectionCards } from '@/components/program/opening-program/opening-section-card';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { Heading } from "@/components/Heading";
import { SectionCardsOpening } from "@/components/program/opening-program/section-card-opening";
import OpeningProgramTable from "@/features/opening-program/components/table/opening-program-table";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { openingProgramType } from "@/types/opening-program";
import { openingProgramColumns } from "@/features/opening-program/components/table/openingColumn";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

// Flatten all openingprograms from all programs
// const allOpeningPrograms = programData.flatMap(program => program.openingprogram || []);

export default function OpeningProgramPage() {
    const {data,isFetching,error} = useGetAllOpeningProgramsQuery(undefined,{
        refetchOnMountOrArgChange:true,
    })
     console.log("Raw API data:", data);

    const openingPrograms: openingProgramType[] = data ?? [];
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
            <span className="text-[14px] ">Crete New Opening Program</span>
          </Button>
        </Link>
      </div>
      <SectionCardsOpening />
        {isFetching ? (
            <DataTableSkeleton columnCount={5}/>
        ): error ? (
            <p className="text-red-500">Error loading opening Programs</p>
        ) : openingPrograms.length === 0 ? (
            <p>No openingprograms found</p>
        ): (
            <OpeningProgramTable
             data={openingPrograms}
             totalItems={openingPrograms.length}
             columns={columns}
             />
        )
    }
    </div>
  );
}
