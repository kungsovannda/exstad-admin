"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { State } from "@/types";
import { UserCheck2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ClassType } from "@/types/opening-program";

interface ClassStatisticCardProps {
  Classes: ClassType[];
  isLoading?: boolean;
}

export function ClassStatisticCard({
  Classes,
  isLoading = false,
}: ClassStatisticCardProps) {
  const [total, setTotal] = useState<State>({ total: 0 });
  const [totalSlot, setTotalSlot] = useState<State>({ total: 0});
  const [instructor, setInstructor] = useState<State>({total:0});
  useEffect(() => {
    if (Classes && Array.isArray(Classes)) {
      const totalScholars = getState(Classes);
      const totalSlots = getState( Classes.filter((c) => c.totalSlot ));
      const totalInstructors = getState(Classes.filter((c) => c.instructor))
      setTotal(totalScholars);
      setTotalSlot(totalSlots);
      setInstructor(totalInstructors);
    }
  }, [Classes]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DefaultStatisticCard
        title="Total Scholars"
        icon={Users}
        total={total}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Total Slots"
        icon={UserCheck2}
        total={totalSlot}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Total Instructors"
        icon={UserCheck2}
        total={instructor}
        isLoading={isLoading}
      />
      
    </div>
  );
}


const getState = (data: ClassType[]): State => {
  const total = data.length;
  return { total,  }; 
};
