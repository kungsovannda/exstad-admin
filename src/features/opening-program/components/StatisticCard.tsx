"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { State } from "@/types";
import { UserCheck2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { openingProgramType } from "@/types/opening-program";
import { MasterProgramType } from "@/types/program";

interface OpeningProgramStatisticCardProps {
  OpeningProgram: openingProgramType[];
  isLoading?: boolean;
  MasterProgram: MasterProgramType[];
}

export function OpeningProgramStatisticCard({
  OpeningProgram,
  MasterProgram,
  isLoading = false,
}: OpeningProgramStatisticCardProps) {
  const [total, setTotal] = useState<State>({ total: 0 });
  const [closed, setClosed] = useState<State>({ total: 0 });
  const [shortCourses, setShortCourses] = useState<State>({ total: 0 });
  const getState = (data: openingProgramType[]): State => {
    const total = data.length;
    return { total };
  };
  const [scholarshipCourses, setScholarshipCousrses] = useState<State>({
    total: 0,
  });
  useEffect(() => {
    if (!Array.isArray(OpeningProgram) || !Array.isArray(MasterProgram)) return;
    const programTypeMap: Record<string, string> = {};
    MasterProgram.forEach((m) => {
      programTypeMap[m.title] = m.programType;
    });
    const totalOpeningProgram = getState(OpeningProgram);
    const closedOpeningProgram = getState(
      OpeningProgram.filter((op) => op.status === "CLOSED")
    );
    const shortCoursePrograms = OpeningProgram.filter(
      (op) => programTypeMap[op.programName] === "SHORT_COURSE"
    );
    const scholarshipPrograms = OpeningProgram.filter(
      (op) => programTypeMap[op.programName] === "SCHOLARSHIP"
    );

    setTotal(totalOpeningProgram);
    setClosed(closedOpeningProgram);
    setShortCourses(getState(shortCoursePrograms));
    setScholarshipCousrses(getState(scholarshipPrograms));
  }, [OpeningProgram, MasterProgram]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DefaultStatisticCard
        title="Total Program"
        icon={Users}
        total={total}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Draft Program"
        icon={UserCheck2}
        total={closed}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Short Courses"
        icon={UserCheck2}
        total={shortCourses}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Scholarship Courses"
        icon={UserCheck2}
        total={scholarshipCourses}
        isLoading={isLoading}
      />
    </div>
  );

  
}
