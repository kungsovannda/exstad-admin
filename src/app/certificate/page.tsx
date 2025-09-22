"use client";
import { Button } from "@/components/ui/button";
import { certificateColumn } from "@/features/certificate/components/certificate-table/columns";
import { Heading } from "@/components/Heading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CertificateTable } from "@/features/certificate/components/certificate-table/data-table";
import { certificateForData } from "@/data/certificate";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
// import { openingProgramData } from "@/data/openingProgramData";



export default function Certificate() {
  const {
    data: openingPrograms,
    isError,
    isLoading,
  } = useGetAllOpeningProgramsQuery();
  
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  // const openingPrograms: openingProgramType[] = openingProgramData;

  const selectedProgram = openingPrograms?.find(
    (program) => program.slug === selected
  );

  const handleNext = () => {
    if (!selected) return;
    router.push(`/certificate/${selected}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading programs</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-10">
        <Heading
          title="Generate Certificate"
          description="Generate and manage certificates"
        />
        <div className="flex items-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger className="bg-accent py-2.5 text-sm px-4 rounded-md hover:bg-accent/70">
              Generate
            </AlertDialogTrigger>
            <AlertDialogContent className="min-w-xl bg-accent">
              <AlertDialogHeader className="space-y-8">
                <AlertDialogTitle className="text-3xl font-bold mx-auto">
                  Choose a Program
                </AlertDialogTitle>
                <div className="flex flex-col gap-4">
                  <h3 className="text-md">Program</h3>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {/* Optimized: Use the selectedProgram variable */}
                        {selectedProgram
                          ? `${selectedProgram.title} - Generation ${selectedProgram.generation}`
                          : "Select a program..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search programs..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No program found.</CommandEmpty>
                          <CommandGroup>
                            {openingPrograms?.map((program) => (
                              <CommandItem
                                key={program.uuid}
                                value={program.slug}
                                onSelect={(currentValue) => {
                                  setSelected(
                                    currentValue === selected
                                      ? ""
                                      : currentValue
                                  );
                                  setOpen(false);
                                }}
                              >
                                {program.title} - Generation{" "}
                                {program.generation}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    selected === program.slug
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-8">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleNext}>Next</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Link href="certificate/verify">
            <Button className="flex bg-green-600 items-center px-6 rounded-md">
              Verify
            </Button>
          </Link>
        </div>
      </div>
      <CertificateTable
        columns={certificateColumn}
        totalItems={certificateForData.length}
        data={certificateForData}
      />
    </div>
  );
}
