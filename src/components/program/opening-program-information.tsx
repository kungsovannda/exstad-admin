'use client';

import React from "react";
import { FormField } from "@/components/program/program-information";

type Field = {
  id: string;
  label: string;
  type?: "text" | "email" | "select" | "textarea"|"number"|"date"|"file";
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
};

export default function OpeningProgramInformation() {
  const fieldsStep1: Field[] = [
    { id: "Title", label: "Opening Program Title", type: "text", placeholder: "Enter your Opening Program Title" },
    { id: "Telegram", label: "Telegram Group Link", type: "text", placeholder: "Enter your Telegram Group Link" },
    { id: "Program Type", label: "Program Type", type: "select",
      options: [
        { value: "Short Course", label: "Short Course" },
        { value: "Scholarship", label: "Scholarship" },
      ],
      placeholder: "Select a program type",
    },
    { id: "generation", label: "Generation", type: "number", placeholder: "0" },
    { id: "image", label: "Upload image", type: "file", placeholder: "Upload program image  " },
    { id: "thumbnail", label: "Upload thumbnail", type: "file", placeholder: "Upload program thumbnail  " },
    { id: "subtitle", label:"Sub title", type: "textarea", placeholder: "Enter subtitle"},
    { id: "Description", label:"Description", type: "textarea", placeholder: "Enter description"}
  ];
  
  return (
    <div className=" flex flex-col gap-10">
            <h2 className="text-[18px] font-bold text-foreground">Opening Program Information</h2>
      <div >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldsStep1.map((field) => (
              <FormField
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                options={field.options}
                rows={field.rows}
              />
            ))}
          </div>
      </div>

    </div>
  );
}
