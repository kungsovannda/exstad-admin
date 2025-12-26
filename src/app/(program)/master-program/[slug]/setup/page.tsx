"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import WorkNodeEditor from "@/components/roadmap";
import { useParams } from "next/navigation";
import { useState } from "react";

import CourseRequirementsAdmin from "@/features/master-program/components/course-requirement/CourseRequirement";
import CurriculumAdmin from "@/features/master-program/components/curriculum/curriculum";
import FaqAdmin from "@/features/master-program/components/faq/faq";
import HighlightsAdmin from "@/features/master-program/components/highlight/highlight";
import LearningOutcomesAdmin from "@/features/master-program/components/learningoutcomes/LearningOutcome";
import ProgramOverviewAdmin from "@/features/master-program/components/programOverview/programOverview";

import Loader from "@/app/loading";
import { useGetMasterProgramBySlugQuery } from "@/features/master-program/masterProgramApi";
import TechnologyAdmin from "@/features/master-program/components/technology/technology";
import { formatTitle } from "@/utils/formatTitle";

export default function ProgramSetup() {
  const [tab, setTab] = useState<
    | "highlight"
    | "program-overview"
    | "curriculum"
    | "roadmap"
    | "learning-outcomes"
    | "course-requirements"
    | "faq"
    | "technology"
  >("roadmap");

  const params = useParams();
  const programSlug = params.slug as string;

  // Fetch all programs to find the one by slug
  const {
    data: program,
    isLoading,
    error,
  } = useGetMasterProgramBySlugQuery(
    { slug: programSlug },
    { skip: !programSlug }
  );

  if (isLoading) return <Loader />;
  if (error || !program)
    return (
      <div className="flex items-center justify-center text-muted-foreground h-full w-full">
        Program not found
      </div>
    );
  const programUuid = program.uuid;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">
        Master Program Setup - {formatTitle(programSlug)}
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 bg-accent p-2 rounded-[10px] w-fit cursor-pointer">
        <Button
          className="cursor-pointer"
          variant={tab === "roadmap" ? "default" : "outline"}
          onClick={() => setTab("roadmap")}
        >
          Roadmap
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "technology" ? "default" : "outline"}
          onClick={() => setTab("technology")}
        >
          Technology
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
          variant={tab === "faq" ? "default" : "outline"}
          onClick={() => setTab("faq")}
        >
          FAQ
        </Button>

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
      </div>

      {/* Tab Content */}
      {tab === "highlight" && <HighlightsAdmin programUuid={programUuid} />}
      {tab === "curriculum" && <CurriculumAdmin programUuid={programUuid} />}
      {tab === "roadmap" && (
        <div className="border rounded-2xl overflow-hidden">
          <WorkNodeEditor programUuid={programUuid} programType="programs" />
        </div>
      )}
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
      {tab === "technology" && (
        <TechnologyAdmin programSlug={programSlug} programUuid={programUuid} />
      )}
    </div>
  );
}
