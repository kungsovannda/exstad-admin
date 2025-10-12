"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  GraduationCap,
  UsersIcon,
  ClipboardListIcon,
  UserIcon,
  Users,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/Heading";
import { useGetClassesByOpeningProgramQuery } from "@/features/opening-program/components/class/classApi";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { toast } from "sonner";
import DefaultStatisticCard from "@/components/statistic-card/DefaultStatisticCard";
import { useGetAllScholarsByOpeningProgramUuidQuery } from "@/features/scholar/scholarApi";
import { skip } from "node:test";
import { useGetOpeningProgramBySlugQuery } from "@/features/opening-program/openingProgramApi";
import { useGetScholarClassesByClassUuidQuery } from "@/features/opening-program/components/scholar-class.tsx/scholarClassApit";
import { StatisticCard } from "@/features/opening-program/components/scholar-class.tsx/statistic-card";
import { ClassStatisticCard } from "@/features/opening-program/components/scholar-class.tsx/scholar-class-statistic-card";

function slugToProgramName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ClassListPage() {
  const params = useParams();
  const router = useRouter();
  const programTitle = slugToProgramName(params.slug as string);

  const { data: openingProgram } = useGetOpeningProgramBySlugQuery(
    { slug: params.slug as string },
    {
      skip: !params.slug,
    }
  );
  const { data: scholars } = useGetAllScholarsByOpeningProgramUuidQuery(
    openingProgram?.uuid ?? "",
    {
      skip: !openingProgram?.uuid,
      refetchOnMountOrArgChange: true,
    }
  );
  console.log("params.slug:", params.slug);

  const {
    data: classes = [],
    isLoading,
    isError,
    isFetching,
  } = useGetClassesByOpeningProgramQuery(programTitle, {
    skip: !programTitle,
    refetchOnMountOrArgChange: true,
  });

  if (isError) toast.error("Failed to load classes");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Heading title="Class" description="Class Management" />

        {/* Statistics Cards */}
        <ClassStatisticCard
          Classes={classes}
          scholarsCount={scholars?.length || 0}
          isLoading={isLoading}
        />
        {/* Class Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Card
              key={cls.uuid}
              className="bg-card border border-border shadow-sm hover:shadow-md transition cursor-pointer rounded-xl"
            >
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-lg font-semibold  flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {cls.classCode}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Instructor</p>
                    <p className="font-medium text-sm">{cls.instructor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Schedule</p>
                    <p className="font-medium text-sm">
                      {cls.startTime} - {cls.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Slots</p>
                    <p className="font-medium text-sm">{cls.totalSlot}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Scholars
                    </p>
                    <p className="font-medium text-sm">{}</p>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                  onClick={() =>
                    router.push(`/opening-program/${params.slug}/${cls.uuid}`)
                  }
                >
                  View Scholars
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
