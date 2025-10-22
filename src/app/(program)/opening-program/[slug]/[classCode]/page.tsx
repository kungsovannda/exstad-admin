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
import { StatisticCard } from "@/features/opening-program/components/scholar-class.tsx/statistic-card";
import DrawerScholars from "@/features/opening-program/components/scholar-class.tsx/add-scholar/DrawerScholars";
import { Heading } from "@/components/Heading";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { useGetClassByCodeQuery } from "@/features/opening-program/components/class/classApi";
import { sortByAudit } from "@/utils/sortByAudit";

export default function ScholarClassPage() {
  const params = useParams();
  const classCode = params.classCode as string;
  const [editTarget, setEditTarget] = useState<ScholarClassType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 1️⃣ Fetch the class info first
  const { data: classInfo, isLoading: isLoadingClass } = useGetClassByCodeQuery(classCode!, {
    skip: !classCode,refetchOnMountOrArgChange:true
  });

  const classUuid = classInfo?.uuid;

  // 2️⃣ Fetch scholar classes using classUuid
  const {
    data: scholarData = [],
    isLoading: isLoadingScholar,
    isFetching,
    isError: isScholarError,
    refetch: refetchScholarClasses,
  } = useGetScholarClassesByClassUuidQuery(classUuid!, { skip: !classUuid,refetchOnMountOrArgChange:true });

  const { data: allOpeningPrograms = [] } = useGetAllOpeningProgramsQuery();

  const [addScholar] = useCreateScholarClassMutation();
  const [updateScholar] = useUpdateScholarClassMutation();
  const [deleteScholarClass] = useDeleteScholarClassMutation();

  const scholarClasses: ScholarClassType[] = useMemo(
    () => sortByAudit(scholarData),
    [scholarData]
  );

  const openingProgramUuid = useMemo(
    () =>
      allOpeningPrograms.find((p) => p.title === classInfo?.openingProgramName)?.uuid,
    [allOpeningPrograms, classInfo]
  );

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
              `Scholar "${row.scholar?.englishName || "Unknown"}" deleted successfully!`
            );
          } catch (err) {
            toast.error(
              `Failed to delete scholar: ${
                err instanceof Error ? err.message : String(err)
              }`
            );
          }
        },
      }),
    [scholarClasses, openingProgramUuid, deleteScholarClass, refetchScholarClasses]
  );

  if (isScholarError) {
    return <div className="p-6 text-red-500">Failed to load scholars</div>;
  }

  return (
    <div className="space-y-4 p-5">
      <div className="flex justify-between items-center gap-10">
        <Heading
          title={classCode || "Unknown Class"}
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
        scholarsClass={scholarClasses.map((sc) => ({ scholarUuid: sc.scholar?.uuid }))}
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
                classUuid: classUuid!,
                scholarUuid,
                isPaid: options.isPaid,
                isReminded: options.isReminded,
              }).unwrap();
              await refetchScholarClasses();
              toast.success("Scholar added successfully!");
            }
            setDrawerOpen(false);
            setEditTarget(null);
          } catch {
            toast.error("Failed to add scholar into class.");
          }
        }}
        onAddMultipleScholars={async (scholarUuids, options) => {
          let addedCount = 0;
          for (const scholarUuid of scholarUuids) {
            if (scholarClasses.some((sc) => sc.scholar?.uuid === scholarUuid)) continue;
            try {
              await addScholar({
                classUuid: classUuid!,
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
        isLoading={isLoadingScholar || isFetching || isLoadingClass}
      />

      {isLoadingScholar || isLoadingClass ? (
        <DataTableSkeleton columnCount={5} />
      ) : (
        <ScholarClassDataTable
          data={scholarClasses}
          totalItems={scholarClasses.length}
          columns={columns}
          openingProgramUuid={openingProgramUuid}
          refetch={refetchScholarClasses}
        />
      )}
    </div>
  );
}
