"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { GraduationCap, ClipboardListIcon, UserIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ClassType } from "@/types/opening-program";

interface ClassStatisticCardProps {
  Classes: ClassType[];
  isLoading?: boolean;
  scholarsCount?: number; // pass scholars?.length from parent
}

export function ClassStatisticCard({
  Classes,
  isLoading = false,
  scholarsCount = 0,
}: ClassStatisticCardProps) {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalSlots: 0,
    totalInstructors: 0,
    totalScholars: 0,
  });

  useEffect(() => {
    if (Classes && Array.isArray(Classes)) {
      const totalClasses = Classes.length;
      const totalSlots = Classes.reduce((sum, c) => sum + (c.totalSlot || 0), 0);
      const totalInstructors = new Set(Classes.map((c) => c.instructor).filter(Boolean)).size;
      const totalScholars = scholarsCount;

      setStats({ totalClasses, totalSlots, totalInstructors, totalScholars });
    }
  }, [Classes, scholarsCount]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DefaultStatisticCard
        icon={GraduationCap}
        title="Total Classes"
        total={{ total: stats.totalClasses, male: 800, female: 900 }}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        icon={ClipboardListIcon}
        title="Total Slots"
        total={{ total: stats.totalSlots, male: 800, female: 900 }}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        icon={UserIcon}
        title="Instructors"
        total={{ total: stats.totalInstructors, male: 200, female: 150 }}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        icon={UsersIcon}
        title="Total Scholars"
        total={{ total: stats.totalScholars, male: 800, female: 900 }}
        isLoading={isLoading}
      />
    </div>
  );
}
