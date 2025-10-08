"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { State } from "@/types";
import { UserCheck2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ScholarClassType } from "@/types/opening-program";

interface ScholarClassStatisticCardProps {
  scholarClasses: ScholarClassType[];
  isLoading?: boolean;
}

export function ScholarClassStatisticCard({
  scholarClasses,
  isLoading = false,
}: ScholarClassStatisticCardProps) {
  const [total, setTotal] = useState<State>({ total: 0, male: 0, female: 0 });
  const [paid, setPaid] = useState<State>({ total: 0, male: 0, female: 0 });

  useEffect(() => {
    if (scholarClasses && Array.isArray(scholarClasses)) {
      const totalScholars = getState(scholarClasses);
      const paidScholars = getState(
        scholarClasses.filter((sc) => sc.isPaid === true)
      );

      setTotal(totalScholars);
      setPaid(paidScholars);
    }
  }, [scholarClasses]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}

// Simple helper for counting totals
const getState = (data: ScholarClassType[]): State => {
  const total = data.length;
  return { total, male: 0, female: 0 }; // gender info not available yet
};
