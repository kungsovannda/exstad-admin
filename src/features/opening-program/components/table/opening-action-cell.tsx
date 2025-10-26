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
import { FileInput, MoreHorizontal, Settings2, SquarePen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteOpeningProgramMutation, useSoftdeleteOpeningProgramMutation } from "../../openingProgramApi";
import ModalDelete from "@/components/modal/ModalDelete";

interface ActionsCellProps {
  openingprogram: openingProgramType;
  onDelete?: (id: number) => void;
}

export function OpeningActionsCell({ openingprogram }: ActionsCellProps) {
  const router = useRouter();
  // const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteOpeningProgram] = useSoftdeleteOpeningProgramMutation();
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
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only ">Open menu</span>
            <MoreHorizontal className="h-4 w-4 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/opening-program/${openingprogram.slug}` ) }><FileInput size={16} className="text-primary-hover " />View</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/opening-program/${openingprogram.slug}/setup` ) }><Settings2 size={16} className="text-primary-hover " />Set Up  </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/opening-program/${openingprogram.slug}/edit`)}><SquarePen size={16} className="text-primary-hover "/>Edit</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-destructive " onClick={() => setDeleteOpen(true)}><Trash size={16} className="text-destructive "/>Delete</DropdownMenuItem>      
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${openingprogram.programName}?`}
        description={`Are you sure you want to delete ${openingprogram.programName}? This action can not be undone `}
        onDelete={handleDelete}
      />
    </>
  );
}
