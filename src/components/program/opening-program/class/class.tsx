"use client";

import { programData } from "@/data/programData";
import { Classes } from "@/types/opening-program";
import { classColumns } from "./classColumn";
import ClassModal1 from "./form-field";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ClassDataTable from "@/features/opening-program/components/table/class-data";
import ClassDataTable1 from "./data-table";

// Flatten all classes from all opening programs
const allClasses: Classes[] = programData.flatMap(
  (program) => program.openingprogram?.flatMap((op) => op.classes || []) || []
);


export default function ClassPage() {
  const [open, setOpen] = useState(false); 
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-10">
        <h1 className="text-lg font-semibold">Classes</h1>
        <Button onClick={() => setOpen(true)}>Add Class</Button>
        <ClassModal1 open={open} onOpenChange={setOpen} />
      </div>
      <ClassDataTable />
    </div>
  );
}
