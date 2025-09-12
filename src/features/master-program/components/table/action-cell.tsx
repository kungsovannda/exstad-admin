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
import { MasterProgramType } from "@/types/program";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { toast } from "sonner";
import { useDeleteMasterProgramMutation } from "../../masterProgramApi";


interface ActionsCellProps {
  program: MasterProgramType;
  onDelete?: (id: number) => void; // callback to remove class from parent state
}

export function MasterActionsCell({ program,onDelete  }: ActionsCellProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMasterProgram] = useDeleteMasterProgramMutation();

  const handleDelete = async () =>  {
    try{
      await deleteMasterProgram(program.uuid).unwrap();
      toast.success(`Program "${program.title}" delete successfully!`);
      setDeleteOpen(false);
    }catch(err:any){
      toast.error(`Failed to delete: ${err.message || err}`);
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
        <DropdownMenuItem onClick={() => router.push(`/master-program/setup-masterprogram/${program.uuid}`)}> Set Up</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/master-program/edit/${program.uuid}`)}> Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteOpen(true)}> Delete</DropdownMenuItem>
      </DropdownMenuContent>    
    </DropdownMenu>
    {/* Delete Modal */}
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={program.title}
        onConfirm={handleDelete}  
      />
        </>
  );
}
