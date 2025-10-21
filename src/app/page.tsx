"use client";
import ComingSoon from "@/components/coming-soon";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { ProgramOverviewStatisticCard } from "@/features/program-overview/components/statistic-card";

export default function Home() {
  const {
      data: masterProgram = [],
      isLoading,
    } = useGetAllMasterProgramsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });
    const {
      data: openingProgram = [],
    } = useGetAllOpeningProgramsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });
  return <>
  <div className="p-6 space-y-6 min-h-screen h-fit">
     <div className="flex justify-between items-center  gap-10">
        <Heading
          title="Program Overview"
          description="View statistic and manage program"
        />
      </div>
      <ProgramOverviewStatisticCard
       MasterProgram={masterProgram}
       OpeningProgram={openingProgram}
        isLoading={isLoading}/>
  </div>
  <ComingSoon />;
  </>
}
