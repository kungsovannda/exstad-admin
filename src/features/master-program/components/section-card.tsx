
"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { State } from "@/types";
import { UserCheck2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { MasterProgramType } from "@/types/program";

interface MasterStatisticCardProps {
  MasterProgram: MasterProgramType[];
  isLoading?: boolean;
}

export function MasterProgramStatisticCard({
  MasterProgram,
  isLoading = false,
}: MasterStatisticCardProps) {
  const [total, setTotal] = useState<State>({ total: 0  });
  const [draft, setDraft] = useState<State>({ total: 0 });
  const [shortCourses, setShortCourses] = useState<State>({ total:0});
  const [scholarshipCourses, setScholarshipCousrses] = useState<State>({ total:0});


  useEffect(() => {
    if (MasterProgram && Array.isArray(MasterProgram)) {
      const totalMasterProgram = getState(MasterProgram);
      const draftMaterProgram = getState(
        MasterProgram.filter((mp) => mp.visibility === "PRIVATE")
      );
      const shortCourses = getState(
        MasterProgram.filter((mp) => mp.programType === "SHORT_COURSE")
      )
      const scholarshipCourses = getState(
        MasterProgram.filter((mp) => mp.programType === "SCHOLARSHIP")
      );
      

      setTotal(totalMasterProgram);
      setDraft(draftMaterProgram)
      setScholarshipCousrses(scholarshipCourses)
      setShortCourses(shortCourses)
    }
  }, [MasterProgram]);

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
        total={draft}
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
        total={shortCourses}
        isLoading={isLoading}
      />
    </div>
  );
}


const getState = (data: MasterProgramType[]): State => {
  const total = data.length;
  return { total }; 
};

