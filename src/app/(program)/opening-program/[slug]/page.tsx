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
} from "@/features/opening-program/components/instructor-class/instructorClassApi";
import { ClassCardItem } from "@/features/opening-program/components/scholar-class.tsx/class-card";
import { useGetNotScholarUsersQuery } from "@/features/user/userApi";

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

  const [addInstructor] = useCreateInstructorClassMutation();

  if (isError) toast.error("Failed to load classes");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              // Prevent adding duplicate instructors
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
                // Skip if instructor already in class
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
          instructorCount={instructors.length}
          isLoading={isLoading}
        />

        {/* ✅ Class Cards */}
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
              totalScholars={scholars.length}
              totalInstructors={instructors.length}
            
            />
          ))}
        </div>
      </div>
    </div>
  );
}
