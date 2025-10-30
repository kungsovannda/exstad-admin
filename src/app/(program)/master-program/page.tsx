"use client";

import { MasterProgramStatisticCard } from "@/features/master-program/components/section-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heading } from "@/components/Heading";
import MasterProgramTable from "@/features/master-program/components/table/master-program-table";
import { FiPlus } from "react-icons/fi";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { masterProgramColumns } from "@/features/master-program/components/table/column";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { MasterProgramType } from "@/types/program";
import LevelPieCard from "@/features/master-program/components/program-level-chart";
import ProgramPieCard from "@/features/master-program/components/opening-program-chart";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { sortByAudit } from "@/utils/sortByAudit";
import { Option } from "@/types/data-table";
import ProgramBarCard from "@/features/master-program/components/opening-program-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MasterProgramPieChart } from "@/features/master-program/components/program-type-chart";


export default function MasterProgramPage() {
  const { data: masterProgram = [], isLoading } = useGetAllMasterProgramsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: openingPrograms = [] } = useGetAllOpeningProgramsQuery();

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

  // const typeCounts = masterProgram.reduce(
  //   (acc,program) => {
  //     const type = program.?.toLocaleLowerCase();
  //     if(type === "public") acc.public +=1;
  //     else if (type === "private") acc.private +=1;
  //     return acc;
  //   } ,
  //   {public:}
  // )

  const openingCounts = masterProgram.map((mp) => {
    const count = openingPrograms.filter(
      (op) => op.programName?.toLowerCase() === mp.title?.toLowerCase()
    ).length;
    return { name: mp.title, count };
  });

  const programs: MasterProgramType[] = sortByAudit(masterProgram);
  const columns = masterProgramColumns(programs);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-10">
        <Heading title="Master Program" description="Program Management" />
        <Link href="/master-program/create">
          <Button variant="outline" className="flex items-center gap-2.5">
            <FiPlus className="text-[18px]" />
            <span className="text-[14px] cursor-pointer">
              Create New Program
            </span>
          </Button>
        </Link>
      </div>

      <MasterProgramStatisticCard
        MasterProgram={masterProgram}
        isLoading={isLoading}
      />
      <div className="grid grid-cols-2 gap-5 h-fit">
        <LevelPieCard levelCounts={levelCounts} />
        <MasterProgramPieChart MasterProgram={masterProgram}  />
      </div>
        <ProgramBarCard data={openingCounts} />
      <Card className="flex flex-col space-y-4 rounded-lg shadow-sm">
        <CardHeader className="items-center pb-2">
          <CardTitle>Master Program Overview</CardTitle>
          <CardDescription>
            View and manage master program information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <DataTableSkeleton columnCount={5} />
          ) : (
            <MasterProgramTable
              data={programs}
              totalItems={programs.length}
              columns={columns}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
