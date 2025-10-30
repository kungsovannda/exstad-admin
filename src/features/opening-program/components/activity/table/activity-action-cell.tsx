"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DeleteModal from "@/features/master-program/components/delete-modal-component";
import { toast } from "sonner";
import { ActivityType } from "@/types/opening-program";
import { useState } from "react";
import ModalDelete from "@/components/modal/ModalDelete";

interface ActivityActionsCellProps {
  activities: ActivityType;
  onEdit?: (a: ActivityType) => void;
  onDelete?: (a: ActivityType) => void;
}

export function ActivityActionsCell({ activities, onEdit, onDelete }: ActivityActionsCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end"
        onPointerDown={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit?.(activities)}><SquarePen size={16} className="text-primary-hover "/>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => setDeleteOpen(true)}><Trash size={16} className="text-destructive "/>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Modal */}
      <ModalDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${activities.title}?`}
        description={`Are you sure you want to delete ${activities.title}? This action can not be undone `}
        onDelete={async () => {
          try {
            if (onDelete) await onDelete(activities);
            setDeleteOpen(false);
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(`Failed to delete activity: ${message || err}`);
          }
        }}
      />
    </>
  );
}
