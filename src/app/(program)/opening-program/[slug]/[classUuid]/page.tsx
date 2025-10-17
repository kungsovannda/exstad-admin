"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";

import ScholarClassDataTable from "@/features/opening-program/components/scholar-class.tsx/table/scholar-class-table";
import { ScholarClassColumns } from "@/features/opening-program/components/scholar-class.tsx/table/scholar-class-Column";
import {
  useGetScholarClassesByClassUuidQuery,
  useDeleteScholarClassMutation,
  useCreateScholarClassMutation,
  useUpdateScholarClassMutation,
} from "@/features/opening-program/components/scholar-class.tsx/scholarClassApi";
import { ScholarClassType } from "@/types/opening-program";
import { useGetClassByUuidQuery } from "@/features/opening-program/components/class/classApi";
import { StatisticCard } from "@/features/opening-program/components/scholar-class.tsx/statistic-card";
import DrawerScholars from "@/features/opening-program/components/scholar-class.tsx/add-scholar/DrawerScholars";
import { Heading } from "@/components/Heading";
import { Scholar } from "@/types/scholar";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { sortByAudit } from "@/utils/sortByAudit";

export default function ScholarClassPage() {
  const params = useParams();
  const classUuid = params.classUuid as string;

  const [editTarget, setEditTarget] = useState<ScholarClassType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch class info
  const { data: classInfo, isError: isClassError } = useGetClassByUuidQuery(
    { uuid: classUuid },
    { skip: !classUuid }
  );

  // Fetch scholar classes
  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    refetch: refetchScholarClasses,
  } = useGetScholarClassesByClassUuidQuery(classUuid, {
    skip: !classUuid,
  });

  // Fetch all opening programs
  const { data: allOpeningPrograms = [] } = useGetAllOpeningProgramsQuery();

  const [addScholar] = useCreateScholarClassMutation();
  const [updateScholar] = useUpdateScholarClassMutation();
  const [deleteScholarClass] = useDeleteScholarClassMutation();

  // Memoized sorted scholar classes
  const scholarClasses: ScholarClassType[] = useMemo(
    () => sortByAudit(data),
    [data]
  );

  // Memoized openingProgramUuid
  const openingProgramUuid = useMemo(
    () =>
      allOpeningPrograms.find((p) => p.title === classInfo?.openingProgramName)
        ?.uuid,
    [allOpeningPrograms, classInfo?.openingProgramName]
  );

  // Memoized table columns
  const columns = useMemo(
    () =>
      ScholarClassColumns(scholarClasses, {
        openingProgramUuid,
        onEdit: (row) => {
          setEditTarget(row);
          setDrawerOpen(true);
        },
        onDelete: async (row) => {
          try {
            await deleteScholarClass(row.uuid).unwrap();
            await refetchScholarClasses();
            toast.success(
              `Scholar "${
                row.scholar?.englishName || "Unknown"
              }" deleted successfully!`
            );
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(`Failed to delete scholar: ${message}`);
          }
        },
      }),
    [
      scholarClasses,
      openingProgramUuid,
      deleteScholarClass,
      refetchScholarClasses,
    ]
  );

  // Early return if fetch failed
  if (isClassError || isError) {
    return (
      <div className="p-6 text-red-500">Failed to load class or scholars</div>
    );
  }

  return (
    <div className="space-y-4 p-5">
      <div className="flex justify-between items-center gap-10">
        <Heading
          title={classInfo?.classCode ?? "Class Detail"}
          description="View statistic and manage scholars"
        />
        <Button
          onClick={() => {
            setEditTarget(null);
            setDrawerOpen(true);
          }}
          variant="outline"
          className="flex items-center gap-2.5"
        >
          <FiPlus />
          <span>Add Scholar</span>
        </Button>
      </div>

      <DrawerScholars
        open={drawerOpen}
        onOpenChange={(val) => {
          setDrawerOpen(val);
          if (!val) setEditTarget(null);
        }}
        scholarsClass={scholarClasses.map((sc) => ({
          scholarUuid: sc.scholar?.uuid,
        }))}
        onAddScholar={async (scholarUuid, options) => {
          try {
            if (editTarget) {
              await updateScholar({
                uuid: editTarget.uuid,
                body: {
                  isPaid: options.isPaid,
                  isReminded: options.isReminded,
                },
              }).unwrap();
              toast.success("Scholar updated successfully!");
            } else {
              await addScholar({
                classUuid,
                scholarUuid,
                isPaid: options.isPaid,
                isReminded: options.isReminded,
              }).unwrap();

              // Refetch first
              const updated = await refetchScholarClasses();
              const addedScholar = updated.data?.find(
                (sc) => sc.scholar?.uuid === scholarUuid
              );

              toast.success(
                `Scholar "${
                  addedScholar?.scholar?.englishName || "Unknown"
                }" added successfully!`
              );
            }

            setDrawerOpen(false);
            setEditTarget(null);
          } catch {
            toast.error("Failed to save scholar class.");
          }
        }}
        onAddMultipleScholars={async (scholarUuids, options) => {
          let addedCount = 0;
          for (const scholarUuid of scholarUuids) {
            if (scholarClasses.some((sc) => sc.scholar?.uuid === scholarUuid))
              continue;
            try {
              await addScholar({
                classUuid,
                scholarUuid,
                isPaid: options.isPaid,
                isReminded: options.isReminded,
              }).unwrap();
              addedCount++;
            } catch {
              toast.error("Failed to add a scholar.");
            }
          }
          if (addedCount > 0) {
            toast.success(`${addedCount} scholar(s) added successfully!`);
            await refetchScholarClasses();
          } else {
            toast.warning("No new scholars were added.");
          }
        }}
      />

      <StatisticCard
        scholarClasses={scholarClasses}
        isLoading={isLoading || isFetching}
      />

      {isLoading ? (
        <DataTableSkeleton columnCount={5} />
      ) : (
        <ScholarClassDataTable
          data={scholarClasses}
          totalItems={scholarClasses.length}
          columns={columns}
          openingProgramUuid={openingProgramUuid}
        />
      )}
    </div>
  );
}
