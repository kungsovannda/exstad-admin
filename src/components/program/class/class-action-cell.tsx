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
import { Classes } from "@/types/opening-program";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ClassModal1 from "./form-field";

interface ClassActionsCellProps {
  classData: Classes;
}

export function ClassActionsCell({ classData }: ClassActionsCellProps) {
  const [open, setOpen] = useState(false);

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
          <DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => console.log("Delete class", classData.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClassModal1
        initialData={{
          className: classData.title,
          classCode: classData.classCode,
          room: classData.room,
          shift: classData.shift,
          instructor: classData.instructor,
          start: classData.startTime,
          end: classData.endTime,
        }}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
