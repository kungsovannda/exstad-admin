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

const openingPrograms: openingProgramType[] = [
  {
    id: 1,
    title: "Full Stack Developments",
    generation: 1,
    description: "Description for Opening Program 1",
    image: "image1.jpg",
    shortcourseimage: "shortcourse1.jpg",
    qrimage: "qrimage1.jpg",
    activities: [],
    timeline: [],
    classes: [],
    slug: "full-stack-developments-generation-1",
    programType: "type1",
  },
  {
    id: 2,
    title: "Foundation",
    generation: 5,
    description: "Description for Opening Program 2",
    image: "image2.jpg",
    shortcourseimage: "shortcourse2.jpg",
    qrimage: "qrimage2.jpg",
    activities: [],
    timeline: [],
    classes: [],
    slug: "foundation-generation-5",
    programType: "type1",
  },
  {
    id: 3,
    title: "Pre-University",
    generation: 6,
    description: "Description for Opening Program 3",
    image: "image3.jpg",
    shortcourseimage: "shortcourse3.jpg",
    qrimage: "qrimage3.jpg",
    activities: [],
    timeline: [],
    classes: [],
    slug: "pre-university-generation-6",
    programType: "type1",
  },
];


export default function Page() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleNext = () => {
    if (!selected) return;
    router.push(`/certificate/${selected}`);
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
                  <SelectItem key={program.id} value={program.slug}>
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
