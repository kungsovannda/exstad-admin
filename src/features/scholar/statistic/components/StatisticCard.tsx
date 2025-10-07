"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { useGetAllScholarsQuery } from "@/features/scholar/scholarApi";
import { State } from "@/types";
import { Gender, Scholar, ScholarStatus } from "@/types/scholar";
import { Globe, GraduationCap, UserCheck2, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function StatisticCard() {
  const { data: scholars, isLoading } = useGetAllScholarsQuery();

  const [total, setTotal] = useState<State>();
  const [active, setActive] = useState<State>();
  const [graduated, setGraduated] = useState<State>();
  const [abroad, setAbroad] = useState<State>();

  useEffect(() => {
    const totalScholar = Array.isArray(scholars) ? scholars.length : 0;
    const totalFemaleScholar = Array.isArray(scholars)
      ? scholars.filter((s) => s.gender === Gender.FEMALE).length
      : 0;
    setTotal({
      total: totalScholar,
      female: totalFemaleScholar,
      male: totalScholar - totalFemaleScholar,
    });

    setActive(
      getState(
        Array.isArray(scholars)
          ? scholars.filter(
              (s) => s.status === ScholarStatus.ACTIVE.toUpperCase()
            )
          : []
      )
    );
    setGraduated(
      getState(
        Array.isArray(scholars)
          ? scholars.filter(
              (s) => s.status === ScholarStatus.GRADUATED.toUpperCase()
            )
          : []
      )
    );
    setAbroad(
      getState(
        Array.isArray(scholars) ? scholars.filter((s) => s.isAbroad) : []
      )
    );
  }, [scholars]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DefaultStatisticCard
        title="Total Scholar"
        icon={Users}
        total={total}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Active Scholar"
        icon={UserCheck2}
        total={active}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Graduated Scholar"
        icon={GraduationCap}
        total={graduated}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Abroad Scholar"
        icon={Globe}
        total={abroad}
        isLoading={isLoading}
      />
    </div>
  );
}

const getState = (scholars: Scholar[]): State => {
  const totalFemale = scholars?.filter((s) => s.gender === Gender.FEMALE);
  return {
    total: scholars!.length,
    female: totalFemale!.length,
    male: scholars!.length - totalFemale!.length,
  };
};
