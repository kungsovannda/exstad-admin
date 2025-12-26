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
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import ClassModal, { ClassFormValues } from "@/features/opening-program/components/class/ClassModal";
import { toast } from "sonner";
import DeleteModal from "@/features/master-program/components/delete-modal-component";
import { useDeleteClassMutation, useSoftDeleteClassMutation, useUpdateClassMutation } from "../classApi";
import ModalDelete from "@/components/modal/ModalDelete";

interface ClassActionsCellProps {
  classes: ClassType;
  onEdit?: (c: ClassType) => void;
  onDelete?: (c: ClassType) => void;
}

export function ClassActionsCell({ classes,onEdit,onDelete }: ClassActionsCellProps) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteClass] = useSoftDeleteClassMutation();
  const [updateClass] = useUpdateClassMutation();

  // DELETE
  const handleDelete = async () => {
    try {
      await deleteClass(classes.uuid).unwrap();
      toast.success(`Class "${classes.classCode}" deleted successfully!`);
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
      toast.success(`Class "${data.classCode}" updated successfully!`);
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
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger> 
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit ? onEdit(classes) :  setOpen(true)}> <SquarePen size={16} className="text-primary-hover "/>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => setDeleteOpen(true)}><Trash size={16} className="text-destructive "/>Delete</DropdownMenuItem>          
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
      <ModalDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${classes.classCode}?`}
        description={`Are you sure you want to delete ${classes.classCode}? This action can not be undone `}
        onDelete={handleDelete}
      />
    </>
  );
}
