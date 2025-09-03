'use client';

import React, { useState } from "react";
import Header from "@/components/program/header";
import Curriculum from "@/components/program/curriculum";
import { Button } from "@/components/ui/button";
import Class from "@/components/program/class";
import OpeningProgramInformation from "@/components/program/opening-program-information";
import Timline from "@/components/program/timeline";
import Activity from "@/components/program/activity";
export default function Page() {
  const steps = [
    { title: "Opening Program Information" },
    { title: "Class" },
    { title: "Curriculum" },
    { title:"Timelne"},
    { title:"Activity"},
    { title: "Roadmap" },
  ];

  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-5 flex flex-col gap-10">
      <h1 className="text-3xl font-semibold">Opening Program Management</h1>
      
      <div className="flex flex-col items-center justify-center">
        <Header step={step} steps={steps} />
      </div>

      <div>
        {step === 1 && <OpeningProgramInformation />}
        {step === 2 && <Class />}
        {step === 3 && <Curriculum />}
        {step === 4 && <Timline/>}
        {step === 5 && <Activity/>}
        {/* TODO: add step 4, 5, 6 components later */}
      </div>

      <div className={`flex mt-6 gap-4 ${step === 1 ? "justify-end" : "justify-between"}`}>
        {step > 1 && (
          <Button variant="outline" onClick={prevStep}>Previous</Button>
        )}
        {step < steps.length ? (
          <Button variant="default" onClick={nextStep}>Next</Button>
        ) : (
          <Button variant="default" type="submit">Submit</Button>
        )}
      </div>
    </div>
  );
}
