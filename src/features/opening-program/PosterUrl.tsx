"use client";

import { useEffect, useState } from "react";
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
import { OpeningProgramFormValue } from "../../app/(program)/opening-program/create/FormField";

// Extend form to include optional poster File reference
interface PosterForm extends UseFormReturn<OpeningProgramFormValue> {
  _posterFile?: File;
}

export function PosterUploadField({
  form,
  masterProgram,
  openingProgram,
}: {
  form: PosterForm;
  masterProgram: MasterProgramType | undefined;
  openingProgram: Partial<openingProgramType>;
}) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Preload existing poster when editing
  useEffect(() => {
    const existing = form.getValues("posterUrl");
    if (existing) {
      setPreviewUrl(existing);
    }
  }, [form]);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  };

  const handleFileChange = (newFiles: File[] | null) => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);

    setFiles(newFiles);

    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
      const blobUrl = URL.createObjectURL(file);

      setPreviewUrl(blobUrl);

      // Only store blob URL for preview in form
      form.setValue("posterUrl", blobUrl, { shouldValidate: false });
    } else {
      setPreviewUrl(null);
      setFiles(null);
      form.setValue("posterUrl", "");
    }
  };

  const removeFile = () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFiles(null);
    form.setValue("posterUrl", "");
  };

  // Keep actual file object separate from form state
  useEffect(() => {
    form._posterFile = files?.[0];
  }, [files, form]);

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
                        <span className="font-semibold">Click to upload</span> or drag and drop
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
                      {previewUrl.match(/\.(jpg|jpeg|png|gif)$/i) || previewUrl.startsWith("blob:") ? (
                        <Image
                          src={previewUrl}
                          alt="Poster preview"
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <p className="text-center text-sm pt-4">
                          {files?.[0]?.name || "Uploaded file"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
