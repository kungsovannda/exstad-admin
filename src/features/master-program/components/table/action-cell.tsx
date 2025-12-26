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
import { MoreHorizontal, Settings2, SquarePen, Trash } from "lucide-react";
import { toast } from "sonner";
import { MasterProgramType } from "@/types/program";
import {  useSoftDeleteMasterProgramMutation } from "../../masterProgramApi";
import ModalDelete from "@/components/modal/ModalDelete";

interface ActionsCellProps {
  program: MasterProgramType;
}

export function MasterActionsCell({ program }: ActionsCellProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMasterProgram] = useSoftDeleteMasterProgramMutation();

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
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/master-program/${program.slug}/setup`)}>
            <Settings2 size={16} className="text-primary-hover " />Set Up
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/master-program/${program.slug}`)}>
            <SquarePen size={16} className="text-primary-hover "/>Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => setDeleteOpen(true)}>
            <Trash size={16} className="text-destructive "/>Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalDelete 
      open={deleteOpen} 
      onOpenChange={setDeleteOpen} 
      title={`Delete ${program.title}?`}
      description={`Are you sure you want to delete ${program.title}? This action can not be undone `}
      onDelete={handleDelete} />
    </>
  );
}
