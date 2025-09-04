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
import { useState } from "react";
import { openingProgramType } from "@/types/openingProgramType";
import { EditOpeningProgramModal } from "./edit-opening-program-modal";


interface ActionsCellProps {
  openingprogram: openingProgramType;
  
}

export function OpeningActionsCell({ openingprogram }: ActionsCellProps) {
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
        <DropdownMenuItem onClick={() => router.push(`/opening-program/setup-openingprogram/${openingprogram.slug}`)}>
          Set Up
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/opening-program/create`)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => console.log("Delete", openingprogram)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>    
    </DropdownMenu>
  );
}
