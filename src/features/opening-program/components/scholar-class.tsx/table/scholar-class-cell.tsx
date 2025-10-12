"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ScholarClassType,
  SCholarClassCreate,
} from "@/types/opening-program";
import DeleteModal from "@/features/master-program/components/delete-modal-component";

import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDeleteScholarClassMutation,
  useUpdateScholarClassMutation,
} from "../scholarClassApit";
import ScholarClassForm, {
  ScholarClassFormValue,
} from "../form-field";

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
      const payload: SCholarClassCreate = {
        classUuid: scholarClass.classUuid,
        scholarUuid: scholarClass.scholar.uuid, // cannot change
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
            onClick={() =>
              onDelete ? onDelete(scholarClass) : setDeleteOpen(true)
            }
            className="text-destructive "
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
        existingScholars={existingScholars} // pass array from parent
        onSubmitScholarClass={handleUpdate}
      />

      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={scholarClass.scholar?.englishName}
        onConfirm={handleDelete}
      />
        {/* <ScholarClassForm
  open={open}
  onOpenChange={setOpen}
  initialData={{
    scholarName: scholarClass.scholar?.englishName ?? "",
    scholarUuid: scholarClass.scholar?.uuid ?? "",
    isPaid: scholarClass.isPaid,
    isReminded: scholarClass.isReminded,
  }}
  existingScholars={existingScholars}
  onSubmitScholarClass={handleUpdate}
/> */}

<DeleteModal
  open={deleteOpen}
  onOpenChange={setDeleteOpen}
  itemName={scholarClass.scholar?.englishName ?? ""}
  onConfirm={handleDelete}
/>
    </>
  );
}
