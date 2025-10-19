"use client";

import OpeningProgramCreate from "./OpeningProgramCreate";

export default function Page() {
  return (
    <div className="p-5 flex flex-col gap-10">
      <h1 className="text-2xl font-semibold">Opening Program Management</h1>
      <div className="w-[70%]">
        <OpeningProgramCreate/>
      </div>
    </div>
  );
}
