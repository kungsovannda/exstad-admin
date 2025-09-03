'use client';

import React, { useState } from "react";
import Header from "@/components/program/header";
import { FormField } from "@/components/program/program-information";
import Curriculum from "@/components/program/curriculum";
import { Button } from "@/components/ui/button";

type Field = {
  id: string;
  label: string;
  type?: "text" | "email" | "select" | "textarea"|"number"|"date"|"file";
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
};

export default function Page() {
  const [step, setStep] = useState(1);

  const fieldsStep1: Field[] = [
    { id: "Title", label: "Title", type: "text", placeholder: "Enter your program title" },
    { id: "Program Type", label: "Program Type", type: "select",
      options: [
        { value: "Short Course", label: "Short Course" },
        { value: "Scholarship", label: "Scholarship" },
      ],
      placeholder: "Select a program type",
    },
    { id: "Program Level", label: "Program Level", type: "select",
      options: [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" },
      ],
      placeholder: "Select a program level",
    },
    { id: "Visibility", label: "Visibility", type: "select",
      options: [
        { value: "Public", label: "Public" },
        { value: "Private", label: "Private" },
      ],
      placeholder: "Select a visibility",
    },
    { id: "price", label: "Price ($)", type: "number", placeholder: "0" },
    { id: "percentage", label: "Scholarship (%)", type: "number", placeholder: "0" },
    { id: "deadline", label: "Deadline", type: "date", placeholder: "Select deadline" },
    { id: "duration", label: "Duration", type: "text", placeholder: "Enter program duration" },
    { id: "image", label: "Upload image", type: "file", placeholder: "Upload program image  " },
    { id: "thumbnail", label: "Upload thumbnail", type: "file", placeholder: "Upload program thumbnail  " },
    { id: "subtitle", label:"Sub title", type: "textarea", placeholder: "Enter subtitle"},
    { id: "Description", label:"Description", type: "textarea", placeholder: "Enter description"}
  ];
  
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-5 flex flex-col gap-10">
      <h1 className="text-3xl  font-semibold">Program Management</h1>

      <div className="flex flex-col items-center justify-center">
        <Header step={step} />
      </div>

      <div className="mt-6">
        {step === 1 && (
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
        )}

        {step === 2 && <Curriculum />}
      </div>


      {/* <div className={`flex mt-6 gap-4 ${step === 1 ? "justify-end" : "justify-between"}`}>
          {step > 1 && (<button  type="button"  className="px-4 py-2 border rounded hover:bg-gray-100"  onClick={prevStep}>  Previous</button>)}
          {step < 2 ? ( <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={nextStep} > Next</button>) 
                    : (<button  type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">  Submit</button>)}
      </div> */}
      {/* Buttons */}
      <div className={`flex mt-6 gap-4 ${step === 1 ? "justify-end" : "justify-between"}`}>
        {step > 1 && (
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>
        )}

        {step < 2 ? (
          <Button variant="default" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button variant="default" type="submit">
            Submit
          </Button>
        )}
      </div>

    </div>
  );
}
