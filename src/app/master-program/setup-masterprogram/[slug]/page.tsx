"use client";

import Curriculum from "@/components/program/curriculum";
import Faq from "@/components/program/faq";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {  useParams } from "next/navigation";


export default function ProgramSetup() {
  const [tab, setTab] = useState<"curriculum" | "roadmap" | "faq">("curriculum");
  const params = useParams(); // app router
  const slug = params.slug;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Program Setup - {slug}</h1>

      {/* Tab buttons */}
      <div className="flex gap-4 mb-6 bg-accent p-2 rounded-[10px] w-fit">
        <Button variant={tab === "curriculum" ? "default" : "outline"} onClick={() => setTab("curriculum")}>
          Curriculum
        </Button>
        <Button variant={tab === "roadmap" ? "default" : "outline"} onClick={() => setTab("roadmap")}>
          Roadmap
        </Button>
        <Button variant={tab === "faq" ? "default" : "outline"} onClick={() => setTab("faq")}>
          FAQ
        </Button>
      </div>

      {/* Tab Content */}
      {tab === "curriculum" && <Curriculum />}
      {tab === "roadmap" && <div>🚀 Roadmap Component</div>}
      {tab === "faq" && <Faq />}
    </div>
  );
}
