"use client";
import { Heading } from "@/components/Heading";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewEnrollmentByAddress from "@/features/enrollment/components/overview/OverviewEnrollmentByAddress";
import OverviewEnrollmentByAge from "@/features/enrollment/components/overview/OverviewEnrollmentByAge";
import OverviewEnrollmentByUniversity from "@/features/enrollment/components/overview/OverviewEnrollmentByUniversity";
import EnrollmentChart from "@/features/enrollment/components/statistic/EnrollmentChart";
import EnrollmentChartYearAndClass from "@/features/enrollment/components/statistic/EnrollmentChartYearAndClass";
import EnrollmentGradeChart from "@/features/enrollment/components/statistic/EnrollmentGradeChart";
import { EnrollmentStatisticCard } from "@/features/enrollment/components/statistic/EnrollmentStatisticCard";
import EnrollmentListPage from "@/features/enrollment/components/table/enrollment-list-page";
import { useGetAllEnrollmentsByProgramQuery } from "@/features/enrollment/enrollmentApi";
import { useGetMasterProgramBySlugQuery } from "@/features/master-program/masterProgramApi";
import { useGetAllOpeningProgramsByProgramSlugQuery } from "@/features/opening-program/openingProgramApi";
import { openingProgramType } from "@/types/opening-program";
import { formatTitle } from "@/utils/formatTitle";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Package } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
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
    <div className="p-6 relative space-y-6 min-h-screen h-fit">
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
            <div className="w-full">
              <Carousel
                plugins={[WheelGesturesPlugin()]}
                className="w-full"
                setApi={setApi}
              >
                <CarouselContent>
                  <CarouselItem>
                    <EnrollmentChart data={enrollments ?? []} />
                  </CarouselItem>
                  <CarouselItem>
                    <EnrollmentChartYearAndClass data={enrollments ?? []} />
                  </CarouselItem>
                  <CarouselItem>
                    <OverviewEnrollmentByUniversity data={enrollments ?? []} />
                  </CarouselItem>
                  <CarouselItem>
                    <OverviewEnrollmentByAddress data={enrollments ?? []} />
                  </CarouselItem>
                  <CarouselItem>
                    <OverviewEnrollmentByAge data={enrollments ?? []} />
                  </CarouselItem>
                </CarouselContent>
              </Carousel>

              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === current
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            {program?.programType !== "SHORT_COURSE" && (
              <EnrollmentGradeChart data={enrollments ?? []} />
            )}

            <EnrollmentListPage
              isShortCourse={program?.programType === "SHORT_COURSE"}
              uuid={currentGen?.uuid}
              codeNumber={
                currentGen.programName
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("") + String(currentGen.generation).padStart(2, "0")
              }
              codeTable="ISTAD"
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
