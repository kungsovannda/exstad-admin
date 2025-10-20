"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ScholarClassType,
  SCholarClassCreate,
} from "@/types/opening-program";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      toast.success(`Scholar "${scholarClass.scholarName}" removed from class!`);
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
        scholarUuid: scholarClass.scholarUuid, // cannot change
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => (onEdit ? onEdit(scholarClass) : setOpen(true))}
          >
            <SquarePen size={16} className="text-primary-hover mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              onDelete ? onDelete(scholarClass) : setDeleteOpen(true)
            }
            className="text-destructive"
          >
            <Trash size={16} className="text-destructive mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ScholarClassForm
        open={open}
        onOpenChange={setOpen}
        initialData={{
          scholarName: scholarClass.scholarName,
          scholarUuid: scholarClass.scholarUuid,
          isPaid: scholarClass.isPaid,
          isReminded: scholarClass.isReminded,
        }}
        existingScholars={existingScholars} // pass array from parent
        onSubmitScholarClass={handleUpdate}
      />

      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={scholarClass.scholarName}
        onConfirm={handleDelete}
      />
    </>
  );
}
