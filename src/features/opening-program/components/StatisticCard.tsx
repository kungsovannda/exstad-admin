"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { State } from "@/types";
import { BookCheck, BookLock, BookText, PencilOff, UserCheck2, Users } from "lucide-react";
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
        title="Total Opening Program"
        icon={BookCheck}
        total={total}
        isLoading={isLoading}
        description="Total number of all opening programs"
      />
      <DefaultStatisticCard
        title="Draft Program"
        icon={BookLock}
        total={closed}
        isLoading={isLoading}
        description="Opening programs still in draft mode"
      />
      <DefaultStatisticCard
        title="Short Courses"
        icon={BookText}
        total={shortCourses}
        isLoading={isLoading}
        description="Course with short-term skill "
      />
      <DefaultStatisticCard
        title="Scholarship Courses"
        icon={BookText}
        total={scholarshipCourses}
        isLoading={isLoading}
        description="Courses available with scholarships"
      />
    </div>
  );

  
}
