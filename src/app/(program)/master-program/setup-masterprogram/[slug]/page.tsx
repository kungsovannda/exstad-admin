"use client";

import Curriculum from "@/components/program/curriculum";
import Faq from "@/components/program/master-program/faq/faq";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {  useParams } from "next/navigation";
import LearningOutcomesAdmin from "@/components/program/opening-program/learning-outcome";
import CourseRequirementsAdmin from "@/components/program/opening-program/course-requirement";


export default function ProgramSetup() {
  const [tab, setTab] = useState<"curriculum" | "roadmap"|"learning-outcomes" | "course-requirements"|"hightlight"|  "faq">("curriculum");
  const params = useParams(); // app router
  const slug = params.slug;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Program Setup - {slug}</h1>
      {/* Tab buttons */}
      <div className="flex gap-4 mb-6 bg-accent p-2 rounded-[10px] w-fit">
        <Button variant={tab === "hightlight" ? "default" : "outline"} onClick={() => setTab("hightlight")}> Hightlight </Button>
        <Button variant={tab === "learning-outcomes" ? "default" : "outline"} onClick={() => setTab("learning-outcomes")}> Learning Outcomes </Button>
        <Button variant={tab === "course-requirements" ? "default" : "outline"} onClick={() => setTab("course-requirements")}> Course Requirements </Button>
        <Button variant={tab === "curriculum" ? "default" : "outline"} onClick={() => setTab("curriculum")}>Curriculum </Button>
        <Button variant={tab === "roadmap" ? "default" : "outline"} onClick={() => setTab("roadmap")}>  Roadmap </Button>
        <Button variant={tab === "faq" ? "default" : "outline"} onClick={() => setTab("faq")}>  FAQ </Button>
      </div>

      {/* Tab Content */}
      {tab === "curriculum" && <Curriculum />}
      {tab === "roadmap" && <div>🚀 Roadmap Component</div>}
      {tab === "faq" && <Faq />}
      {tab === "learning-outcomes" && <LearningOutcomesAdmin />}
      {tab === "course-requirements" && <CourseRequirementsAdmin/>}
      {tab === "hightlight" && <div>🌟 Hightlight Component</div>}
    </div>
  );
}
