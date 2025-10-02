  "use client";

  import { useState, useMemo } from "react";
  import { useParams } from "next/navigation";
  import { Button } from "@/components/ui/button";

  import ClassAdmin from "@/components/program/opening-program/class/class";
  import TimelinePage from "@/components/program/opening-program/timeline/timeline";
  import Activities from "@/components/program/opening-program/activity/activities";
  import CurriculumAdmin from "@/features/master-program/components/curriculum/curriculum";
  import {
    useGetOpeningProgramBySlugQuery,
  } from "@/features/opening-program/openingProgramApi";
  import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
  export default function OpeningProgramSetup() {
    const [tab, setTab] = useState<
      "class" | "timeline" | "curriculum" | "roadmap" | "activities"
    >("class");

    const params = useParams();
    const programSlug = params.slug as string;

    // Fetch opening program by slug
    const { data: openingProgram, isLoading, error } = useGetOpeningProgramBySlugQuery(
      { slug: programSlug }
    );

    // Fetch all master programs to find fallback
    const { data: masterPrograms } = useGetAllMasterProgramsQuery();

    // Find matching master program by title (always call hook)
    const masterProgram = useMemo(
      () => {
        // openingProgram may be undefined before loading
        if (!masterPrograms || !openingProgram) return undefined;
        return masterPrograms.find(p => p.title === openingProgram.programName);
      },
      [masterPrograms, openingProgram]
    );

    if (isLoading) return <div>Loading program...</div>;
    if (error || !openingProgram) return <div className="text-destructive">Program not found</div>;

    // Opening program UUID
    const openingProgramUuid = openingProgram.uuid;

    const masterProgramUuid = masterProgram?.uuid;

    if (!masterProgramUuid) {
      console.warn(
        "Master program UUID not found for opening program:",
        openingProgram.programName
      );
    }

    return (
      <div className="p-5">
        <h1 className="text-2xl font-semibold mb-4">Program Setup - {openingProgram.title}</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 bg-accent p-2 rounded-[10px] w-fit ">
          <Button
            className="cursor-pointer"
            variant={tab === "class" ? "default" : "outline"}
            onClick={() => setTab("class")}
          >
            Class
          </Button>
          <Button
            variant={tab === "curriculum" ? "default" : "outline"}
            onClick={() => setTab("curriculum")}
            className="cursor-pointer"
          >
            Curriculum
          </Button>
          <Button
            variant={tab === "timeline" ? "default" : "outline"}
            onClick={() => setTab("timeline")}
            className="cursor-pointer"
          >
            Timeline
          </Button>
          <Button
            variant={tab === "roadmap" ? "default" : "outline"}
            onClick={() => setTab("roadmap")}
            className="cursor-pointer"
          >
            Roadmap
          </Button>
          <Button
            variant={tab === "activities" ? "default" : "outline"}
            onClick={() => setTab("activities")}
            className="cursor-pointer"
          >
            Activity
          </Button>
        </div>

        {/* Tab Content */}
        {tab === "class" && <ClassAdmin openingProgramTitle={openingProgram.title} openingProgramUuid={openingProgram.uuid}/>}

        {tab === "curriculum" && masterProgramUuid && (
          <CurriculumAdmin
            programUuid={masterProgramUuid}          // master program
            openingProgramUuid={openingProgramUuid} // opening program
          />
        )}

        {tab === "roadmap" && <div>🚀 Roadmap Component</div>}
        {tab === "timeline" && <TimelinePage openingProgramUuid={openingProgramUuid} />}
        {tab === "activities" && <Activities openingProgramUuid={openingProgramUuid} />}
      </div>
    );
  }
