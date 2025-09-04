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
import { useRouter } from "next/navigation";
import { programType } from "@/types/programs";
import { EditProgramModal } from "./edit-program-modal";
import { useState } from "react";


interface ActionsCellProps {
  program: programType;
  
}

export function MasterActionsCell({ program }: ActionsCellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
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
        <DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => console.log("Delete", program)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>    
        {/* Edit modal */}
      <EditProgramModal open={open} setOpen={setOpen} program={program} />
    </DropdownMenu>
  );
}
