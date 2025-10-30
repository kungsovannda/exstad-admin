"use client";

import { Heading } from "@/components/Heading";
import { useGetAllEnrollmentsQuery } from "@/features/enrollment/enrollmentApi";
import ProgramBarCard from "@/features/master-program/components/opening-program-chart";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { ChartBarComparison } from "@/features/program-overview/components/area-chart";
import { ProgramOverviewStatisticCard } from "@/features/program-overview/components/statistic-card";
import { useGetAllScholarsQuery } from "@/features/scholar/scholarApi";
import ScholarChartByAge from "@/features/scholar/statistic/components/ScholarChartByAge";
import ScholarChartByAddress from "@/features/scholar/statistic/components/table/ScholarChartByAddress";
export default function Home() {
  const { data: masterProgram = [], isLoading } = useGetAllMasterProgramsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const { data: scholars = [] } = useGetAllScholarsQuery();
  const { data: enrollments = [] } = useGetAllEnrollmentsQuery();

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
      <div className="flex justify-between items-center gap-10">
        <Heading
          title="Overview"
          description="View statistics and manage programs"
        />
      </div>

      <ProgramOverviewStatisticCard
        MasterProgram={masterProgram}
        OpeningProgram={openingPrograms}
        scholars={scholars}
        enrollments={enrollments}
        isLoading={isLoading}
      />

      <ChartBarComparison />
      <ProgramBarCard data={openingCounts} />
      <ScholarChartByAge data={Array.isArray(scholars) ? scholars : []} />
      <ScholarChartByAddress data={Array.isArray(scholars) ? scholars : []} />
    </div>
  );
}
