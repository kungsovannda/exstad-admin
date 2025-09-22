"use client";
import { Heading } from "@/components/Heading";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { CloudUpload, Paperclip } from "lucide-react";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { openingProgramData } from "@/data/openingProgramData";
// import { openingProgramType } from "@/types/opening-program";
import { ScholarTable } from "@/features/certificate/components/data-table";
import { scholarColumn } from "@/features/certificate/components/scholar-table/columns";
import { scholarsForCertificate } from "@/data/certificate";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
const formSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }).optional(),
  certificateUuid: z.string().min(1, "Certificate is required"),
  programSlug: z.string().optional(),
  openingProgramUuid: z.string().min(1, "Program is required"),
  scholarUuids: z.string().min(1, "At least one scholar must be selected"),
});

export default function VerifiedPage() {
  const [selected, setSelected] = useState("");

  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateUuid: "",
      programSlug: "",
      openingProgramUuid: "",
      scholarUuids: "",
    },
  });

  const {
    data: openingPrograms,
    isError,
    isLoading,
  } = useGetAllOpeningProgramsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading programs</div>;

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=""
      >
        <div className="flex flex-col gap-4 p-6 space-y-6 h-[90vh]">
          <div className="flex justify-between items-center gap-10">
            <Heading
              title="Verify Certificate"
              description="Upload the certificate you want to verify"
            />
          </div>

          <div className="flex gap-10 justify-between">
            <div className="flex flex-col max-w-xl w-full gap-4">
              <div className="flex flex-col w-full max-w-xl gap-2 rounded-lg ">
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
                      {openingPrograms?.map((program) => (
                        <SelectItem key={program.uuid} value={program.slug}>
                          {program.title} - Generation {program.generation}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-4 w-full max-w-xl">
                <div className=" relative">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select File</FormLabel>
                        <FormControl>
                          <FileUploader
                            value={files}
                            onValueChange={setFiles}
                            dropzoneOptions={dropZoneConfig}
                            className="relative bg-accent rounded-lg p-2"
                          >
                            <FileInput
                              id="fileInput"
                              className="outline-dashed outline-1 outline-slate-500"
                            >
                              <div className="flex items-center justify-center flex-col p-8 w-full ">
                                <CloudUpload className="text-gray-500 w-10 h-10" />
                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>
                                  &nbsp; or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  SVG, PNG, JPG or GIF
                                </p>
                              </div>
                            </FileInput>
                            <FileUploaderContent>
                              {files &&
                                files.length > 0 &&
                                files.map((file, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span>{file.name}</span>
                                  </FileUploaderItem>
                                ))}
                            </FileUploaderContent>
                          </FileUploader>
                        </FormControl>
                        {/* <FormDescription>
                          Select a file to upload.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              type="submit"
              className="bg-primary"
              onClick={() => toast("Verify Successfully")}
            >
              Verify
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
