"use client";

import Curriculum from "@/components/program/master-program/curriculum/curriculum";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Timeline from "@/components/program/master-program/timeline/timeline";
import ClassPage from "@/components/program/class/class";
import Activities from "@/components/program/activity/activities";
import { openingProgramData } from "@/data/openingProgramData";
import { openingProgramType } from "@/types/opening-program";

export default function ProgramSetup() {
  const [tab, setTab] = useState<
    "class" | "timeline" | "curriculum" | "roadmap" | "activities"
  >("class");
  const params = useParams(); // app router
  const slug = params.slug;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Program Setup - {slug}</h1>
      {/* Tab buttons */}
      <div className="flex gap-4 mb-6 bg-accent p-2 rounded-[10px] w-fit">
        <Button
          variant={tab === "class" ? "default" : "outline"}
          onClick={() => setTab("class")}
        >
          Class
        </Button>
        <Button
          variant={tab === "curriculum" ? "default" : "outline"}
          onClick={() => setTab("curriculum")}
        >
          {" "}
          Curriculum
        </Button>
        <Button
          variant={tab === "timeline" ? "default" : "outline"}
          onClick={() => setTab("timeline")}
        >
          Timeline
        </Button>
        <Button
          variant={tab === "roadmap" ? "default" : "outline"}
          onClick={() => setTab("roadmap")}
        >
          {" "}
          Roadmap
        </Button>
        <Button
          variant={tab === "activities" ? "default" : "outline"}
          onClick={() => setTab("activities")}
        >
          Activity
        </Button>
      </div>

      {/* Tab Content */}
      {tab === "class" && <ClassPage />}
      {tab === "curriculum" && <Curriculum />}
      {tab === "roadmap" && <div>🚀 Roadmap Component</div>}
      {tab === "timeline" && <Timeline />}
      {tab === "activities" && <Activities />}
    </div>
  );
}
