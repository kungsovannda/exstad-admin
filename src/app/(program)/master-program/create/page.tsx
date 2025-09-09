"use client";

import React from "react";
// import { useRouter } from "next/navigation";
import MyForm from "./form-field";

// type Field = {
//   id: string;
//   label: string;
//   type?: "text" | "email" | "select" | "textarea" | "number" | "date" | "file"|"color";
//   placeholder?: string;
//   options?: { value: string; label: string }[];
//   rows?: number;
// };

export default function Page() {
  //  const router = useRouter();

  // const handleSubmit = () => {
  //   // TODO: Save program via API
  //   router.push("/master-program"); // go back to table after creating
  // }; 
  // const fieldsStep1: Field[] = [
  //   { id: "Title", label: "Title", type: "text", placeholder: "Enter your program title" },
  //   // { id:"programColor", label:"Program Color", type:"color" },
  //   {
  //     id: "Program Type",
  //     label: "Program Type",
  //     type: "select",
  //     options: [
  //       { value: "Short Course", label: "Short Course" },
  //       { value: "Scholarship", label: "Scholarship" },
  //     ],
  //     placeholder: "Select a program type",
  //   },
  //   {
  //     id: "Program Level",
  //     label: "Program Level",
  //     type: "select",
  //     options: [
  //       { value: "Beginner", label: "Beginner" },
  //       { value: "Intermediate", label: "Intermediate" },
  //       { value: "Advanced", label: "Advanced" },
  //     ],
  //     placeholder: "Select a program level",
  //   },
  //   {
  //     id: "Visibility",
  //     label: "Visibility",
  //     type: "select",
  //     options: [
  //       { value: "Public", label: "Public" },
  //       { value: "Private", label: "Private" },
  //     ],
  //     placeholder: "Select a visibility",
  //   },
  //   { id: "price", label: "Price ($)", type: "number", placeholder: "0" },
  //   { id: "percentage", label: "Scholarship (%)", type: "number", placeholder: "0" },
  //   { id: "duration", label: "Duration", type: "text", placeholder: "Enter program duration" },
  //   { id: "image", label: "Upload Logo", type: "file", placeholder: "Upload program image" },
  //   { id: "subtitle", label: "Sub title", type: "textarea", placeholder: "Enter subtitle" },
  //   { id: "Description", label: "Description", type: "textarea", placeholder: "Enter description" },
  // ];

  
  return (
    <div className="p-5 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Create Program</h1>
      <div className="w-[70%]">
      <MyForm />
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep1.map((field) => (
          <FormField key={field.id} {...field} />
        ))}
      </div> */}
{/* 
      <div className="flex justify-end mt-6">
         <Button type="button" onClick={handleSubmit}> Save </Button>
      </div> */}
    </div>
  );
}
