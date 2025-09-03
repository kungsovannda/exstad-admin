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

export default function Activity() {
const fieldsStep1: Field[] = [
  { id: "activityTitle", label: "Activity Title", type: "text", placeholder: "Enter Activity Title" },
  { id: "image", label: "Image", type: "file", placeholder: "Choose file" },
  { id: "subTitle", label: "Sub Title", type: "textarea", placeholder: "Enter Sub Title" },
  { id: "fullDescription", label: "Full Description", type: "textarea", placeholder: "Enter Full Description" },
];

  
  return (
    <div className=" flex flex-col gap-10">
            <h2 className="text-[18px] font-bold text-foreground">Activity</h2>
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
