"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import ScholarClassForm, { ScholarClassFormValue } from "@/features/opening-program/components/scholar-class.tsx/form-field";

interface SCholarClassProps {
  scholarUuid: string; 
}
export default function ScholarClassPage({ scholarUuid }: SCholarClassProps) {
  const params = useParams();
  const router = useRouter();
  const classUuid = params.classUuid as string;
  // Fetch class info for the heading
  const { data: classInfo, isLoading: isClassLoading, isError: isClassError } =
  useGetClassByUuidQuery(
    { uuid: classUuid },
    {
      skip: !classUuid,
      refetchOnMountOrArgChange: true,
    }
  );
  // Fetch scholar classes
  const { data: scholarClasses = [], isLoading, isFetching, isError } =
    useGetScholarClassesByClassUuidQuery(classUuid, {
      skip: !classUuid,
      refetchOnMountOrArgChange: true,
    });

  const [addScholar] = useCreateScholarClassMutation();
  const [updateSCholar] = useUpdateScholarClassMutation();
  const [deleteScholarClass] = useDeleteScholarClassMutation();
  const [editTarget, setEditTarget] = useState<ScholarClassType | null>(null);
  const [open, setOpen] = useState(false);

  // Handle errors
  if (isClassError || isError) {
    return <div className="p-6 text-red-500">Failed to load class or scholars</div>;
  }

  // Loading skeleton
  if (isClassLoading || isLoading || isFetching) {
    return (
      <div className="p-6">
        <DataTableSkeleton columnCount={7} />
      </div>
    );
  }

  const columns = ScholarClassColumns(scholarClasses, {
    onEdit: (row: ScholarClassType) => {
      setEditTarget(row);
      setOpen(true);
    },
    onDelete: async (row: ScholarClassType) => {
      try {
        await deleteScholarClass(row.uuid).unwrap();
        toast.success(`Scholar "${row.scholarName}" remove from class!`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to delete scholar class: ${message}`);
      }
    },
  });

const handleSubmitScholarClass = async (data: ScholarClassFormValue) => {
  try {
    const payload: ScholarClassPayload = {
      classUuid,
      scholarUuid: data.scholarUuid, // ensure this is UUID
      isPaid: data.isPaid ?? false,
      isReminded: data.isReminded ?? false,
    };

    if (editTarget) {
      // ✅ use "body" instead of "payload"
      await updateSCholar({
        uuid: editTarget.uuid, // update by UUID
        body: payload,         // correct key
      }).unwrap();
    } else {
      await addScholar(payload).unwrap();
    }

    setOpen(false);
    setEditTarget(null);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    toast.error(`Failed to save scholar class: ${message}`);
  }
};



  return (
    <div className="space-y-4 p-5">
          <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">{classInfo?.classCode ?? "Class Detail"}</h1>
         <ScholarClassForm
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditTarget(null);
          }}
          initialData={editTarget || undefined}
          existingScholars={scholarClasses.map((sc) => sc.scholarUuid)} // prevent duplicates
          onSubmitScholarClass={handleSubmitScholarClass}
          triggerNode={<Button className="font-bold cursor-pointer">Add Scholar</Button>} // renamed
        />

        </div>

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
