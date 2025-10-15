"use client";
import { Heading } from "@/components/Heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnrollmentChart from "@/features/enrollment/components/statistic/EnrollmentChart";
import EnrollmentGradeChart from "@/features/enrollment/components/statistic/EnrollmentGradeChart";
import { EnrollmentStatisticCard } from "@/features/enrollment/components/statistic/EnrollmentStatisticCard";
import EnrollmentListPage from "@/features/enrollment/components/table/enrollment-list-page";
import { useGetAllEnrollmentsByProgramQuery } from "@/features/enrollment/enrollmentApi";
import { useGetMasterProgramBySlugQuery } from "@/features/master-program/masterProgramApi";
import { useGetAllOpeningProgramsByProgramSlugQuery } from "@/features/opening-program/openingProgramApi";
import { openingProgramType } from "@/types/opening-program";
import { formatTitle } from "@/utils/formatTitle";
import { Package } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageEnrollment() {
  const param = useParams();
  const slug = param.slug?.toLocaleString();
  const { data: program } = useGetMasterProgramBySlugQuery(
    { slug: slug ?? "" },
    { skip: !slug }
  );
  const [openingPrograms, setOpeningPrograms] = useState<openingProgramType[]>(
    []
  );
  const { data } = useGetAllOpeningProgramsByProgramSlugQuery(
    { slug: slug ?? "" },
    { skip: !slug }
  );
  const [currentGen, setCurrentGen] = useState<openingProgramType | null>(null);
  const { data: enrollments, isLoading } = useGetAllEnrollmentsByProgramQuery(
    currentGen?.uuid ?? "",
    {
      skip: !currentGen?.uuid,
    }
  );
  const router = useRouter();

  useEffect(() => {
    if (!data) return;
    const sortedPrograms = data.toSorted((a, b) => b.generation - a.generation);
    setOpeningPrograms(sortedPrograms);
    router.push(
      `?type=${encodeURIComponent(
        program?.programType.toLowerCase().replace("_", "-") ?? "short-course"
      )}`
    );
    if (!currentGen && sortedPrograms.length > 0) {
      setCurrentGen(sortedPrograms[0]);
    }
  }, [data, currentGen, program?.programType, router]); // Remove openingPrograms from dependencies to avoid infinite loop

  if (openingPrograms?.length === 0 && data !== undefined)
    return (
      <div className="flex flex-col space-y-3 justify-center items-center min-h-screen h-fit">
        <Package size={64} className="text-muted-foreground opacity-30" />
        <span className="text-muted-foreground text-sm">
          No Opening Program Found
        </span>
      </div>
    );

  // Don't render tabs until we have data
  if (!currentGen) return null;

  return (
    <div className="p-6 space-y-6 min-h-screen h-fit">
      <Heading
        title={`${formatTitle(slug!)} Enrollment`}
        description="Overview of scholar enrollment distribution by program"
      />
      <Tabs
        onValueChange={(value) => {
          const selectedGen =
            openingPrograms.find((v) => v.generation === Number(value)) || null;
          setCurrentGen(selectedGen);
        }}
        defaultValue={currentGen.generation.toString()}
      >
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

        {openingPrograms.map((p) => (
          <TabsContent
            className="mt-4 flex flex-col space-y-6"
            key={p.generation}
            value={`${p.generation}`}
          >
            <EnrollmentStatisticCard
              isLoading={isLoading}
              data={enrollments ?? []}
            />
            <EnrollmentChart data={enrollments ?? []} />
            {program?.programType !== "SHORT_COURSE" && (
              <EnrollmentGradeChart data={enrollments ?? []} />
            )}
            <EnrollmentListPage
              isShortCourse={program?.programType === "SHORT_COURSE"}
              uuid={currentGen?.uuid}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
