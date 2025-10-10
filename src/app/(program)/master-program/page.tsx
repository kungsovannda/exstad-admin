"use client";
import { MasterProgramStatisticCard } from "@/components/program/section-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heading } from "@/components/Heading";
import MasterProgramTable from "@/features/master-program/components/table/master-program-table";
import { FiPlus } from "react-icons/fi";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { masterProgramColumns } from "@/features/master-program/components/table/column";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { MasterProgramType } from "@/types/program";
import LevelPieCard from "@/components/program/master-chart";

export default function Page() {
  const { data:masterProgram= [], isLoading, error } = useGetAllMasterProgramsQuery(undefined, {
  refetchOnMountOrArgChange: true,
});
  const levelCounts = masterProgram.reduce(
    (acc, program) => {
      const level = program.programLevel?.toLowerCase();
      if (level === "basic") acc.basic += 1;
      else if (level === "intermediate") acc.intermediate += 1;
      else if (level === "advanced") acc.advanced += 1;
      return acc;
    },
    { basic: 0, intermediate: 0, advanced: 0 }
  );


  console.log("Raw API data:", masterProgram);

  // Treat data as array directly
  const programs: MasterProgramType[] = masterProgram ?? [];

  console.log("Programs length:", programs.length);
  console.log("Programs:", programs);
  const columns = masterProgramColumns(programs);
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-10">
        <Heading title="Master Program" description="Program Management" />
        <Link href="/master-program/create">
          <Button variant="outline" className="flex items-center gap-2.5">
            <FiPlus className="text-[18px]" />
            <span className="text-[14px] cursor-pointer">Create New Program</span>
          </Button>
        </Link>
      </div>

      <MasterProgramStatisticCard MasterProgram={masterProgram}         isLoading={isLoading} />
      <div className="grid grid-cols-2 gap-5 h-fit">
      <LevelPieCard levelCounts={levelCounts}/>
      <LevelPieCard levelCounts={levelCounts}/>
      </div>

      {isLoading ? (
        <DataTableSkeleton columnCount={5} />
      ) : error ? (
        <p className="text-red-500">Error loading programs</p>
      ) : programs.length === 0 ? (
        <p>No programs found</p>
      ) : (
        <MasterProgramTable
          data={programs}
          totalItems={programs.length}
          columns={columns}
        />
      )}
    </div>
  );
}
