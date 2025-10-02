"use client";
import { Heading } from "@/components/Heading";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Paperclip, X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  useGetCertificateByScholarAndOpeningProgramQuery,
  useVerifyCertificateMutation,
} from "@/features/certificate/certificateApi";
import { ScholarTable } from "@/features/certificate/components/data-table";
import { scholarColumn } from "@/features/certificate/components/scholar-table/columns";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { useGetAllScholarsByOpeningProgramUuidQuery } from "@/features/scholar/scholarApi";
import { ScholarForCertificateType } from "@/types/certificate";
import { Scholar } from "@/types/scholar";
import { toast } from "sonner";

// Define the API response interface locally
interface ScholarApiResponse {
  "opening-program-scholars": Scholar[];
}

const formSchema = z.object({
  programSlug: z.string().min(1, "Please select a program"),
  scholarUuid: z.string().min(1, "Please select a scholar"),
});

export default function VerifiedPage() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedScholar, setSelectedScholar] = useState("");
  const [files, setFiles] = useState<File[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [selectedCertificateUuid, setSelectedCertificateUuid] = useState("");

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 10, // 10MB
    multiple: false,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programSlug: "",
      scholarUuid: "",
    },
  });

  const {
    data: openingPrograms,
    isError: isProgramError,
    isLoading: isProgramLoading,
  } = useGetAllOpeningProgramsQuery();

  const selectedProgramData = openingPrograms?.find(
    (program) => program.slug === selectedProgram
  );

  // Get scholars when program is selected
  const {
    data: scholars,
    isLoading: isLoadingScholars,
    isError: isErrorScholars,
  } = useGetAllScholarsByOpeningProgramUuidQuery(
    selectedProgramData?.uuid ?? "",
    {
      skip: !selectedProgramData?.uuid,
    }
  );

  const scholarsForCertificate: ScholarForCertificateType[] = useMemo(() => {
    let scholarsArray: Scholar[] = [];

    if (scholars && typeof scholars === "object" && !Array.isArray(scholars)) {
      const scholarsResponse = scholars as ScholarApiResponse;
      if (
        scholarsResponse["opening-program-scholars"] &&
        Array.isArray(scholarsResponse["opening-program-scholars"])
      ) {
        scholarsArray = scholarsResponse["opening-program-scholars"];
      }
    } else if (Array.isArray(scholars)) {
      scholarsArray = scholars as Scholar[];
    }

    if (!Array.isArray(scholarsArray)) {
      return [];
    }

    return scholarsArray.map((scholar: Scholar) => ({
      uuid: scholar.uuid || "",
      englishName: scholar.englishName || "",
      khmerName: scholar.khmerName || "",
      title: selectedProgramData?.title || "",
    }));
  }, [scholars, selectedProgramData?.title]);

  // Get certificates when scholar and program are selected
  const {
    data: certificates,
    isLoading: isCertificatesLoading,
    refetch: refetchCertificates,
  } = useGetCertificateByScholarAndOpeningProgramQuery(
    {
      scholarUuid: selectedScholar,
      openingProgramUuid: selectedProgramData?.uuid || "",
    },
    {
      skip: !selectedScholar || !selectedProgramData?.uuid,
    }
  );

  const [verifyCertificate, { isLoading: isVerifying }] =
    useVerifyCertificateMutation();

  // Handle file selection and preview
  const handleFileChange = (newFiles: File[] | null) => {
    setFiles(newFiles);

    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFiles(null);
  };

  // Enforce single scholar selection
  const handleScholarSelection = useCallback(
    (scholarUuids: string[]) => {
      // Only allow one scholar to be selected - take the first one and ignore the rest
      const scholarUuid = scholarUuids.length > 0 ? scholarUuids[0] : "";
      setSelectedScholar(scholarUuid);
      form.setValue("scholarUuid", scholarUuid);
    },
    [form]
  );

  // Helper function to check if file is PDF
  const isPDF = (url: string | undefined): boolean => {
    if (!url) return false;
    return (
      url.toLowerCase().endsWith(".pdf") || url.includes("application/pdf")
    );
  };

  const handleInitialVerify = async () => {
    try {
      if (!files || files.length === 0) {
        toast.error("Please select a certificate file to verify");
        return;
      }

      if (!selectedProgram) {
        toast.error("Please select a program");
        return;
      }

      if (!selectedScholar) {
        toast.error("Please select a scholar");
        return;
      }

      // Refetch certificates to ensure we have the latest data
      await refetchCertificates();

      // Show the certificate selection dialog
      if (certificates && certificates.length > 0) {
        setShowCertificateDialog(true);
      } else {
        toast.error(
          "No certificates found for the selected scholar and program"
        );
      }
    } catch (error: unknown) {
      console.log("Error fetching certificates:", error);
      toast.error("An error occurred while fetching certificates");
    }
  };

  // Handle final verification with selected certificate
  const handleFinalVerify = async () => {
    try {
      if (!files || !selectedCertificateUuid || !selectedProgram) {
        toast.error("Missing required information");
        return;
      }

      const result = await verifyCertificate({
        file: files[0],
        programSlug: selectedProgram,
        certificateUuid: selectedCertificateUuid,
      }).unwrap();

      setShowCertificateDialog(false);

      
      if (result.isVerified) {
        toast.success(
          <div className="space-y-2">
            <p className="font-semibold">Certificate Verified Successfully!</p>
          </div>
        );
      } else {
        toast.error(
          <div className="space-y-2">
            <p className="font-semibold">Certificate Verification Failed</p>
          </div>
        );
      }

      // Reset form after verification
      setFiles(null);
      setPreviewUrl(null);
      setSelectedCertificateUuid("");
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
          ? (error.data.message as string)
          : "Failed to verify certificate. Please try again.";

      toast.error(errorMessage);
      setShowCertificateDialog(false);
    }
  };

  if (isProgramLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading programs...</p>
        </div>
      </div>
    );
  }

  if (isProgramError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <p>Error loading programs</p>
          <p className="text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4 p-6 space-y-6 h-[90vh]">
        <div className="flex justify-between items-center gap-10">
          <Heading
            title="Verify Certificate"
            description="Upload the certificate you want to verify"
          />
        </div>

        <div className="flex gap-10 justify-between">
          <div className="flex flex-col max-w-xl w-full gap-4">
            {/* Program Selection */}
            <FormField
              control={form.control}
              name="programSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Program <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedProgram(value);
                        // Reset scholar selection when program changes
                        setSelectedScholar("");
                        form.setValue("scholarUuid", "");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a program first" />
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload with PDF Preview */}
            <div>
              <FormLabel>
                Certificate File <span className="text-red-600">*</span>
              </FormLabel>
              <div className="space-y-4 mt-2">
                {!previewUrl ? (
                  <FileUploader
                    value={files}
                    onValueChange={handleFileChange}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-accent rounded-lg p-2"
                  >
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-slate-500"
                    >
                      <div className="flex items-center justify-center flex-col p-8 w-full">
                        <CloudUpload className="text-gray-500 w-10 h-10" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, PDF (max 10MB)
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
                ) : (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <Button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 w-6 h-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>

                    <div className="space-y-2">
                      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                        {files?.[0]?.type === "application/pdf" ? (
                          
                          <div className="w-full h-full relative">
                            <object
                              data={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-fit`}
                              type="application/pdf"
                              className="w-full h-full min-h-[384px]"
                            >
                              <embed
                                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-fit`}
                                type="application/pdf"
                                className="w-full h-full min-h-[384px]"
                              />
                            </object>
                          </div>
                        ) : files?.[0]?.type.startsWith("image/") ? (
                          <Image
                            src={previewUrl}
                            alt="Certificate preview"
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">
                                {files?.[0]?.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {files?.[0] &&
                                  (files[0].size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {files?.[0]?.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 w-full gap-3">
            <FormField
              control={form.control}
              name="scholarUuid"
              render={({}) => (
                <FormItem>
                  <FormLabel>
                    Choose Scholar
                    {!selectedProgram && (
                      <span className="text-red-500 text-sm ml-2">
                        (Select a program first)
                      </span>
                    )}
                    {selectedScholar && (
                      <span className="text-green-600 ml-2">(1 selected)</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    {!selectedProgram ? (
                      <div className="border rounded-lg p-8 text-center text-accent-foreground/50">
                        <p>Please select a program first to see scholars</p>
                      </div>
                    ) : isLoadingScholars ? (
                      <div className="border rounded-lg p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p>Loading scholars...</p>
                      </div>
                    ) : isErrorScholars ? (
                      <div className="border rounded-lg p-8 text-center text-red-500">
                        <p>Error loading scholars</p>
                        <p className="text-sm mt-1">
                          Please try selecting the program again
                        </p>
                      </div>
                    ) : scholarsForCertificate.length === 0 ? (
                      <div className="border rounded-lg p-8 text-center text-accent-foreground/50">
                        <p>No scholars found for this program</p>
                      </div>
                    ) : (
                      <ScholarTable
                        columns={scholarColumn}
                        totalItems={scholarsForCertificate.length}
                        data={scholarsForCertificate}
                        onSelectionChange={handleScholarSelection}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            className="bg-primary"
            disabled={
              isCertificatesLoading ||
              !files ||
              !selectedScholar ||
              !selectedProgram ||
              isLoadingScholars
            }
            onClick={handleInitialVerify}
          >
            {isCertificatesLoading
              ? "Loading certificates..."
              : isLoadingScholars
              ? "Loading scholars..."
              : "Find Certificates"}
          </Button>
        </div>

        {/* Enhanced Certificate Selection Dialog */}
        <AlertDialog
          open={showCertificateDialog}
          onOpenChange={setShowCertificateDialog}
        >
          <AlertDialogContent className="max-w-[95vw] max-h-[85vh] overflow-hidden w-[95vw] h-[85vh] p-0">
            <div className="flex flex-col h-full">
              <AlertDialogHeader className="px-6 py-4 border-b flex-shrink-0">
                <AlertDialogTitle className="text-2xl">
                  Select Certificate to Verify
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  Which certificate do you want to verify? Click on a
                  certificate to select it.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {/* Updated certificate grid with no PDF embedding */}
              <div className="flex-1 overflow-y-auto p-6">
                {certificates && certificates.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {certificates.map((certificate) => {
                      const certificateUrl =
                        certificate.tempCertificateUrl ||
                        certificate.certificateUrl;
                      const isPDFFile = isPDF(certificateUrl);

                      return (
                        <div
                          key={certificate.uuid}
                          className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all hover:shadow-lg ${
                            selectedCertificateUuid === certificate.uuid
                              ? "border-primary border-2 scale-[1.02] shadow-xl"
                              : "border-primary/10 hover:border-primary/2"
                          }`}
                          onClick={() =>
                            setSelectedCertificateUuid(certificate.uuid)
                          }
                        >
                          <div className="space-y-3">
                            {/* Simplified Preview Area - No PDF embedding */}
                            <div className="relative w-full h-32 bg-primary rounded-lg overflow-hidden border flex items-center justify-center">
                              {certificateUrl ? (
                                isPDFFile ? (
                                  <div className="text-center p-4">
                                    <a
                                      href={certificateUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Preview
                                    </a>
                                  </div>
                                ) : (
                                  <Image
                                    src={certificateUrl}
                                    alt={`Certificate ${
                                      certificate.fileName || certificate.uuid
                                    }`}
                                    fill
                                    className="object-contain p-2"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "/images/placeholder.png";
                                    }}
                                  />
                                )
                              ) : (
                                // No URL available
                                <div className="text-center">
                                  <p className="text-sm text-accent-foreground/50">
                                    No Preview Available
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {certificate.fileName ||
                                      certificate.uuid.slice(0, 8)}
                                    ...
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-accent-foreground/50 text-xl">
                        No certificates found for the selected scholar and
                        program.
                      </p>
                      <p className="text-accent-foreground/30 text-base mt-2">
                        Try selecting a different scholar or program.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center gap-4 p-6 border-t flex-shrink-0 bg-primary/5">
                <div className="text-sm text-accent-foreground/50">
                  {selectedCertificateUuid && certificates?.length ? (
                    <span className="font-medium text-primary">
                      1 certificate selected
                    </span>
                  ) : (
                    <span>Please select a certificate to verify</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCertificateDialog(false);
                      setSelectedCertificateUuid("");
                    }}
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFinalVerify}
                    disabled={!selectedCertificateUuid || isVerifying}
                    className="bg-primary px-6 py-2"
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify Certificate"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Form>
  );
}