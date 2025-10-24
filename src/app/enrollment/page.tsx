"use client";
import { Heading } from "@/components/Heading";
import OverviewEnrollmentByAddress from "@/features/enrollment/components/overview/OverviewEnrollmentByAddress";
import OverviewEnrollmentByUniversity from "@/features/enrollment/components/overview/OverviewEnrollmentByUniversity";
import OverviewEnrollmentChart from "@/features/enrollment/components/overview/OverviewEnrollmentChart";
import { OverviewEnrollmentStatisticCard } from "@/features/enrollment/components/overview/OverviewEnrollmentStatisticCard";
import { useGetAllEnrollmentsQuery } from "@/features/enrollment/enrollmentApi";

export default function EnrollmentOverview() {
  const { data: enrollments, isLoading } = useGetAllEnrollmentsQuery();

  return (
    <div className="p-6 space-y-6 min-h-screen h-fit">
      <Heading
        title={`Enrollment Overview`}
        description="Overview of scholar enrollment of all program"
      />

      <OverviewEnrollmentStatisticCard
        isLoading={isLoading}
        data={enrollments ?? []}
      />
      <OverviewEnrollmentChart data={enrollments ?? []} />
      <OverviewEnrollmentByUniversity data={enrollments ?? []} />
      <OverviewEnrollmentByAddress data={enrollments ?? []} />
    </div>
  );
}
