"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { openingProgramType } from "@/types/openingProgramType";
import { FormField } from "./opening-form-field";

interface OpeningProgramModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  openingprogram: openingProgramType;
}

export function EditOpeningProgramModal({ open, setOpen, openingprogram }: OpeningProgramModalProps) {
  const [formData, setFormData] = useState<Partial<openingProgramType>>({});

  useEffect(() => {
    if (openingprogram) setFormData(openingprogram);
  }, [openingprogram]);

  const handleChange = <K extends keyof openingProgramType>(id: K, value: string | number) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const fields: {
    id: keyof openingProgramType;
    label: string;
    type: "text" | "number" | "textarea" |  "select" | "email" | "date";
    options?: { value: string; label: string }[];
  }[] = [
    { id: "title", label: "Opening Program Title", type: "text" },
    { id: "generation", label: "Generation", type: "number" },
    { id: "description", label: "Description", type: "textarea" },
    { id: "slug", label: "Slug", type: "text" },
  ];

  const handleSubmit = () => {
    console.log("Updated Opening Program:", formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Opening Program</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {fields.map((field) => (
            <FormField
              key={field.id}
              id={field.id as string}
              label={field.label}
              type={field.type}
              value={formData[field.id] as string | number}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleChange(field.id, e.target.value)
              }
              options={field.options}
            />
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



// withou the prefilled 




// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { openingProgramType } from "@/types/openingProgramType";
// import { FormField } from "@/components/program/program-information";

// type Field = {
//   id: string;
//   label: string;
//   type?: "text" | "email" | "select" | "textarea" | "number" | "date" | "file";
//   placeholder?: string;
//   options?: { value: string; label: string }[];
//   rows?: number;
// };

// interface OpeningProgramModalProps {
//   open: boolean;
//   setOpen: (open: boolean) => void;
//   openingprogram: openingProgramType;
// }

// export function EditOpeningProgramModal({
//   open,
//   setOpen,
//   openingprogram,
// }: OpeningProgramModalProps) {
//   const fieldsStep1: Field[] = [
//     {
//       id: "Title",
//       label: "Opening Program Title",
//       type: "text",
//       placeholder: "Enter your Opening Program Title",
//     },
//     {
//       id: "Telegram",
//       label: "Telegram Group Link",
//       type: "text",
//       placeholder: "Enter your Telegram Group Link",
//     },
//     {
//       id: "Program Type",
//       label: "Program Type",
//       type: "select",
//       options: [
//         { value: "Short Course", label: "Short Course" },
//         { value: "Scholarship", label: "Scholarship" },
//       ],
//       placeholder: "Select a program type",
//     },
//     { id: "generation", label: "Generation", type: "number", placeholder: "0" },
//     {
//       id: "image",
//       label: "Upload image",
//       type: "file",
//       placeholder: "Upload program image",
//     },
//     {
//       id: "thumbnail",
//       label: "Upload thumbnail",
//       type: "file",
//       placeholder: "Upload program thumbnail",
//     },
//     {
//       id: "subtitle",
//       label: "Sub title",
//       type: "textarea",
//       placeholder: "Enter subtitle",
//     },
//     {
//       id: "Description",
//       label: "Description",
//       type: "textarea",
//       placeholder: "Enter description",
//     },
//   ];

//   const handleSubmit = () => {
//     console.log("Save Opening Program", openingprogram);
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="sm:max-w-3xl">
//         <DialogHeader>
//           <DialogTitle>Edit Opening Program</DialogTitle>
//         </DialogHeader>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//           {fieldsStep1.map((field) => (
//             <FormField key={field.id} {...field} />
//           ))}
//         </div>

//         <DialogFooter className="mt-4">
//           <Button type="button" onClick={handleSubmit}>
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
