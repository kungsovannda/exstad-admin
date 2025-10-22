"use client";

import ComingSoon from "@/components/coming-soon";
import { Heading } from "@/components/Heading";
import ProgramBarCard from "@/features/master-program/components/opening-program-chart";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { ChartBarComparison } from "@/features/program-overview/components/area-chart";
import { ProgramOverviewStatisticCard } from "@/features/program-overview/components/statistic-card";
export default function Home() {
  const { data: masterProgram = [], isLoading } = useGetAllMasterProgramsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const { data: openingPrograms = [] } = useGetAllOpeningProgramsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  // Count how many opening programs per master program
  const openingCounts = masterProgram.map((mp) => {
    const count = openingPrograms.filter(
      (op) => op.programName?.toLowerCase() === mp.title?.toLowerCase()
    ).length;
    return { name: mp.title, count };
  });

  return (
    <div className="p-6 space-y-6 min-h-screen h-fit">
      {/* Header */}
      <div className="flex justify-between items-center gap-10">
        <Heading
          title="Overview"
          description="View statistics and manage programs"
        />
      </div>

      {/* Statistic Cards */}
      <ProgramOverviewStatisticCard
        MasterProgram={masterProgram}
        OpeningProgram={openingPrograms}
        isLoading={isLoading}
      />
      {/* <div className="grid grid-cols-2 gap-5 h-fit"> */}
      
      <ChartBarComparison />
      <ProgramBarCard data={openingCounts} />


      <ComingSoon />
    </div>
  );
}
