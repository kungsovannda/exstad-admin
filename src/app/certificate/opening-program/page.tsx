"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { openingProgramType } from "@/types/opening-program";
import { Button } from "@/components/ui/button";
import { openingProgramData } from "@/data/openingProgramData";

const openingPrograms: openingProgramType[] = openingProgramData; 

export default function Page() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleNext = () => {
    if (!selected) return;
    router.push(`/certificate/opening-program/${selected}`);
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-[90vh]">
      <div className="flex flex-col w-full max-w-sm gap-8 bg-accent p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center">Choose a Program</h1>
        <div className="flex flex-col gap-4">
          <h3 className="text-md">Program</h3>
          <Select
            name="program"
            value={selected}
            onValueChange={(v) => setSelected(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Programs</SelectLabel>
                {openingPrograms.map((program) => (
                  <SelectItem key={program.uuid} value={program.slug}>
                    {program.title} - Generation {program.generation}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
