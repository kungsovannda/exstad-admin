"use client";
import { Heading } from "@/components/Heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnrollmentChart from "@/features/enrollment/components/statistic/EnrollmentChart";
import EnrollmentGradeChart from "@/features/enrollment/components/statistic/EnrollmentGradeChart";
import { EnrollmentStatisticCard } from "@/features/enrollment/components/statistic/EnrollmentStatisticCard";
import EnrollmentListPage from "@/features/enrollment/components/table/enrollment-list-page";
import { useGetMasterProgramBySlugQuery } from "@/features/master-program/masterProgramApi";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { formatTitle } from "@/utils/formatTitle";
import { useParams } from "next/navigation";
import React from "react";

export default function PaidEnrollment() {
  const param = useParams();
  const slug = param.slug?.toLocaleString();
  const { data: program } = useGetMasterProgramBySlugQuery(
    { slug: slug ?? "" },
    {
      skip: !slug,
    }
  );
  const { data: allOpeningPrograms } = useGetAllOpeningProgramsQuery();
  const openingPrograms =
    allOpeningPrograms?.filter((p) => p.programName === program?.title) || [];

  if (openingPrograms.length === 0) return <div>No opening program found</div>;
  openingPrograms.sort((a, b) => b.generation - a.generation);

  return (
    <div className="p-6 space-y-6 min-h-screen h-fit">
      <Heading
        title={`${formatTitle(slug!)} Enrollment`}
        description="Overview of scholar enrollment distribution by program"
      />
      <Tabs defaultValue={`${openingPrograms[0].generation.toString()}`}>
        <TabsList>
          {openingPrograms.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              No opening program found
            </span>
          ) : (
            openingPrograms.map((program) => (
              <TabsTrigger
                key={program.uuid}
                value={program.generation.toString()}
              >
                Gen {program.generation}
              </TabsTrigger>
            ))
          )}
        </TabsList>

        {[1, 2, 3].map((gen) => (
          <TabsContent
            className="mt-4 flex flex-col space-y-6"
            key={gen}
            value={`${gen}`}
          >
            <EnrollmentStatisticCard />
            <EnrollmentChart />
            <EnrollmentGradeChart />
            <EnrollmentListPage />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
