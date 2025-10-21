"use client";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { ScholarTable } from "@/features/certificate/components/data-table";
import { scholarColumn } from "@/features/certificate/components/scholar-table/columns";
// import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { CloudUpload, Paperclip } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { useCreateDocumentMutation } from "@/features/document/documentApi";
import {
  useGetOpeningProgramBySlugQuery,
  useSetUpTemplateMutation,
} from "@/features/opening-program/openingProgramApi";
import { useGenerateCertificateMutation } from "@/features/certificate/certificateApi";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ScholarApiResponse,
  useGetAllScholarsByOpeningProgramUuidQuery,
} from "@/features/scholar/scholarApi";
import { ScholarForCertificateType } from "@/types/certificate";
import { Scholar } from "@/types/scholar";
import { useDownloadZipMutation } from "@/features/document/documentAccessApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMasterProgramByOpeningProgramUuidQuery } from "@/features/master-program/masterProgramApi";

const formSchema = z.object({
  bgImage: z.string().optional(),
  programSlug: z.string().optional(),
  openingProgramUuid: z.string().optional(),
  scholarUuids: z.array(z.string()).optional(),
});

export default function CertificatePage() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [selectedScholars, setSelectedScholars] = useState<string[]>([]);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [downloadZip, { isLoading: isDownloadingZip }] =
    useDownloadZipMutation();
  const [uploadCertificate, { isLoading }] = useCreateDocumentMutation();
  const [setUpTemplate, { isLoading: isSettingUpTemplate }] =
    useSetUpTemplateMutation();
  const [generateCertificate, { isLoading: isGenerating }] =
    useGenerateCertificateMutation();

  const dropZoneConfig = {
    maxFiles: 10,
    maxSize: 1024 * 1024 * 10,
    multiple: true,
  };

  const params = useParams();
  const slug = params?.slug as string;

  const { data: program, refetch: refetchProgram } =
    useGetOpeningProgramBySlugQuery(
      { slug: slug || "" },
      {
        skip: !slug,
      }
    );

  const { data: masterProgram } = useGetMasterProgramByOpeningProgramUuidQuery(
    { openingProgramUuid: program?.uuid ?? "" },
    {
      skip: !program?.uuid,
    }
  );
  console.log("Master Program Slug", masterProgram?.slug);

  const {
    data: scholars,
    isLoading: isLoadingScholars,
    isError: isErrorScholars,
    error: scholarError,
  } = useGetAllScholarsByOpeningProgramUuidQuery(program?.uuid ?? "", {
    skip: !program?.uuid,
    refetchOnMountOrArgChange: true,
  });
  console.log("Opening Program UUID: ", program?.uuid);
  console.log("Scholar: ", scholars);

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
      title: program?.title || "",
    }));
  }, [scholars, program?.title]);

  const allTemplates = useMemo(() => {
    return program?.templates || [];
  }, [program?.templates]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bgImage: undefined,
      programSlug: "",
      openingProgramUuid: "",
      scholarUuids: [],
    },
  });

  useEffect(() => {
    if (program) {
      form.setValue("programSlug", program.slug);
      form.setValue("openingProgramUuid", program.uuid);
    }
  }, [program, form]);

  useEffect(() => {
    if (allTemplates.length > 0 && allTemplates[selectedIndex]) {
      form.setValue("bgImage", allTemplates[selectedIndex]);
    }
  }, [selectedIndex, allTemplates, form]);

  useEffect(() => {
    setSelectedIndex(0);
    setSelectedScholars([]);
  }, [program?.uuid]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleScholarSelection = useCallback(
    (scholarUuids: string[]) => {
      setSelectedScholars(scholarUuids);
      form.setValue("scholarUuids", scholarUuids);
      form.trigger("scholarUuids");
    },
    [form]
  );

  const handleTemplateSelection = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleFileUpload = async () => {
    if (!files?.[0]) {
      toast.error("Please select a file to upload");
      return;
    }

    if (isLoading || isSettingUpTemplate) {
      return;
    }

    const uploadData = {
      file: files[0],
      programSlug: masterProgram?.slug || "",
      gen: program?.generation ?? 1,
      documentType: "certificate" as const,
      filename: "null",
    };

    try {
      const uploadResult = await uploadCertificate(uploadData).unwrap();
      toast.success("Certificate uploaded successfully!");

      if (program?.uuid) {
        try {
          await setUpTemplate({
            uuid: program.uuid,
            template: uploadResult.uri,
          }).unwrap();

          const refetchResult = await refetchProgram();

          toast.success("Template added successfully!");
          setFiles(null);

          if (
            refetchResult.data?.templates &&
            refetchResult.data.templates.length > 0
          ) {
            setSelectedIndex(refetchResult.data.templates.length - 1);
          }
        } catch (templateError) {
          console.error(templateError);
          toast.error("Certificate uploaded but failed to add to templates");
        }
      } else {
        toast.warning(
          "Certificate uploaded but program not found for template setup"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload certificate");
    }
  };

  async function onSubmit() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSuccessCount(0);
    setFailureCount(0);
    setCurrentProgress(0);

    if (allTemplates.length === 0) {
      toast.error(
        "No templates available! Please upload a certificate template first."
      );
      return;
    }

    const selectedTemplate = allTemplates[selectedIndex];
    if (!selectedTemplate) {
      toast.error("Please select a template before generating certificates!");
      return;
    }

    if (selectedScholars.length === 0) {
      toast.error(
        "Please select at least one scholar before generating certificates!"
      );
      return;
    }

    setShowProgressDialog(true);

    const tempFilenames: string[] = [];
    let tempSuccessCount = 0;
    let tempFailureCount = 0;

    for (let i = 0; i < selectedScholars.length; i++) {
      const scholarUuid = selectedScholars[i];

      try {
        const result = await generateCertificate({
          programSlug: masterProgram?.slug ?? "",
          scholarUuid,
          openingProgramUuid: program?.uuid ?? "",
          bgImage: selectedTemplate,
        }).unwrap();

        tempSuccessCount++;
        setSuccessCount(tempSuccessCount);

        if (result.fileName) {
          tempFilenames.push(result.fileName);
        }

        setCurrentProgress(((i + 1) / selectedScholars.length) * 100);
      } catch (error) {
        console.error("Error generating certificate:", error);
        tempFailureCount++;
        setFailureCount(tempFailureCount);
      }
    }

    if (tempSuccessCount > 0 && tempFilenames.length > 0) {
      try {
        const blob = await downloadZip({ filenames: tempFilenames }).unwrap();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificates-${program?.slug || "batch"}-${
          new Date().toISOString().split("T")[0]
        }.zip`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Generated certificates successfully!");
      } catch (downloadError) {
        console.error("Error downloading ZIP:", downloadError);
        toast.error("Failed to download certificates as ZIP.");

        tempFilenames.forEach((filename, index) => {
          setTimeout(() => {
            window.open(filename, "_blank");
          }, index * 500);
        });
      }
    }

    if (tempFailureCount > 0) {
      toast.error(
        `${tempFailureCount} certificates failed to generate. Please try again.`
      );
    }

    timeoutRef.current = setTimeout(() => {
      setShowProgressDialog(false);
    }, 3000);
  }

  if (!slug) {
    return <div>Loading...</div>;
  }

  if (isErrorScholars) {
    console.error("Error loading scholars:", scholarError);
    return <div>Error loading scholars</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const target = e.target;
            if (
              target instanceof HTMLButtonElement &&
              target.type === "submit"
            ) {
              return;
            }
            e.preventDefault();
          }
        }}
      >
        <div className="flex flex-col gap-4 p-6 space-y-6 h-[90vh]">
          <div className="flex justify-between items-center gap-10">
            <Heading
              title={(slug ?? "")
                .replace(/-/g, " ")
                .replace(/\b\w/g, (ch) => ch.toUpperCase())}
              description="Generate Certificates"
            />
          </div>

          <div className="flex gap-10 justify-between">
            <div className="flex flex-col gap-4 w-full max-w-xl">
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Upload New Certificate Template
                </label>
                <FileUploader
                  value={files}
                  onValueChange={(newFiles) => {
                    setFiles(newFiles);
                  }}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-accent rounded-lg p-2 mt-2"
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
              </div>

              {files && files.length > 0 && (
                <Button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={isLoading || isSettingUpTemplate}
                  className="w-full cursor-pointer"
                >
                  {isLoading
                    ? "Uploading..."
                    : isSettingUpTemplate
                    ? "Adding to templates..."
                    : "Upload & Add to Templates"}
                </Button>
              )}

              {allTemplates.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Choose Template ({allTemplates.length} available)
                  </h4>

                  <div className="mb-4">
                    <Image
                      src={
                        allTemplates[selectedIndex] ?? "/images/placeholder.png"
                      }
                      alt={program?.title ?? "selected template"}
                      width={300}
                      height={200}
                      className="object-cover rounded-md border-2 border-primary"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.png";
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: Template {selectedIndex + 1}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {allTemplates.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleTemplateSelection(i)}
                        className={`relative rounded-md overflow-hidden cursor-pointer border-2 p-0 transition-all ${
                          selectedIndex === i
                            ? "border-primary border-4 scale-105"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        aria-label={`Select template ${i + 1}`}
                        title={`Select template ${i + 1}`}
                      >
                        <Image
                          src={src}
                          alt={`${program?.title ?? "template"} ${i + 1}`}
                          width={140}
                          height={40}
                          className="object-cover w-full h-auto"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.png";
                          }}
                        />

                        {selectedIndex === i && (
                          <div className="absolute inset-0 bg-primary bg-opacity-20 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                              ✓
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1 w-full gap-3">
              <h4 className="text-sm font-medium">
                Choose Scholars ({selectedScholars.length} selected)
                {selectedScholars.length === 0 && (
                  <span className="text-red-500 text-xs ml-2">*</span>
                )}
              </h4>
              {isLoadingScholars ? (
                <Skeleton className="h-96 w-full rounded-md" />
              ) : (
                <ScholarTable
                  columns={scholarColumn}
                  totalItems={scholarsForCertificate.length}
                  data={scholarsForCertificate}
                  onSelectionChange={handleScholarSelection}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-primary hover:bg-primary/90 transition-colors cursor-pointer"
              type="submit"
              disabled={isGenerating || isDownloadingZip}
            >
              {isGenerating
                ? "Generating..."
                : isDownloadingZip
                ? "Downloading..."
                : `Generate Certificate${
                    selectedScholars.length > 1 ? "s" : ""
                  }`}
            </Button>
          </div>

          <AlertDialog
            open={showProgressDialog}
            onOpenChange={setShowProgressDialog}
          >
            <AlertDialogContent className="min-w-xl bg-accent">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  {currentProgress === 100 && successCount > 0
                    ? "Generation Complete!"
                    : "Generating Certificates"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Please wait while we generate your certificates. This process
                  may take a few moments.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex flex-col items-center justify-center w-full gap-4 p-6">
                <div className="w-full space-y-3">
                  <Progress value={currentProgress} className="w-full" />

                  <div className="text-center text-sm">
                    <p>
                      {successCount} of {selectedScholars.length} certificates
                      generated
                    </p>

                    {isDownloadingZip && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span>Downloading...</span>
                      </div>
                    )}

                    {failureCount > 0 && (
                      <p className="text-red-500 mt-1">
                        {failureCount} failed to generate
                      </p>
                    )}
                  </div>
                </div>

                {currentProgress === 100 && (
                  <p className="text-xs text-gray-500">
                    This dialog will close automatically in 3 seconds
                  </p>
                )}
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
}
