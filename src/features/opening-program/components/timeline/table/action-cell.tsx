'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DeleteModal from "@/features/master-program/components/delete-modal-component";
import { TimelineType } from "@/types/opening-program";
import ModalDelete from "@/components/modal/ModalDelete";

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
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer"
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
          <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit?.(timelines)}><SquarePen size={16} className="text-primary-hover "/>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => setDeleteOpen(true)}><Trash size={16} className="text-destructive "/>Delete</DropdownMenuItem>               
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${timelines.title}?`}
        description={`Are you sure you want to delete ${timelines.title}? This action can not be undone `}
        onDelete={async () => {
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
