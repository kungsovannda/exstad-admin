'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import SimpleTimelineForm from "./timeline-modal1";
import { toast } from "sonner";
import DeleteModal from "../../activity/delete-modal-component";
import { TimelineRow } from "./data-table";

interface TimelineActionsCellProps {
  timeline: TimelineRow;
  onDelete?: (id: number) => void;
}

export function TimelineActionsCell({ timeline, onDelete }: TimelineActionsCellProps) {
  const [editOpen, setEditOpen] = useState(false);
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

          {/* Edit Button */}
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="w-full text-left"
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
          </DropdownMenuItem>

          {/* Delete Button */}
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="w-full text-left text-red-600"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <SimpleTimelineForm
        initialData={{
          title: timeline.title,
          date: timeline.startDate || new Date(),
        }}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={timeline.title}
        onConfirm={() => {
          onDelete?.(timeline.id);
          toast.success(`Timeline "${timeline.title}" deleted successfully!`);
        }}
      />
    </>
  );
}
