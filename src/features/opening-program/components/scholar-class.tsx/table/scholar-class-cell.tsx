"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ScholarClassType,
  ScholarClassCreate,
} from "@/types/opening-program";
import DeleteModal from "@/features/master-program/components/delete-modal-component";

import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDeleteScholarClassMutation,
  useUpdateScholarClassMutation,
} from "../scholarClassApi";
import ScholarClassForm, {
  ScholarClassFormValue,
} from "../form-field";
import ModalDelete from "@/components/modal/ModalDelete";

interface ScholarClassActionsCellProps {
  scholarClass: ScholarClassType;
  existingScholars: string[]; // ✅ pass all scholars for duplicate check
  onEdit?: (sc: ScholarClassType) => void;
  onDelete?: (sc: ScholarClassType) => void;
}
export default function ScholarClassActionsCell({
  scholarClass,
  existingScholars,
  onEdit,
  onDelete,
}: ScholarClassActionsCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteScholarClass] = useDeleteScholarClassMutation();
  const [updateScholar] = useUpdateScholarClassMutation();

  const handleDelete = async () => {
    try {
      await deleteScholarClass(scholarClass.uuid).unwrap();
      toast.success(`Scholar "${scholarClass.scholar.englishName}" removed from class!`);
      setDeleteOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete: ${message}`);
    }
  };

  const handleUpdate = async (data: ScholarClassFormValue) => {
    try {
      const payload: ScholarClassCreate = {
        classUuid: scholarClass.classUuid,
        scholarUuid: scholarClass.scholar.uuid,
        isPaid: data.isPaid ?? scholarClass.isPaid,
        isReminded: data.isReminded ?? scholarClass.isReminded,
      };

      await updateScholar({
        uuid: scholarClass.uuid,
        body: payload,
      }).unwrap();

      toast.success(`Scholar updated successfully!`);
      setOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to update scholar class: ${message}`);
    }
  };

  return (
    <>
      <Button
        size={"sm"}
        variant={"ghost"}
        onClick={() => setDeleteOpen(true)} // ✅ Simplified - just open modal
        className="text-destructive"
      >
        <Trash size={16} className="text-destructive" />
      </Button>

      <ScholarClassForm
        open={open}
        onOpenChange={setOpen}
        initialData={{
          scholarName: scholarClass.scholar?.englishName,
          scholarUuid: scholarClass.scholar?.uuid,
          isPaid: scholarClass.isPaid,
          isReminded: scholarClass.isReminded,
        }}
        existingScholars={existingScholars}
        onSubmitScholarClass={handleUpdate}
      />

      {/* ✅ Use only ModalDelete */}
      <ModalDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Scholar Class"
        description={`Are you sure you want to delete ${scholarClass.scholar?.englishName}? This action cannot be undone.`}
        onDelete={handleDelete}
      />
    </>
  );
}