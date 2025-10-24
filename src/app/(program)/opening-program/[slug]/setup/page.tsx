"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import ClassAdmin from "@/features/opening-program/components/class/Class";
import TimelinePage from "@/features/opening-program/components/timeline/Timeline";
import ActivityAdmin from "@/features/opening-program/components/activity/Activity";
import CurriculumAdmin from "@/features/master-program/components/curriculum/curriculum";
import { useGetOpeningProgramBySlugQuery } from "@/features/opening-program/openingProgramApi";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import Loader from "@/app/loading";
import WorkNodeEditor from "@/components/roadmap";

export default function OpeningProgramSetup() {
  const [tab, setTab] = useState<
    "class" | "timeline" | "curriculum" | "roadmap" | "activities"
  >("class");

  const params = useParams();
  const programSlug = params.slug as string;

  // Fetch opening program by slug
  const {
    data: openingProgram,
    isLoading,
    error,
  } = useGetOpeningProgramBySlugQuery({ slug: programSlug });

  // Fetch all master programs
  const { data: masterPrograms } = useGetAllMasterProgramsQuery();

  // Find the corresponding master program dynamically
  const masterProgram = useMemo(() => {
    if (!masterPrograms || !openingProgram) return undefined;
    return masterPrograms.find((p) => p.title === openingProgram.programName);
  }, [masterPrograms, openingProgram]);

  if(isLoading) return <Loader/>
  if (error || !openingProgram)
    return <div className="flex items-center justify-center text-muted-foreground h-full w-full">Program not found</div>;
  if (!masterProgram) {
    console.warn(
      "Master program not found for opening program:",
      openingProgram.programName
    );
    return <div className="text-destructive">Master program not found!</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">
        Program Setup - {openingProgram.title}
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 bg-accent p-2 rounded-[10px] w-fit">
        {["class", "curriculum", "timeline", "roadmap", "activities"].map(
          (t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              onClick={() => setTab(t as typeof tab)}
              className="cursor-pointer"
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          )
        )}
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
          programUuid={masterProgram.uuid} // master program
          openingProgramUuid={openingProgram.uuid} // opening program
        />
      )}

      {tab === "roadmap" && (
        <div className="border rounded-2xl overflow-hidden">
          <WorkNodeEditor masterProgramUuid={masterProgram.uuid} programUuid={openingProgram.uuid} programType="opening-programs" />
        </div>
      )}
      {tab === "timeline" && (
        <TimelinePage openingProgramUuid={openingProgram.uuid} />
      )}
      {tab === "activities" && (
        <ActivityAdmin
          openingProgram={openingProgram} // pass full object
          masterProgram={masterProgram} // pass full object
        />
      )}
    </div>
  );
}
