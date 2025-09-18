'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { TimelineType } from "@/types/opening-program";

interface TimelineActionsCellProps {
  timelines: TimelineType;
  onDelete?: (t: TimelineType) => void;
  onEdit?: (t:TimelineType) => void;
}

export function TimelineActionsCell({ timelines, onDelete ,onEdit}: TimelineActionsCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0"
                onPointerDown={(e) => e.stopPropagation()} // ✅ Prevent drag interference
                >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end"
            onPointerDown={(e) => e.stopPropagation()} >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit?.(timelines)}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={() => setDeleteOpen(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={timelines.title}
        onConfirm={async () => {
          try {
            if (onDelete) await onDelete(timelines);
            setDeleteOpen(false);
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(`Failed to delete timeline: ${message || err}`);
          }
        }}
      />
    </>
  );
}
