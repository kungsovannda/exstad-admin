"use client";

import React, { useState } from "react";
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
} from "@/features/opening-program/components/scholar-class.tsx/scholarClassApit";
import { ScholarClassPayload, ScholarClassType } from "@/types/opening-program";
import { useGetClassByUuidQuery } from "@/features/opening-program/components/class/classApi";
import { StatisticCard } from "@/features/opening-program/components/scholar-class.tsx/statistic-card";
import DrawerScholars from "@/features/opening-program/components/scholar-class.tsx/add-scholar/DrawerScholars";
import { Heading } from "@/components/Heading";
import { Scholar } from "@/types/scholar";

export default function ScholarClassPage() {
  const params = useParams();
  const classUuid = params.classUuid as string;

  // Fetch class info
  const {
    data: classInfo,
    isLoading: isClassLoading,
    isError: isClassError,
  } = useGetClassByUuidQuery(
    { uuid: classUuid },
    { skip: !classUuid, refetchOnMountOrArgChange: true }
  );

  // Fetch scholar classes
  const {
    data: scholarClasses = [],
    isLoading,
    isFetching,
    isError,
    refetch: refetchScholarClasses,
  } = useGetScholarClassesByClassUuidQuery(classUuid, {
    skip: !classUuid,
    refetchOnMountOrArgChange: true,
  });

  const [addScholar, { isLoading: isAdding }] = useCreateScholarClassMutation();

  const handleAddScholar = async (scholar: Scholar) => {
    try {
      if (scholarClasses.some((sc) => sc.scholar.uuid === scholar.uuid)) {
        toast.warning("This scholar is already added.");
        return;
      }

      await addScholar({
        classUuid,
        scholarUuid: scholar.uuid,
        isPaid: false,
        isReminded: false,
      }).unwrap();

      toast.success(`Scholar "${scholar.englishName}" added successfully!`);
      await refetchScholarClasses();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to add scholar: ${message}`);
    }
  };

  const [updateScholar] = useUpdateScholarClassMutation();
  const [deleteScholarClass] = useDeleteScholarClassMutation();

  const [editTarget, setEditTarget] = useState<ScholarClassType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isClassError || isError) {
    return (
      <div className="p-6 text-red-500">Failed to load class or scholars</div>
    );
  }

  if (isClassLoading || isLoading || isFetching) {
    return (
      <div className="p-6">
        <DataTableSkeleton columnCount={7} />
      </div>
    );
  }
  const columns = ScholarClassColumns(scholarClasses, {
    onEdit: (row) => {
      setEditTarget(row);
      setDrawerOpen(true);
    },
    onDelete: async (row) => {
      await deleteScholarClass(row.uuid).unwrap();
      await refetchScholarClasses();
    },
  });

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
          scholarUuid: sc.scholar.uuid,
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
              if (
                scholarClasses.some((sc) => sc.scholar.uuid === scholarUuid)
              ) {
                toast.warning("This scholar is already added.");
                return;
              }
              await addScholar({
                classUuid,
                scholarUuid,
                isPaid: options.isPaid,
                isReminded: options.isReminded,
              }).unwrap();
              toast.success("Scholar added successfully!");
            }
            await refetchScholarClasses();
            setDrawerOpen(false);
            setEditTarget(null);
          } catch {
            toast.error("Failed to save scholar class.");
          }
        }}
        onAddMultipleScholars={async (scholarUuids, options) => {
          let addedCount = 0;
          for (const scholarUuid of scholarUuids) {
            if (scholarClasses.some((sc) => sc.scholar.uuid === scholarUuid))
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

      {scholarClasses.length === 0 ? (
        <p className="p-6 text-muted-foreground">
          No scholar classes available for this class.
        </p>
      ) : (
        <ScholarClassDataTable
          data={scholarClasses}
          totalItems={scholarClasses.length}
          columns={columns}
        />
      )}
    </div>
  );
}

