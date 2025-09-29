"use client";

import MasterProgramEdit from "../MasterProgramEdit";

export default function Page() {
  return (
    <div className="p-5 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Edit Program</h1>
      <div className="w-[70%]">
        <MasterProgramEdit />
      </div>
    </div>
  );
}
