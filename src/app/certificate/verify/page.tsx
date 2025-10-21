"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Heading } from "@/components/Heading";
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
import { CloudUpload, Paperclip, X } from "lucide-react";
import { ScholarTable } from "@/features/certificate/components/data-table";
import { scholarColumn } from "@/features/certificate/components/scholar-table/columns";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { useGetAllScholarsByOpeningProgramUuidQuery } from "@/features/scholar/scholarApi";
import {
  useGetCertificateByScholarAndOpeningProgramQuery,
  useVerifyCertificateMutation,
} from "@/features/certificate/certificateApi";
import { useGetMasterProgramByOpeningProgramUuidQuery } from "@/features/master-program/masterProgramApi";
import { Scholar } from "@/types/scholar";
import { ScholarForCertificateType } from "@/types/certificate";
import { PdfPreview } from "@/components/pdf/PdfPreview";

// Helpers
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const getErrorMessage = (error: unknown): string => {
  if (isRecord(error)) {
    const data =
      "data" in error && isRecord((error as Record<string, unknown>).data)
        ? ((error as Record<string, unknown>).data as Record<string, unknown>)
        : undefined;
    if (data && typeof data.message === "string") return data.message;
    const msg = (error as Record<string, unknown>).message;
    if (typeof msg === "string") return msg;
  }
  return "Something went wrong. Please try again.";
};

interface ScholarApiResponse {
  "opening-program-scholars": Scholar[];
}

const formSchema = z.object({
  programSlug: z.string().min(1, "Please select a program"),
  scholarUuid: z.string().min(1, "Please select a scholar"),
});

// Simple modal (custom, no shadcn)
function Modal({
  open,
  onClose,
  children,
  title,
  description,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 p-6 flex">
        {/* Smaller modal */}
        <div className="m-auto bg-background rounded-lg shadow-xl w-[70vw] max-w-5xl h-[70vh] overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{title}</h2>
              {description ? (
                <p className="text-base text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {/* <Button variant="outline" onClick={onClose}>
              Close
            </Button> */}
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
          {footer ? (
            <div className="border-t bg-primary/5 p-6 ">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedScholar, setSelectedScholar] = useState("");
  const [files, setFiles] = useState<File[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [selectedCertificateUuid, setSelectedCertificateUuid] = useState("");

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { programSlug: "", scholarUuid: "" },
  });

  // Programs
  const {
    data: openingPrograms,
    isError: isProgramError,
    isLoading: isProgramLoading,
  } = useGetAllOpeningProgramsQuery();

  const selectedProgramData =
    openingPrograms?.find((p) => p.slug === selectedProgram) ?? undefined;

  // Master Program by Opening Program UUID (use provided endpoint)
  const {
    data: masterProgram,
    isLoading: isMasterLoading,
    isError: isMasterError,
  } = useGetMasterProgramByOpeningProgramUuidQuery(
    { openingProgramUuid: selectedProgramData?.uuid ?? "" },
    { skip: !selectedProgramData?.uuid }
  );

  // Scholars for selected program
  const {
    data: scholars,
    isLoading: isLoadingScholars,
    isError: isErrorScholars,
  } = useGetAllScholarsByOpeningProgramUuidQuery(
    selectedProgramData?.uuid ?? "",
    { skip: !selectedProgramData?.uuid }
  );

  const scholarsForCertificate: ScholarForCertificateType[] = useMemo(() => {
    let arr: Scholar[] = [];
    if (scholars && typeof scholars === "object" && !Array.isArray(scholars)) {
      const res = scholars as ScholarApiResponse;
      if (Array.isArray(res["opening-program-scholars"])) {
        arr = res["opening-program-scholars"];
      }
    } else if (Array.isArray(scholars)) {
      arr = scholars as Scholar[];
    }
    return arr.map((s) => ({
      uuid: s.uuid || "",
      englishName: s.englishName || "",
      khmerName: s.khmerName || "",
      title: selectedProgramData?.title || "",
    }));
  }, [scholars, selectedProgramData?.title]);

  // Certificates by scholar + opening program
  const {
    data: certificates,
    isLoading: isCertificatesLoading,
    refetch: refetchCertificates,
  } = useGetCertificateByScholarAndOpeningProgramQuery(
    {
      scholarUuid: selectedScholar,
      openingProgramUuid: selectedProgramData?.uuid || "",
    },
    { skip: !selectedScholar || !selectedProgramData?.uuid }
  );

  const [verifyCertificate, { isLoading: isVerifying }] =
    useVerifyCertificateMutation();

  // File upload preview
  const handleFileChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
    if (newFiles?.[0]) {
      const url = URL.createObjectURL(newFiles[0]);
      setPreviewUrl(url);
    } else {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFiles(null);
  };

  // Enforce single scholar selection
  const handleScholarSelection = useCallback(
    (scholarUuids: string[]) => {
      const uuid = scholarUuids.length > 0 ? scholarUuids[0] : "";
      setSelectedScholar(uuid);
      form.setValue("scholarUuid", uuid);
    },
    [form]
  );

  const isPDF = (url: string | undefined): boolean =>
    !!url &&
    (url.toLowerCase().endsWith(".pdf") ||
      url.toLowerCase().includes("application/pdf"));

  // Step 1: find certificates
  const handleInitialVerify = async () => {
    if (!files?.[0]) {
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

    await refetchCertificates();

    if (certificates && certificates.length > 0) {
      setShowCertificateDialog(true);
    } else {
      toast.error("No certificates found for the selected scholar and program");
    }
  };

  // Step 2: verify against selected certificate
  // CHANGE: programSlug must be masterProgram.slug fetched by opening program UUID
  const handleFinalVerify = async () => {
    try {
      if (!files?.[0] || !selectedCertificateUuid || !masterProgram?.slug) {
        toast.error("Missing required information");
        return;
      }

      const result = await verifyCertificate({
        file: files[0],
        programSlug: masterProgram.slug,
        certificateUuid: selectedCertificateUuid,
      }).unwrap();

      setShowCertificateDialog(false);

      if (result.isVerified) {
        toast.success("Certificate Verified Successfully!");
      } else {
        toast.error("Certificate Verification Failed");
      }

      setFiles(null);
      setPreviewUrl(null);
      setSelectedCertificateUuid("");
    } catch (err) {
      toast.error(getErrorMessage(err));
      setShowCertificateDialog(false);
    }
  };

  if (isProgramLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
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
          {/* Left: Program + File */}
          <div className="flex flex-col max-w-xl w-full gap-4">
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
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedProgram(val);
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

            {/* File upload with live preview */}
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
                      {files?.map((file, i) => (
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
                          <object
                            data={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-fit`}
                            type="application/pdf"
                            className="w-full h-full min-h-[384px]"
                          />
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
                                {files?.[0]
                                  ? (files[0].size / 1024 / 1024).toFixed(2)
                                  : "0"}{" "}
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

          {/* Right: Scholar selection */}
          <div className="flex flex-col flex-1 w-full gap-3">
            <FormField
              control={form.control}
              name="scholarUuid"
              render={() => (
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
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
            className="bg-primary cursor-pointer"
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

        {/* Certificate selection modal with inline preview (PDF via blob/proxy) */}
        <Modal
          open={showCertificateDialog}
          onClose={() => {
            setShowCertificateDialog(false);
            setSelectedCertificateUuid("");
          }}
          title="Select Certificate to Verify"
          description="Which certificate do you want to verify? Click on a certificate to select it."
          footer={
            <div className="flex justify-between items-center">
              <div className="text-sm text-accent-foreground/50 cursor-pointer">
                {selectedCertificateUuid && certificates?.length
                  ? "1 certificate selected"
                  : "Please select a certificate to verify"}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCertificateDialog(false);
                    setSelectedCertificateUuid("");
                  }}
                  className="px-6 py-2 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFinalVerify}
                  disabled={
                    !selectedCertificateUuid ||
                    isVerifying ||
                    isMasterLoading ||
                    isMasterError ||
                    !masterProgram?.slug
                  }
                  className="bg-primary px-6 py-2 cursor-pointer"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 cursor-pointer border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    "Verify Certificate"
                  )}
                </Button>
              </div>
            </div>
          }
        >
          <div className="p-6">
            {certificates && certificates.length > 0 ? (
              // 3-column responsive grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer">
                {certificates.map((certificate) => {
                  const rawUrl =
                    certificate.tempCertificateUrl ||
                    certificate.certificateUrl;
                  const pdf = isPDF(rawUrl);

                  return (
                    <button
                      key={certificate.uuid}
                      type="button"
                      className={`group relative rounded-xl border p-3 text-left transition-all hover:shadow-md ${
                        selectedCertificateUuid === certificate.uuid
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-border hover:border-primary/40"
                      }`}
                      onClick={() =>
                        setSelectedCertificateUuid(certificate.uuid)
                      }
                    >
                      {/* Uniform card size via aspect ratio */}
                      <div className="relative w-full aspect-[4/3] bg-white rounded-lg overflow-hidden">
                        {rawUrl ? (
                          pdf ? (
                            <PdfPreview
                              src={rawUrl}
                              className="absolute inset-0 w-full h-full pointer-events-none"
                              toolbar={false}
                            />
                          ) : (
                            <Image
                              src={rawUrl}
                              alt={`Certificate ${
                                certificate.fileName || certificate.uuid
                              }`}
                              fill
                              className="object-contain p-2"
                            />
                          )
                        ) : (
                          <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                            No Preview
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-accent-foreground/50 text-xl">
                    No certificates found for the selected scholar and program.
                  </p>
                  <p className="text-accent-foreground/30 text-base mt-2">
                    Try selecting a different scholar or program.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </Form>
  );
}
