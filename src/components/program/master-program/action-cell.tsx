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
import { programType } from "@/types/program";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteModal from "../activity/delete-modal-component";
import { toast } from "sonner";


interface ActionsCellProps {
  program: programType;
  onDelete?: (id: number) => void; // callback to remove class from parent state
}

export function MasterActionsCell({ program,onDelete  }: ActionsCellProps) {
  const router = useRouter();
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
        <DropdownMenuItem onClick={() => router.push(`/master-program/setup-masterprogram/${program.slug}`)}> Set Up</DropdownMenuItem>
        <DropdownMenuItem onClick={() =>  router.push(`/master-program/create`)}> Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteOpen(true)}> Delete</DropdownMenuItem>
      </DropdownMenuContent>    
    </DropdownMenu>
    {/* Delete Modal */}
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={program.title}
        onConfirm={() =>{
          onDelete?.(program.id); // call parent callback
          toast.success(`Program "${program.title}" deleted successfully!`);
        }}
      />
        </>
  );
}
