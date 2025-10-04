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
import { OpeningProgramFormValue } from "@/app/(program)/opening-program/create/form-field";

// Extend form to include optional QR code File reference
interface QrForm extends UseFormReturn<OpeningProgramFormValue> {
  _qrCodeFile ?: File;
}

export function QrCodeUploadField({
  form,
  masterProgram,
  openingProgram,
  onPreviewChange,
}: {
  form: QrForm;
  masterProgram: MasterProgramType | undefined;
  openingProgram: Partial<openingProgramType>;
  onPreviewChange?: (url: string | null) => void;
}) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Preload existing QR code
  useEffect(() => {
    const existing = form.getValues("qrCodeUrl");
    if (existing) {
      setPreviewUrl(existing);
      onPreviewChange?.(existing);
    }
  }, [form, onPreviewChange]);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  };

  const handleFileChange = (newFiles: File[] | null) => {
    // Clean up previous blob URL
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);

    setFiles(newFiles);

    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
      const blobUrl = URL.createObjectURL(file);

      setPreviewUrl(blobUrl);
      onPreviewChange?.(blobUrl);

      // Only store blob URL for preview in form
      form.setValue("qrCodeUrl", blobUrl, { shouldValidate: false });
    } else {
      setPreviewUrl(null);
      setFiles(null);
      form.setValue("qrCodeUrl", "");
      onPreviewChange?.(null);
    }
  };

  const removeFile = () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFiles(null);
    form.setValue("qrCodeUrl", "");
    onPreviewChange?.(null);
  };

  // Keep actual file object separate from form state
  useEffect(() => {
    form._qrCodeFile  = files?.[0];
  }, [files, form]);

  return (
    <FormField
      control={form.control}
      name="qrCodeUrl"
      render={() => (
        <FormItem>
          <FormControl>
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

                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  {previewUrl.match(/\.(jpg|jpeg|png|gif)$/i) || previewUrl.startsWith("blob:") ? (
                    <Image
                      src={previewUrl}
                      alt="QR Code preview"
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
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
