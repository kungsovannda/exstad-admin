"use client";
import { Button } from "@/components/ui/button";
import { useCertificateColumns } from "@/features/certificate/components/certificate-table/columns";
import { Heading } from "@/components/Heading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import { CertificateTable } from "@/features/certificate/components/certificate-table/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { LoadingOverlay } from "@/features/badge/components/loading/LoadingOverlay";

export default function Certificate() {
  const {
    data: openingPrograms,
    isError,
    isLoading,
  } = useGetAllOpeningProgramsQuery();

  const router = useRouter();
  const certificateColumns = useCertificateColumns();

  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  const selectedProgram = openingPrograms?.find(
    (program) => program.slug === selected
  );

  const handleNext = () => {
    if (!selected) return;
    router.push(`/certificate/${selected}`);
  };

  const certificateForData = useMemo(() => {
    return (openingPrograms ?? [])
      .filter(
        (program) => program.templates?.[0] && program.templates[0] !== ""
      )
      .map((program) => ({
        title: program.title,
        certificateUrl: program.templates?.[0] || "",
        generation: program.generation?.toString() || "",
        slug: program.slug,
      }));
  }, [openingPrograms]);

  if (isLoading) return <div><LoadingOverlay /></div>;
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
            <AlertDialogTrigger className="bg-accent py-2.5 text-sm px-4 rounded-md hover:bg-accent/70 cursor-pointer">
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
                        className="w-full justify-between cursor-pointer"
                      >
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
                                className="cursor-pointer"
                                key={program.uuid}
                                value={program.slug}
                                onSelect={(currentValue: string) => {
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
              <AlertDialogFooter className="mt-8 cursor-pointer">
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={handleNext}
                >
                  Next
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Link href="certificate/verify">
            <Button
              className="flex bg-primary items-center px-6 rounded-md !py-4 text-sm hover:bg-primary/80 cursor-pointer"
              size={"lg"}
            >
              Verify
            </Button>
          </Link>
        </div>
      </div>
      <CertificateTable
        columns={certificateColumns}
        totalItems={certificateForData.length}
        data={certificateForData}
      />
    </div>
  );
}
