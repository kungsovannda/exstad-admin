"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Heading } from "@/components/Heading";

import { useGetClassesByOpeningProgramQuery } from "@/features/opening-program/components/class/classApi";
import { useGetAllScholarsByOpeningProgramUuidQuery } from "@/features/scholar/scholarApi";
import { useGetOpeningProgramBySlugQuery } from "@/features/opening-program/openingProgramApi";
import { ClassStatisticCard } from "@/features/opening-program/components/scholar-class.tsx/scholar-class-statistic-card";
import DrawerInstructors from "@/features/opening-program/components/instructor-class/add-instructor/DrawerInstructor";
import {
  useCreateInstructorClassMutation,
  useGetAllInstructorByClassUuidQuery,
  useGetAllInstructorClassesQuery,
} from "@/features/opening-program/components/instructor-class/instructorClassApi";
import { ClassCardItem } from "@/features/opening-program/components/scholar-class.tsx/class-card";
import { useGetNotScholarUsersQuery } from "@/features/user/userApi";
import { useGetScholarByClassUuidQuery } from "@/features/opening-program/components/scholar-class.tsx/scholarClassApi";
import { Package } from "lucide-react";
import Loader from "@/app/loading";

function slugToProgramName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ClassListPage() {
  const params = useParams();
  const programSlug = params.slug as string;
  const programTitle = slugToProgramName(programSlug);

  const { data: openingProgram } = useGetOpeningProgramBySlugQuery(
    { slug: programSlug },
    { skip: !programSlug }
  );

  const { data: scholars = [] } = useGetAllScholarsByOpeningProgramUuidQuery(
    openingProgram?.uuid ?? "",
    {
      skip: !openingProgram?.uuid,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: classes = [],
    isLoading,
    isError,
  } = useGetClassesByOpeningProgramQuery(programTitle, {
    skip: !programTitle,
    refetchOnMountOrArgChange: true,
  });

  const [selectedClassUuid, setSelectedClassUuid] = useState<string | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: instructorsOfSelectedClass = [], refetch: refetchInstructors } =
    useGetAllInstructorByClassUuidQuery(selectedClassUuid ?? "", {
      skip: !selectedClassUuid,
      refetchOnMountOrArgChange: true,
    });

  const { data: instructors = [] } = useGetNotScholarUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: instructorClasses = [] } = useGetAllInstructorClassesQuery();

  // ✅ Filter instructor-classes to only include classes in this program
  const instructorClassesForProgram = instructorClasses.filter((ic) =>
    classes.some((cls) => cls.uuid === ic.classUuid)
  );

  // ✅ Count unique instructors
  const uniqueInstructorUuids = Array.from(
    new Set(instructorClassesForProgram.map((ic) => ic.instructorUuid))
  );
  const totalInstructors = uniqueInstructorUuids.length;

  const [addInstructor] = useCreateInstructorClassMutation();
  if (isError) {
    return (
      <div className="flex flex-col space-y-3 justify-center items-center min-h-screen h-fit">
        <Package size={64} className="text-muted-foreground opacity-30" />
        <span className="text-muted-foreground text-sm">No Class Found</span>
      </div>
    );
  }
const loading =
  isLoading ||
  !openingProgram?.uuid ||
  scholars === undefined ||
  instructorClasses === undefined;


if (!openingProgram?.uuid) return <Loader />;
if (isLoading) return <Loader />;

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-10">
          <Heading title="Class" description="Class Management" />
        </div>

        {/* Drawer for adding instructors */}
        <DrawerInstructors
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          instructorsClass={instructorsOfSelectedClass.map((ins) => ({
            instructorUuid: ins.uuid,
          }))}
          onAddInstructor={async (instructorUuid) => {
            if (!selectedClassUuid) {
              toast.error("No class selected.");
              return;
            }

            try {
              if (
                instructorsOfSelectedClass.some(
                  (ic) => ic.uuid === instructorUuid
                )
              ) {
                toast.info("This instructor is already added.");
                return;
              }

              await addInstructor({
                instructorUuid,
                classUuid: selectedClassUuid,
              }).unwrap();
              toast.success("Instructor added successfully!");
              await refetchInstructors();
              setDrawerOpen(false);
            } catch {
              toast.error("Failed to add instructor.");
            }
          }}
          onAddMultipleInstructors={async (instructorUuids) => {
            if (!selectedClassUuid) {
              toast.error("No class selected.");
              return;
            }

            let addedCount = 0;
            for (const instructorUuid of instructorUuids) {
              try {
                if (
                  instructorsOfSelectedClass.some(
                    (ic) => ic.uuid === instructorUuid
                  )
                ) {
                  console.info(`Instructor ${instructorUuid} already in class`);
                  continue;
                }
                await addInstructor({
                  instructorUuid,
                  classUuid: selectedClassUuid,
                }).unwrap();
                addedCount++;
              } catch (error) {
                console.error(
                  `Failed to add instructor ${instructorUuid}:`,
                  error
                );
              }
            }

            if (addedCount > 0) {
              toast.success(`${addedCount} instructor(s) added successfully!`);
              await refetchInstructors();
            } else {
              toast.info("No new instructors were added.");
            }
          }}
        />

        {/* Statistics */}
        <ClassStatisticCard
          Classes={classes}
          scholarsCount={scholars.length}
          instructorCount={totalInstructors}
          isLoading={isLoading}
        />

        {/* Class Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <ClassCardItem
              key={cls.uuid}
              cls={cls}
              programSlug={programSlug}
              onAddInstructorClick={(uuid) => {
                setSelectedClassUuid(uuid);
                setDrawerOpen(true);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
