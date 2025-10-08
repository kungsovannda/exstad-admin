"use client";

  import { useState, useMemo } from "react";
  import { useParams } from "next/navigation";
  import { Button } from "@/components/ui/button";
  import React from "react";
import RoadmapEditor from "@/components/roadmap";

  import ClassAdmin from "@/components/program/opening-program/class/class";
  import TimelinePage from "@/components/program/opening-program/timeline/timeline";
  import Activities from "@/components/program/opening-program/activity/activities";
  import CurriculumAdmin from "@/features/master-program/components/curriculum/curriculum";
  import {
    useGetOpeningProgramBySlugQuery,
  } from "@/features/opening-program/openingProgramApi";
  import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
  export default function OpeningProgramSetup() {
     interface Roadmap {
      // Define the structure of the roadmap object as needed
      [key: string]: unknown;
    }

    const handleSave = (roadmap: Roadmap): void => {
      // Do something with the roadmap JSON, e.g., send to API or store in state
      console.log("Saved roadmap:", roadmap);
    };
    const [tab, setTab] = useState<
      "class" | "timeline" | "curriculum" | "roadmap" | "activities"
    >("class");

  const params = useParams();
  const programSlug = params.slug as string;

  // Fetch opening program by slug
  const { data: openingProgram, isLoading, error } = useGetOpeningProgramBySlugQuery({ slug: programSlug });

  // Fetch all master programs
  const { data: masterPrograms } = useGetAllMasterProgramsQuery();

  // Find the corresponding master program dynamically
  const masterProgram = useMemo(() => {
    if (!masterPrograms || !openingProgram) return undefined;
    return masterPrograms.find(p => p.title === openingProgram.programName);
  }, [masterPrograms, openingProgram]);

  if (isLoading) return <div>Loading program...</div>;
  if (error || !openingProgram) return <div className="text-destructive">Program not found</div>;
  if (!masterProgram) {
    console.warn("Master program not found for opening program:", openingProgram.programName);
    return <div className="text-destructive">Master program not found!</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Program Setup - {openingProgram.title}</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 bg-accent p-2 rounded-[10px] w-fit">
        {["class", "curriculum", "timeline", "roadmap", "activities"].map((t) => (
          <Button
            key={t}
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t as typeof tab)}
            className="cursor-pointer"
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "class" && (
        <ClassAdmin
          openingProgramTitle={openingProgram.title}
          openingProgramUuid={openingProgram.uuid}
        />
      )}

      {tab === "curriculum" && (
        <CurriculumAdmin
          programUuid={masterProgram.uuid}          // master program
          openingProgramUuid={openingProgram.uuid} // opening program
        />
      )}

        {tab === "roadmap" &&<div className="rounded-2xl border-1"><RoadmapEditor onSave={handleSave} /></div>}
        {tab === "timeline" && <TimelinePage openingProgramUuid={openingProgramUuid} />}
        {tab === "activities" && <Activities openingProgramUuid={openingProgramUuid} />}
      </div>
    );
  }
