"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ActivityModal from "./form-field";
import { FlattenedActivity } from "@/features/opening-program/components/table/activity-table";
import DeleteModal from "./delete-modal-component";
import { toast } from "sonner";


interface ActivityActionsCellProps {
  ActivityData: FlattenedActivity;
  onDelete?: (id: number) => void; // optional callback
  
}

export function ActivityActionsCell({ ActivityData,onDelete }: ActivityActionsCellProps) {
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
          <DropdownMenuItem className="text-red-600"onClick={() => setDeleteOpen(true)} >   Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      <ActivityModal
        open={open}
        onOpenChange={setOpen}
        initialData={{
          title: ActivityData.activityGroup,
          subtitle: ActivityData.subtitle,
          description: ActivityData.description,
          images: [], // your modal expects an array of File objects
           imageUrl: ActivityData.image, // existing image for preview
        }}
      />
       {/* Delete Modal */}
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={ActivityData.activityGroup}
        onConfirm={() => {
          onDelete?.(ActivityData.id); // call parent callback
          toast.success(`Activity "${ActivityData.activityGroup}" deleted successfully!`);
        }}
      />
    </>
  );
}
