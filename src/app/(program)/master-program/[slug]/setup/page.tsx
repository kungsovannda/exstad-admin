"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import React from "react";
import WorkNodeEditor from "@/components/roadmap";


import HighlightsAdmin from "@/features/master-program/components/highlight/highlight";
import CurriculumAdmin from "@/features/master-program/components/curriculum/curriculum";
import FaqAdmin from "@/features/master-program/components/faq/faq";
import LearningOutcomesAdmin from "@/features/master-program/components/learningoutcomes/LearningOutcome";
import CourseRequirementsAdmin from "@/features/master-program/components/course-requirement/CourseRequirement";
import ProgramOverviewAdmin from "@/features/master-program/components/programOverview/programOverview";

import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";

export default function ProgramSetup() {

  const [tab, setTab] = useState<
    | "highlight"
    | "program-overview"
    | "curriculum"
    | "roadmap"
    | "learning-outcomes"
    | "course-requirements"
    | "faq"
  >("highlight");

  const params = useParams();
  const programSlug = params.slug as string;

  // Fetch all programs to find the one by slug
  const { data: programs, isLoading, error } = useGetAllMasterProgramsQuery();
  const program = programs?.find((p) => p.slug === programSlug);

  if (isLoading) return <div>Loading program...</div>;
  if (error || !program) return <div>Program not found</div>;

  const programUuid = program.uuid;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">
        Program Setup - {programSlug}
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 bg-accent p-2 rounded-[10px] w-fit cursor-pointer">
        <Button
          className="cursor-pointer"
          variant={tab === "highlight" ? "default" : "outline"}
          onClick={() => setTab("highlight")}
        >
          Highlight
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "program-overview" ? "default" : "outline"}
          onClick={() => setTab("program-overview")}
        >
          Program Overview
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "learning-outcomes" ? "default" : "outline"}
          onClick={() => setTab("learning-outcomes")}
        >
          Learning Outcomes
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "course-requirements" ? "default" : "outline"}
          onClick={() => setTab("course-requirements")}
        >
          Course Requirements
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "curriculum" ? "default" : "outline"}
          onClick={() => setTab("curriculum")}
        >
          Curriculum
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "roadmap" ? "default" : "outline"}
          onClick={() => setTab("roadmap")}
        >
          Roadmap
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "faq" ? "default" : "outline"}
          onClick={() => setTab("faq")}
        >
          FAQ
        </Button>
      </div>

      {/* Tab Content */}
      {tab === "highlight" && <HighlightsAdmin programUuid={programUuid} />}
      {tab === "curriculum" && <CurriculumAdmin programUuid={programUuid} />}
      {tab === "roadmap" &&<div className="border rounded-2xl"><WorkNodeEditor/></div> }
      {tab === "faq" && <FaqAdmin programUuid={programUuid} />}
      {tab === "learning-outcomes" && (
        <LearningOutcomesAdmin programUuid={programUuid} />
      )}
      {tab === "course-requirements" && (
        <CourseRequirementsAdmin programUuid={programUuid} />
      )}
      {tab === "program-overview" && (
        <ProgramOverviewAdmin programUuid={programUuid} />
      )}
    </div>
  );
}
