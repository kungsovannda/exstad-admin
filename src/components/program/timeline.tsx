'use client';

import React, { useState } from "react";
import Header from "@/components/program/header";
import { FormField } from "@/components/program/program-information";
import { Button } from "@/components/ui/button";
import Class from "@/components/program/class";

type Field = {
  id: string;
  label: string;
  type?: "text" | "email" | "select" | "textarea"|"number"|"date"|"file";
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
};

export default function Timline() {
const fieldsStep1: Field[] = [
  { id: "applicationPeriod", label: "Application Period", type: "date", placeholder: "Select date" },
  { id: "preliminaryLearning", label: "Preliminary Learning", type: "date", placeholder: "Select date" },
  { id: "applicationList", label: "Application List", type: "date", placeholder: "Select date" },
  { id: "orientation", label: "Orientation", type: "date", placeholder: "Select date" },
  { id: "writingTest", label: "Writing Test", type: "date", placeholder: "Select date" },
  { id: "courseTraining", label: "Course Training", type: "date", placeholder: "Select date" },
  { id: "interviewTest", label: "Interview Test", type: "date", placeholder: "Select date" },
  { id: "finalProject", label: "Final Project", type: "date", placeholder: "Select date" },
  { id: "finalResult", label: "Final Result", type: "date", placeholder: "Select date" },
  { id: "closingDay", label: "Closing Day", type: "date", placeholder: "Select date" },
];

  return (
    <div className=" flex flex-col gap-10">
    <h2 className="text-[18px] font-bold text-foreground">Timeline</h2>
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
