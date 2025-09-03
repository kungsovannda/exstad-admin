"use client";

import React, { useState } from "react";
import { FormField } from "@/components/program/program-information";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

type Field = {
  id: string;
  label: string;
  type?: "text" | "email" | "select" | "textarea" | "number" | "date" | "file";
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
};

export default function Class() {
  const fieldsStep1: Field[] = [
    { id: "name", label: "Class Name", type: "text", placeholder: "Enter your Class Name" },
    { id: "telegram", label: "Telegram Group Link", type: "text", placeholder: "Enter your Telegram Group Link" },
    {
      id: "shift",
      label: "Shift",
      type: "select",
      options: [
        { value: "Morning", label: "Morning" },
        { value: "Afternoon", label: "Afternoon" },
        { value: "Evening", label: "Evening" },
      ],
      placeholder: "Select a Shift",
    },
    {
      id: "instructor",
      label: "Instructor Name",
      type: "select",
      options: [
        { value: "Kim Chansokpheng", label: "Kim Chansokpheng" },
        { value: "Sreng Chipor", label: "Sreng Chipor" },
        { value: "Chan Chhaya", label: "Chan Chhaya" },
      ],
      placeholder: "Select an Instructor",
    },
    { id: "start", label: "Started Times", type: "date", placeholder: "Select Started Times" },
    { id: "end", label: "Ended Times", type: "date", placeholder: "Select Ended Times" },
  ];

  const [classes, setClasses] = useState([0]); // keep track of class forms by index
  const addClass = () => {
    setClasses((prev) => [...prev, prev.length]); // add new form
  };
  const removeClass = (index: number) => {
    setClasses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Class</h2>
        <Button onClick={addClass} variant="default" className="flex items-center gap-2.5">
          <FiPlus className="text-[18px]" />
          <span className="text-[14px] font-bold">Add Class</span>
        </Button>
      </div>
      {classes.map((_, index) => (
        <div key={index} className="mt-10 border p-4 rounded-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Class {index + 1}</h3>
            {classes.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-500"
                onClick={() => removeClass(index)}
              >
                <MdDeleteOutline className="text-lg" />
                Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldsStep1.map((field) => (
              <FormField
                key={`${index}-${field.id}`}
                id={`${field.id}-${index}`} // unique per class
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                options={field.options}
                rows={field.rows}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
