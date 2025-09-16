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
import { openingProgramType } from "@/types/opening-program";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { useDeleteOpeningProgramMutation } from "../../openingProgramApi";

interface ActionsCellProps {
  openingprogram: openingProgramType;
  onDelete?: (id: number) => void;
}

export function OpeningActionsCell({ openingprogram }: ActionsCellProps) {
  const router = useRouter();
  // const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteOpeningProgram] = useDeleteOpeningProgramMutation();
  
    const handleDelete = async () =>  {
      try{
        await deleteOpeningProgram(openingprogram.uuid).unwrap();
        toast.success(`Program "${openingprogram.title}" delete successfully!`);
        setDeleteOpen(false);
      }catch(err:unknown){
        const message = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to delete: ${message || err}`);
      }
    }

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
          <DropdownMenuItem onClick={() => router.push(`/opening-program/setup-openingprogram/${openingprogram.uuid}` ) }>  Set Up  </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/opening-program/edit/${openingprogram.uuid}`)}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600"onClick={() => setDeleteOpen(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={openingprogram.title}
        onConfirm={handleDelete}
      />
    </>
  );
}
