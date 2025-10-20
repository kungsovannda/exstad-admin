"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { GraduationCap, ClipboardListIcon, UserIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ClassType } from "@/types/opening-program";

interface ClassStatisticCardProps {
  Classes: ClassType[];
  isLoading?: boolean;
  scholarsCount?: number; 
  instructorCount?:number;
}

export function ClassStatisticCard({
  Classes,
  isLoading = false,
  scholarsCount = 0,
  instructorCount = 0,
}: ClassStatisticCardProps) {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalSlots: 0,
    totalScholars: 0,
    instructorCount:0,
  });

  useEffect(() => {
    if (Classes && Array.isArray(Classes)) {
      const totalClasses = Classes.length;
      const totalSlots = Classes.reduce((sum, c) => sum + (c.totalSlot || 0), 0);
      const totalScholars = scholarsCount;
      const totalInstructors = instructorCount;

      setStats({ totalClasses, totalSlots, totalScholars, instructorCount: totalInstructors });
    }
  }, [Classes, scholarsCount,instructorCount]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DefaultStatisticCard
        icon={GraduationCap}
        title="Total Classes"
        total={{ total: stats.totalClasses, }}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        icon={ClipboardListIcon}
        title="Total Slots"
        total={{ total: stats.totalSlots }}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        icon={UserIcon}
        title="Instructors"
        total={{ total: stats.instructorCount }}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        icon={UsersIcon}
        title="Total Scholars"
        total={{ total: stats.totalScholars }}
        isLoading={isLoading}
      />
    </div>
  );
}
