"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClassType } from "@/types/opening-program";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ClassModal, { ClassFormValues } from "@/components/program/opening-program/class/class-modal";
import { toast } from "sonner";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { useDeleteClassMutation, useUpdateClassMutation } from "../classApi";

interface ClassActionsCellProps {
  classes: ClassType;
  onEdit?: (c: ClassType) => void;
  onDelete?: (c: ClassType) => void;
}

export function ClassActionsCell({ classes,onEdit,onDelete }: ClassActionsCellProps) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteClass] = useDeleteClassMutation();
  const [updateClass] = useUpdateClassMutation();

  // DELETE
  const handleDelete = async () => {
    try {
      await deleteClass(classes.uuid).unwrap();
      toast.success(`Class "${classes.className}" deleted successfully!`);
      setDeleteOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete: ${message}`);
    }
  };

  // EDIT / UPDATE
  const handleUpdate = async (data: ClassFormValues) => {
    try {
      await updateClass({ uuid: classes.uuid, body: data }).unwrap();
      toast.success(`Class "${data.className}" updated successfully!`);
      setOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to update class: ${message}`);
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
          <DropdownMenuItem onClick={() => onEdit ? onEdit(classes) :  setOpen(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() =>  onDelete ? onDelete(classes) :  setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <ClassModal
        open={open}
        onOpenChange={setOpen}
        initialData={classes}
        onSubmitClass={handleUpdate} // <--- this was missing
      />

      {/* Delete Modal */}
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={classes.className}
        onConfirm={handleDelete}
      />
    </>
  );
}
