"use client";

import React from "react";
// import { useRouter } from "next/navigation";
import MasterProgramCreate from "./MasterProgramCreate";
export default function Page() {
  return (
    <div className="p-5 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Create Program</h1>
      <div className="w-[70%]">
      <MasterProgramCreate  />
      </div>
    </div>
  );
}
