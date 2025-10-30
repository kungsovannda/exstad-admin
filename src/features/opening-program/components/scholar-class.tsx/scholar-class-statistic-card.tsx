"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { GraduationCap, ClipboardListIcon, UserIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ClassType } from "@/types/opening-program";
import { State } from "@/types";

interface ClassStatisticCardProps {
  Classes: ClassType[];
  isLoading?: boolean;
  scholarsCount?: number; 
  maleScholars?: number;
  femaleScholars?: number;
  instructorCount?: number;
  maleInstructors?: number;
  femaleInstructors?: number;
}

export function ClassStatisticCard({
  Classes,
  isLoading = false,
  scholarsCount = 0,
  maleScholars = 0,
  femaleScholars = 0,
  instructorCount = 0,
  maleInstructors = 0,
  femaleInstructors = 0,
}: ClassStatisticCardProps) {
  const [totalClasses, setTotalClasses] = useState<State>({ total: 0 });
  const [totalSlots, setTotalSlots] = useState<State>({ total: 0 });
  const [totalScholars, setTotalScholars] = useState<State>({ total: 0, male: 0, female: 0 });
  const [totalInstructors, setTotalInstructors] = useState<State>({ total: 0, male: 0, female: 0 });

  useEffect(() => {
    if (!Classes || !Array.isArray(Classes)) return;

    setTotalClasses({ total: Classes.length });
    setTotalSlots({ total: Classes.reduce((sum, c) => sum + (c.totalSlot || 0), 0) });

    // Scholars male/female
    const maleSch = maleScholars || Math.floor(scholarsCount / 2);
    const femaleSch = femaleScholars || (scholarsCount - maleSch);
    setTotalScholars({ total: scholarsCount, male: maleSch, female: femaleSch });

    // Instructors male/female
    const maleIns = maleInstructors || Math.floor(instructorCount / 2);
    const femaleIns = femaleInstructors || (instructorCount -  maleIns);
    setTotalInstructors({ total: instructorCount, male: maleIns, female: femaleIns });

  }, [Classes, scholarsCount, maleScholars, femaleScholars, instructorCount, maleInstructors, femaleInstructors]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DefaultStatisticCard
        icon={GraduationCap}
        title="Total Classes"
        description="Total Classes"
        total={totalClasses}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        icon={ClipboardListIcon}
        title="Total Slots"
        description="Total Slots"
        total={totalSlots}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        icon={UserIcon}
        title="Instructors"
        total={totalInstructors}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        icon={UsersIcon}
        title="Total Scholars"
        total={totalScholars}
        isLoading={isLoading}
      />
    </div>
  );
}
