"use client";

import { useEffect, useState } from "react";
import { useCreateDocumentMutation } from "@/features/document/documentApi";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CloudUpload, X } from "lucide-react";
import { FileUploader, FileInput } from "@/components/ui/file-upload";
import Image from "next/image";
import { MasterProgramType } from "@/types/program";
import { openingProgramType } from "@/types/opening-program";
import { UseFormReturn } from "react-hook-form";
import { OpeningProgramFormValue } from "../../opening-program/create/form-field";

export function PosterUploadField({
  form,
  masterProgram,
  openingProgram,
}: {
  form: UseFormReturn<OpeningProgramFormValue>;
  masterProgram: MasterProgramType | undefined;
  openingProgram: Partial<openingProgramType>; // only need generation
}) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [createDocument] = useCreateDocumentMutation();

  // Preload existing poster when editing
  useEffect(() => {
    const existing = form.getValues("posterUrl");
    if (existing) {
      setPreviewUrl(existing);
    }
  }, [form]);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 10, // 10MB max
    multiple: false,
  };

  const handleFileChange = async (newFiles: File[] | null) => {
    setFiles(newFiles);

    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
      const blobUrl = URL.createObjectURL(file);

      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);

      setPreviewUrl(blobUrl);

      const programSlug = masterProgram?.slug;
      const generation = openingProgram.generation;

      if (!programSlug || !generation) {
        form.setError("posterUrl", {
          message: "Select Master Program and Generation first",
        });
        return;
      }

      try {
        const res = await createDocument({
          file,
          programSlug,
          gen: generation,
          documentType: "poster", // <-- changed
          filename: "",
        }).unwrap();

        form.setValue("posterUrl", res.uri, { shouldValidate: true });
        setPreviewUrl(res.uri);

        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Upload failed:", error);
        form.setError("posterUrl", { message: "Failed to upload poster" });
      }
    } else {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFiles(null);
      form.setValue("posterUrl", "");
    }
  };

  const removeFile = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFiles(null);
    form.setValue("posterUrl", "");
  };

  return (
    <FormField
      control={form.control}
      name="posterUrl"
      render={() => (
        <FormItem>
          <FormControl>
            <div className="space-y-4 mt-2">
              {!previewUrl ? (
                <FileUploader
                  value={files}
                  onValueChange={handleFileChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-accent rounded-lg p-2"
                >
                  <FileInput className="outline-dashed outline-1 outline-slate-500">
                    <div className="flex items-center justify-center flex-col p-8 w-full">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF (max 10MB)
                      </p>
                    </div>
                  </FileInput>
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
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      {previewUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <Image
                          src={previewUrl}
                          alt="Poster preview"
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <p className="text-center text-sm">
                          {files?.[0]?.name || "Uploaded file"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
