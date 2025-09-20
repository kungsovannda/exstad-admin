"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { MasterProgramType } from "@/types/program";
import { useDeleteMasterProgramMutation } from "../../masterProgramApi";

interface ActionsCellProps {
  program: MasterProgramType;
}

export function MasterActionsCell({ program }: ActionsCellProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMasterProgram] = useDeleteMasterProgramMutation();

  const handleDelete = async () => {
    try {
      await deleteMasterProgram(program.uuid).unwrap();
      toast.success(`Program "${program.title}" deleted successfully!`);
      setDeleteOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete: ${message || err}`);
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
          <DropdownMenuItem onClick={() => router.push(`/master-program/setup-masterprogram/${program.slug}`)}>
            Set Up
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/master-program/edit/${program.slug}`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal open={deleteOpen} onOpenChange={setDeleteOpen} itemName={program.title} onConfirm={handleDelete} />
    </>
  );
}
