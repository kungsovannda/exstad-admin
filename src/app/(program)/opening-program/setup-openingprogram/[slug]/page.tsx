"use client";

import CurriculumAdmin from "@/features/master-program/components/curriculum/curriculum";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import TimelinePage from "@/components/program/opening-program/timeline/timeline";
import Activities from "@/components/program/opening-program/activity/activities";
import ClassAdmin from "@/components/program/opening-program/class/class";
import { useGetOpeningProgramBySlugQuery } from "@/features/opening-program/openingProgramApi";

export default function ProgramSetup() {
  const [tab, setTab] = useState<
    "class" | "timeline" | "curriculum" | "roadmap" | "activities"
  >("class");

  const params = useParams();
  const programSlug = params.slug as string;

  // Fetch the opening program to get its UUID
  const { data: openingProgram, isLoading, error } = useGetOpeningProgramBySlugQuery({ slug: programSlug });

  if (isLoading) return <div>Loading program...</div>;
  if (error || !openingProgram) return <div className="text-destructive">Program not found</div>;

  const openingProgramUuid = openingProgram.uuid;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">
        Program Setup - {openingProgram.title}
      </h1>

      {/* Tab buttons */}
      <div className="flex gap-4 mb-6 bg-accent p-2 rounded-[10px] w-fit">
        <Button variant={tab === "class" ? "default" : "outline"} onClick={() => setTab("class")}>
          Class
        </Button>
        <Button variant={tab === "curriculum" ? "default" : "outline"} onClick={() => setTab("curriculum")}>
          Curriculum
        </Button>
        <Button variant={tab === "timeline" ? "default" : "outline"} onClick={() => setTab("timeline")}>
          Timeline
        </Button>
        <Button variant={tab === "roadmap" ? "default" : "outline"} onClick={() => setTab("roadmap")}>
          Roadmap
        </Button>
        <Button variant={tab === "activities" ? "default" : "outline"} onClick={() => setTab("activities")}>
          Activity
        </Button>
      </div>

      {/* Tab Content */}
      {tab === "class" && <ClassAdmin openingProgramUuid={openingProgramUuid} />}
      {tab === "curriculum" && <CurriculumAdmin programUuid={openingProgramUuid} />}
      {tab === "roadmap" && <div>🚀 Roadmap Component</div>}
      {tab === "timeline" && <TimelinePage openingProgramUuid={openingProgramUuid} />}
      {tab === "activities" && <Activities openingProgramUuid={openingProgramUuid} />}
    </div>
  );
}
