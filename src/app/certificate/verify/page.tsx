"use client";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudUpload } from "lucide-react";
import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { openingProgramData } from "@/data/openingProgramData";
import { openingProgramType } from "@/types/opening-program";
import { ScholarTable } from "@/features/certificate/components/data-table";
import { scholarColumn } from "@/features/certificate/components/scholar-table/columns";
import { scholarsForCertificate } from "@/data/certificate";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const openingPrograms: openingProgramType[] = openingProgramData;
export default function VerifiedPage() {
  const [selected, setSelected] = useState("");

  return (
    <div className="flex flex-col gap-4 p-6 space-y-6 h-[90vh]">
      <div className="flex justify-between items-center gap-10">
        <Heading
          title="Verify Certificate"
          description="Upload the certificate you want to verify"
        />
      </div>
      <div className="flex gap-10 justify-between">
        <div>
          <div className="flex flex-col w-full max-w-xl gap-2 rounded-lg h-[10vh]">
            <h3 className="text-md">Program</h3>

            <Select
              name="program"
              value={selected}
              onValueChange={(v) => setSelected(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Programs</SelectLabel>
                  {openingPrograms.map((program) => (
                    <SelectItem key={program.uuid} value={program.slug}>
                      {program.title} - Generation {program.generation}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xl">
            <Label htmlFor="picture text-md">Upload Certificate</Label>
            <div className=" relative">
              <Input id="picture" type="file" className="sr-only h-full" />
              <label
                htmlFor="picture"
                className="flex flex-col items-center gap-2 w-full cursor-pointer rounded-md border px-40 py-16 text-center hover:opacity-70 h-full"
              >
                <CloudUpload className="h-24 w-24 text-muted-foreground" />
                <span className="truncate text-sm text-muted-foreground">
                  Select a file or drag and drop here
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 w-full gap-3">
          <h4 className="text-sm">Choose Scholars</h4>
          <ScholarTable
            columns={scholarColumn}
            totalItems={scholarsForCertificate.length}
            data={scholarsForCertificate}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-green-600"
          onClick={() => toast("Verify Successfully")}
        >
          Verify
        </Button>
      </div>
    </div>
  );
}
