"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllScholarsQuery } from "@/features/scholar/scholarApi";
import { State } from "@/types";
import { Scholar, ScholarGender, ScholarStatus } from "@/types/scholar";
import { UserCheck, UserPlus, Users, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatisticCard() {
  const { data: scholars, isLoading } = useGetAllScholarsQuery();

  const [total, setTotal] = useState<State>();
  const [active, setActive] = useState<State>();
  const [graduated, setGraduated] = useState<State>();
  const [abroad, setAbroad] = useState<State>();

  useEffect(() => {
    const totalScholar = Array.isArray(scholars) ? scholars.length : 0;
    const totalFemaleScholar = Array.isArray(scholars)
      ? scholars.filter((s) => s.gender === ScholarGender.FEMALE).length
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
          <div className="text-2xl font-bold">{abroad?.total}</div>
          <p className="text-xs text-muted-foreground">
            Female: {abroad?.female}, Male: {abroad?.male}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const getState = (scholars: Scholar[]): State => {
  const totalFemale = scholars?.filter(
    (s) => s.gender === ScholarGender.FEMALE
  );
  return {
    total: scholars!.length,
    female: totalFemale!.length,
    male: scholars!.length - totalFemale!.length,
  };
};
