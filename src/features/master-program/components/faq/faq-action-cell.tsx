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
import { ClassType } from "@/types/opening-program";
import { MoreHorizontal } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

interface ClassActionsCellProps {
  classData: ClassType;
}

export function FaqActionsCell({ classData }: ClassActionsCellProps) {
  // const router = useRouter();
  // const [open, setOpen] = useState(false);

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
        <DropdownMenuItem onClick={() => console.log("Edit class", classData.uuid)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => console.log("Delete class", classData.uuid)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
