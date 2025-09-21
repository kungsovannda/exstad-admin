"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllScholarsQuery } from "@/features/scholar/scholarApi";
import { State } from "@/types";
import { Scholar, ScholarGender, ScholarStatus } from "@/types/scholar";
import { UserCheck, UserPlus, Users, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export function StatisticCard() {
  const { data: scholars, isLoading } = useGetAllScholarsQuery();

  const [total, setTotal] = useState<State>();
  const [active, setActive] = useState<State>();
  const [graduated, setGraduated] = useState<State>();

  useEffect(() => {
    const totalScholar = scholars!.length | 0;
    const totalFemaleScholar = scholars?.filter(
      (s) => s.gender === ScholarGender.FEMALE
    ).length;
    setTotal({
      total: totalScholar!,
      female: totalFemaleScholar!,
      male: totalScholar! - totalFemaleScholar!,
    });

    setActive(getStateByStatus(scholars!, ScholarStatus.ACTIVE));
    setGraduated(getStateByStatus(scholars!, ScholarStatus.GRADUATED));
  }, [scholars]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Scholars</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {total?.total ?? <Skeleton />}
          </div>
          <p className="text-xs text-muted-foreground">
            Female: {total?.female}, Male: {total?.male}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Scholar</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{active?.total}</div>
          <p className="text-xs text-muted-foreground">
            Female: {active?.female}, Male: {active?.male}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Graduated Scholars
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{graduated?.total}</div>
          <p className="text-xs text-muted-foreground">
            Female: {graduated?.female}, Male: {graduated?.male}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scholar Abroad</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">89</div>
          <p className="text-xs text-muted-foreground">-5.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}

const getStateByStatus = (
  scholars: Scholar[],
  status: ScholarStatus
): State => {
  const totalScholars = scholars?.filter(
    (s) => s.status === status.toUpperCase()
  );
  const totalFemale = totalScholars?.filter(
    (s) => s.gender === ScholarGender.FEMALE
  );
  return {
    total: totalScholars!.length,
    female: totalFemale!.length,
    male: totalScholars!.length - totalFemale!.length,
  };
};
