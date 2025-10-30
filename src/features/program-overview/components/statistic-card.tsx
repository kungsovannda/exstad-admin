"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { State } from "@/types";
import { BookText, Code2, GraduationCap, User2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { MasterProgramType } from "@/types/program";
import { openingProgramType } from "@/types/opening-program";
import { Enrollment } from "@/types/enrollment";
import { Scholar } from "@/types/scholar";

interface ProgramOverviewStatisticCardProps {
  MasterProgram: MasterProgramType[];
  OpeningProgram: openingProgramType[];
  enrollments: Enrollment[];
  scholars: Scholar[];
  isLoading?: boolean;
}

export function ProgramOverviewStatisticCard({
  MasterProgram,
  OpeningProgram,
  enrollments,
  scholars,
  isLoading = false,
}: ProgramOverviewStatisticCardProps) {
  const [totalMasterProgram, setTotalMasterProgram] = useState<State>({
    total: 0,
  });
  const [totalOpeningProgram, setTotalOpeningProgram] = useState<State>({
    total: 0,
  });

  const [totalEnrollment, setTotalEnrollment] = useState<State>();
  useEffect(() => {
    const totalFemale = enrollments.filter((d) => d.gender === "Female");
    setTotalEnrollment({
      total: enrollments.length,
      female: totalFemale.length,
      male: enrollments.length - totalFemale.length,
    });
  }, [enrollments]);
  const [totalScholar, setTotalScholar] = useState<State>();

  useEffect(() => {
    const totalFemale = scholars.filter((d) => d.gender === "Female");
    setTotalScholar({
      total: scholars.length,
      female: scholars.length,
      male: scholars.length - totalFemale.length,
    });
  }, [scholars]);

  useEffect(() => {
    if (Array.isArray(MasterProgram)) {
      setTotalMasterProgram(getState(MasterProgram));
    }

    if (Array.isArray(OpeningProgram)) {
      setTotalOpeningProgram(getState(OpeningProgram));
    }
  }, [MasterProgram, OpeningProgram]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DefaultStatisticCard
        title="Programs"
        icon={Code2}
        total={totalMasterProgram}
        isLoading={isLoading}
        description="All master programs"
      />
      <DefaultStatisticCard
        title="Opening"
        icon={BookText}
        total={totalOpeningProgram}
        isLoading={isLoading}
        description="All opening programs"
      />
      <DefaultStatisticCard
        title="Enrollments"
        icon={User2}
        total={totalEnrollment}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Scholars"
        icon={GraduationCap}
        total={totalScholar}
        isLoading={isLoading}
      />
    </div>
  );
}

const getState = <T,>(data: T[]): State => {
  return { total: data.length };
};
