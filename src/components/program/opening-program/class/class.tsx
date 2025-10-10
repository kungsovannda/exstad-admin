"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ClassDataTable from "@/features/opening-program/components/class/table/class-data-table";
import ClassModal, { ClassFormValues } from "./class-modal";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { ClassColumns } from "@/features/opening-program/components/class/table/classColumn";
import { ClassPayload, ClassType } from "@/types/opening-program";
import {
  useGetClassesByOpeningProgramQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from "@/features/opening-program/components/class/classApi";

interface ClassAdminProps {
  openingProgramTitle: string; // for fetching
  openingProgramUuid: string;  // for creating/updating
}

export default function ClassAdmin({ openingProgramTitle, openingProgramUuid }: ClassAdminProps) {
  const { data: classes = [], isLoading, isFetching, isError } =
    useGetClassesByOpeningProgramQuery(openingProgramTitle, {
      skip: !openingProgramTitle,
      refetchOnMountOrArgChange: true,
    });
    console.log(classes)

  const [createClass] = useCreateClassMutation();
  const [updateClass] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();
 
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClassType | null>(null);

  const columns = ClassColumns(classes, {
    onEdit: (classRow: ClassType) => {
      setEditTarget(classRow);
      setOpen(true);
    },
    onDelete: async (classRow: ClassType) => {
      try {
        await deleteClass(classRow.uuid).unwrap();
        toast.success(`Class "${classRow.classCode}" deleted!`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to delete class: ${message}`);
      }
    },
  });

  const handleSubmitClass = async (data: ClassFormValues) => {
    try {
      const payload: ClassPayload = {
        openingProgramUuid,              // ✅ required by backend
        openingProgramName: openingProgramTitle, // optional, for frontend
        shift: data.shift.toUpperCase() as "MORNING" | "AFTERNOON" | "EVENING",
        instructor: data.instructor,
        startTime: data.startTime,
        endTime: data.endTime,
        isWeekend: data.isWeekend,
        totalSlot: data.totalSlot,
        room: data.room,
        classCode: data.classCode,
        telegram: data.telegram,
      };

      if (editTarget) {
        await updateClass({ uuid: editTarget.uuid, body: payload }).unwrap();
      } else {
        await createClass(payload).unwrap();
      }

      setOpen(false);
      setEditTarget(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save class: ${message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Add Button (always visible) */}
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-lg font-semibold">Classes</h1>
        <ClassModal
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditTarget(null);
          }}
          initialData={editTarget || undefined}
          onSubmitClass={handleSubmitClass}
          trigger={<Button className="font-bold cursor-pointer">Add Class</Button>}
        />
      </div>

      {/* Loading skeleton */}
      {isLoading || isFetching ? (
        <DataTableSkeleton columnCount={7} />
      ) : (
        <>
          
            <ClassDataTable data={classes} totalItems={classes.length} columns={columns} />

        </>
      )}

      {/* Error handling */}
      {isError && <p className="text-destructive">Failed to load classes</p>}
    </div>
  );
}
