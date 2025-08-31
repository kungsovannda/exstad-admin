import React from "react";
import Header from "@/components/program/header";
import { FormField } from "@/components/program/form-field";

type Field = {
  id: string;
  label: string;
  type?: "text" | "email" | "select" | "textarea"|"number"|"date"|"file";
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number; // for textarea height
};

export default function Page() {
  const fields: Field[] = [
    { id: "Title", label: "Title", type: "text", placeholder: "Enter your program title" },
    {id: "Program Type",label: "Program Type",type: "select",
        options: [
        { value: "Short Course", label: "Short Course" },
        { value: "Scholarship", label: "Scholarship" },],
      placeholder: "Select a program type",
    },
    {id: "Program Level",label: "Program Level",type: "select",
        options: [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
         { value: "Advanced", label: "Advanced" },],
      placeholder: "Select a program type",
    },
    {id: "Visibility",label: "Visibility",type: "select",
        options: [
        { value: "Public", label: "Public" },
        { value: "Private", label: "Private" },],
      placeholder: "Select a visibility",
    },
    { id: "price", label: "Price ($)", type: "number", placeholder: "0"},
    { id: "percentage", label: "Scholarship (%)", type: "number", placeholder: "0" },
    { id: "deadline", label: "Deadline", type: "date", placeholder: "Select deadline" },
    { id: "duration", label: "Duration", type: "text", placeholder: "Enter program duration"},
    { id: "slot", label: "Number of Student", type: "number", placeholder: "Enter total number of student"},
    { id: "file", label: "Thumbnail", type: "file", placeholder: "Choose program thumbnail"},
    { id: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Enter subtitle", rows: 2 },
    { id: "description", label: "Description", type: "textarea", placeholder: "Enter description", rows: 5 },
  ];

  return (
    <div className="p-5 flex flex-col gap-10 ">
      <h1 className="text-3xl font-semibold">Program</h1>

      <div className="flex flex-col items-center justify-center">
        <Header />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <FormField
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            options={field.options}
          />
        ))}
      </div>
      
    </div>
  );
}
