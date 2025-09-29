"use client";

import OpeningProgramEdit from "../OpeningProgramEdit";

export default function Page() {
  return (
    <div className="p-5 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Edit Program</h1>
      <div className="w-[70%]">
        <OpeningProgramEdit />
      </div>
    </div>
  );
}
