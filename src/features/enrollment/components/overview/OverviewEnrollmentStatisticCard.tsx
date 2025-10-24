"use client";

import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { State } from "@/types";
import { Enrollment } from "@/types/enrollment";
import { DollarSign, GraduationCap, UserCheck2, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function OverviewEnrollmentStatisticCard({
  data,
  isLoading,
}: {
  data: Enrollment[];
  isLoading: boolean;
}) {
  const [total, setTotal] = useState<State>();
  const [paid, setPaid] = useState<State>();
  const [amount, setAmount] = useState<State>();
  const [scholar, setScholar] = useState<State>();
  useEffect(() => {
    const totalFemale = data.filter((d) => d.gender === "Female");
    setTotal({
      total: data.length,
      female: totalFemale.length,
      male: data.length - totalFemale.length,
    });
    const totalPaid = data.filter((d) => d.isPaid);
    const totalScholar = data.filter((d) => d.isScholar);
    const totalFemalePaid = totalPaid.filter((d) => d.gender === "Female");
    const totalFemaleScholar = totalScholar.filter(
      (d) => d.gender === "Female"
    );

    setPaid({
      total: totalPaid.length,
      female: totalFemalePaid.length,
      male: totalPaid.length - totalFemalePaid.length,
    });
    setAmount({
      total: totalPaid.length * 5,
      female: totalFemalePaid.length * 5,
      male: (totalPaid.length - totalFemalePaid.length) * 5,
    });
    setScholar({
      total: totalScholar.length,
      female: totalFemaleScholar.length,
      male: totalScholar.length - totalFemaleScholar.length,
    });
  }, [data]);
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
      <DefaultStatisticCard
        title="Total Enrollment"
        icon={Users}
        total={total}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Total Paid"
        icon={UserCheck2}
        total={paid}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Amount"
        icon={DollarSign}
        total={amount}
        isLoading={isLoading}
      />
      <DefaultStatisticCard
        title="Scholar"
        icon={GraduationCap}
        total={scholar}
        isLoading={isLoading}
      />
    </div>
  );
}
