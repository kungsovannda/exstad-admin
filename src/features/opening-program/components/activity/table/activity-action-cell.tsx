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
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { toast } from "sonner";
import { ActivityType } from "@/types/opening-program";
import { useState } from "react";

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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit?.(activities)}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Modal */}
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={activities.title}
        onConfirm={async () => {
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
