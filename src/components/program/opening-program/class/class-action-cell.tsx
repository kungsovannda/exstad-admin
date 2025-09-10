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
import { Classes } from "@/types/opening-program";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ClassModal1 from "./form-field";
import { toast } from "sonner";
import DeleteModal from "../activity/delete-modal-component";

interface ClassActionsCellProps {
  classData: Classes;
  onDelete?: (id: number) => void; // callback to remove class from parent state
}

export function ClassActionsCell({ classData,onDelete  }: ClassActionsCellProps) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
          <DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600"  onClick={() => setDeleteOpen(true)} > Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClassModal1
        initialData={{
          className: classData.title,
          classCode: classData.classCode,
          room: classData.room,
          shift: classData.shift,
          instructor: classData.instructor,
          start: classData.startTime,
          end: classData.endTime,
        }}
        open={open}
        onOpenChange={setOpen}
      />
      {/* Delete Modal */}
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={classData.title}
        onConfirm={() => {
          onDelete?.(classData.id); // remove from parent state or call API
          toast.success(`Class "${classData.title}" deleted successfully!`);
        }}
      />
    </>
  );
}
