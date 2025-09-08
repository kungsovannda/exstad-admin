"use client";
import { Heading } from "@/components/Heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnrollmentChart from "@/features/enrollment/components/statistic/EnrollmentChart";
import { EnrollmentStatisticCard } from "@/features/enrollment/components/statistic/EnrollmentStatisticCard";
import { formatTitle } from "@/utils/formatTitle";
import { useParams } from "next/navigation";
import React from "react";

export default function PaidEnrollment() {
  const param = useParams();
  const slug = param.slug?.toLocaleString();

  return (
    <div className="space-y-6 min-h-screen h-fit">
      <Heading
        title={`${formatTitle(slug!)} Enrollment`}
        description="Overview of scholar enrollment distribution by program"
      />
      <Tabs defaultValue="gen3">
        <TabsList>
          <TabsTrigger value="gen3">Gen 3</TabsTrigger>
          <TabsTrigger value="gen2">Gen 2</TabsTrigger>
          <TabsTrigger value="gen1">Gen 1</TabsTrigger>
        </TabsList>

        {[1, 2, 3].map((gen) => (
          <TabsContent
            className="mt-4 flex flex-col space-y-6"
            key={gen}
            value={`gen${gen}`}
          >
            <EnrollmentStatisticCard />
            <EnrollmentChart />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
