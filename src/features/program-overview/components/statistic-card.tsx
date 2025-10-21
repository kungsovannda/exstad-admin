"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { State } from "@/types";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { MasterProgramType } from "@/types/program";
import { openingProgramType } from "@/types/opening-program";

interface ProgramOverviewStatisticCardProps {
  MasterProgram: MasterProgramType[];
  OpeningProgram: openingProgramType[];
  isLoading?: boolean;
}

export function ProgramOverviewStatisticCard({
  MasterProgram,
  OpeningProgram,
  isLoading = false,
}: ProgramOverviewStatisticCardProps) {
  const [totalMasterProgram, setTotalMasterProgram] = useState<State>({ total: 0 });
  const [totalOpeningProgram, setTotalOpeningProgram] = useState<State>({ total: 0 });

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
        title="Total Master Program"
        icon={Users}
        total={totalMasterProgram}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Total Opening Program"
        icon={Users}
        total={totalOpeningProgram}
        isLoading={isLoading}
      />
    </div>
  );
}

// ✅ Generic getState that works for both types
const getState = <T,>(data: T[]): State => {
  return { total: data.length };
};
