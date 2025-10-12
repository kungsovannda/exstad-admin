"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CloudUpload, X, FileText } from "lucide-react";
import { FileUploader, FileInput } from "@/components/ui/file-upload";
import { ActivityFormValues } from "@/features/opening-program/components/activity/AcitivityModal";
// Extend form to store actual File
export interface ActivityFormWithFile extends UseFormReturn<ActivityFormValues> {
  _activityFile?: File;
}

interface Props {
  form: ActivityFormWithFile;
  openingProgram: { uuid: string; generation: number };
  masterProgram: { uuid: string; slug: string };
  initialImage?: string | null; // pass existing image
}

export function ActivityUploadField({ form, openingProgram, masterProgram, initialImage }: Props) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);

  const dropZoneConfig = { maxFiles: 1, maxSize: 10 * 1024 * 1024, multiple: false };

  const handleFileChange = (newFiles: File[] | null) => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);

    setFiles(newFiles);

    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
      form._activityFile = file;
      form.setValue("image", blobUrl, { shouldValidate: false });
    } else {
      setPreviewUrl(initialImage || null);
      form._activityFile = undefined;
      form.setValue("image", initialImage || "");
    }
  };

  const removeFile = () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFiles(null);
    form._activityFile = undefined;
    form.setValue("image", "");
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isImage = files?.[0]?.type.startsWith("image/") || previewUrl?.startsWith("blob:") || !!initialImage;

  return (
    <div className="space-y-4 mt-2">
      {!previewUrl ? (
        <FileUploader
          value={files}
          onValueChange={handleFileChange}
          dropzoneOptions={dropZoneConfig}
          className="relative bg-accent rounded-lg p-2"
        >
          <FileInput className="outline-dashed outline-1 outline-slate-500">
            <div className="flex flex-col items-center justify-center p-8 w-full">
              <CloudUpload className="w-10 h-10 text-gray-500" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF (max 10MB)</p>
            </div>
          </FileInput>
        </FileUploader>
      ) : (
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
          <Button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 z-10 w-6 h-6 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
          >
            <X className="w-3 h-3" />
          </Button>

          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {isImage ? (
              <Image src={previewUrl!} alt="Activity preview" fill className="object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-600">
                <FileText className="w-10 h-10 mb-2" />
                <p className="text-sm">{files?.[0]?.name || "Uploaded file"}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
