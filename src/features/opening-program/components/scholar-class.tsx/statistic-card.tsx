"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { State } from "@/types";
import { UserCheck2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ScholarClassType } from "@/types/opening-program";

interface StatisticCardProps {
  scholarClasses: ScholarClassType[];
  isLoading?: boolean;
}

export function StatisticCard({
  scholarClasses, 
  isLoading = false,
}: StatisticCardProps) {
  const [total, setTotal] = useState<State>({ total: 0, male: 0, female: 0 });
  const [paid, setPaid] = useState<State>({ total: 0, });
  const [reminded, setReminded] = useState<State>({ total:0,male:0,female:0});

  useEffect(() => {
    if (scholarClasses && Array.isArray(scholarClasses)) {
      const totalScholars = getState(scholarClasses);
      const paidScholars = getState(
        scholarClasses.filter((sc) => sc.isPaid === true)
      );
      const remindedScholars = getState(
        scholarClasses.filter((sc) => sc.isReminded === true)
      );

      setTotal(totalScholars);
      setPaid(paidScholars);
      setReminded(remindedScholars);
    }
  }, [scholarClasses]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DefaultStatisticCard
        title="Total Scholars"
        icon={Users}
        total={total}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Paid Scholars"
        icon={UserCheck2}
        total={paid}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Reminded Scholars"
        icon={UserCheck2}
        total={reminded}
        isLoading={isLoading}
      />
    </div>
  );
}


const getState = (data: ScholarClassType[]): State => {
  const total = data.length;
  const totalFemale = data.filter(d=> d.scholar?.gender === "Female").length;
  return { total, male: total-totalFemale, female: totalFemale }; 
};
