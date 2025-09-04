"use client";

import React from "react";
import { FormField } from "@/components/program/program-information";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { programType } from "@/types/programs";

type Field = {
  id: string;
  label: string;
  type?: "text" | "email" | "select" | "textarea" | "number" | "date" | "file" | "color";
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
};

interface EditProgramModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  program:programType; // or programType
}

export function EditProgramModal({ open, setOpen, program }: EditProgramModalProps) {
  const fieldsStep1: Field[] = [
    { id: "Title", label: "Title", type: "text", placeholder: "Enter your program title" },
    {
      id: "Program Type",
      label: "Program Type",
      type: "select",
      options: [
        { value: "Short Course", label: "Short Course" },
        { value: "Scholarship", label: "Scholarship" },
      ],
      placeholder: "Select a program type",
    },
    {
      id: "Program Level",
      label: "Program Level",
      type: "select",
      options: [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" },
      ],
      placeholder: "Select a program level",
    },
    { id: "price", label: "Price ($)", type: "number", placeholder: "0" },
    { id: "percentage", label: "Scholarship (%)", type: "number", placeholder: "0" },
    { id: "duration", label: "Duration", type: "text", placeholder: "Enter program duration" },
    { id: "subtitle", label: "Sub title", type: "textarea", placeholder: "Enter subtitle" },
    { id: "Description", label: "Description", type: "textarea", placeholder: "Enter description" },
  ];

  const handleSubmit = () => {
    console.log("Save program", program);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {fieldsStep1.map((field) => (
            <FormField key={field.id} {...field} />
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
