"use client";

import { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CloudUpload, QrCode, X } from "lucide-react";
import { FileUploader, FileInput } from "@/components/ui/file-upload";
import Image from "next/image";
import { MasterProgramType } from "@/types/program";
import { openingProgramType } from "@/types/opening-program";
import { UseFormReturn } from "react-hook-form";
import { OpeningProgramFormValue } from "@/app/(program)/opening-program/create/FormField";
import QRCodeGeneratorModal from "@/components/qr-code-generator";

interface QrForm extends UseFormReturn<OpeningProgramFormValue> {
  _qrCodeFile?: File;
}

export function QrCodeUploadField({
  form,
  masterProgram,
  openingProgram,
  onPreviewChange,
  initslug = "slug",
}: {
  form: QrForm;
  masterProgram: MasterProgramType | undefined;
  openingProgram: Partial<openingProgramType>;
  onPreviewChange?: (url: string | null) => void;
  initslug?: string;
}) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerateQrOpen, setIsGenerateQrOpen] = useState(false);

  useEffect(() => {
    const existing = form.getValues("qrCodeUrl");
    if (existing) {
      setPreviewUrl(existing);
      onPreviewChange?.(existing);
    }
  }, [form, onPreviewChange]);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  };

  function setPreview(file: File | null) {
    if (!file) {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFiles(null);
      form.setValue("qrCodeUrl", "");
      onPreviewChange?.(null);
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    setFiles([file]);
    form.setValue("qrCodeUrl", blobUrl, { shouldValidate: false });
    onPreviewChange?.(blobUrl);
  }

  const handleFileChange = (newFiles: File[] | null) => {
    setPreview(newFiles?.[0] ?? null);
  };

  const handleGenerateQr = async (file: File) => {
    setPreview(file);
    form._qrCodeFile = file;
  };

  const removeFile = () => setPreview(null);

  useEffect(() => {
    form._qrCodeFile = files?.[0];
  }, [files, form]);

  return (
    <FormField
      control={form.control}
      name="qrCodeUrl"
      render={() => (
        <FormItem>
          <FormControl>
            <>
              {!previewUrl && (
                <div className="grid grid-cols-1 gap-3">
                  {/* Upload Button */}
                  <FileUploader
                    value={files}
                    onValueChange={handleFileChange}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-accent rounded-lg p-2 cursor-pointer"
                  >
                    <FileInput className="outline-dashed outline-1 outline-slate-500">
                      <div className="flex items-center justify-center flex-col p-6 w-full">
                        <CloudUpload className="text-gray-600 w-10 h-10" />
                        <p className="text-sm text-gray-600">Upload QR Code</p>
                      </div>
                    </FileInput>
                  </FileUploader>

                  {/* Generate Button */}
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex gap-2 items-center justify-center"
                    onClick={() => setIsGenerateQrOpen(true)}
                  >
                    <QrCode className="w-5 h-5" />
                    Generate QR Code
                  </Button>
                </div>
              )}

              {previewUrl && (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <Button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 w-6 h-6"
                  >
                    <X className="w-3 h-3" />
                  </Button>

                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="QR preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </>
          </FormControl>

          <FormMessage />

          <QRCodeGeneratorModal
            open={isGenerateQrOpen}
            onOpenChange={setIsGenerateQrOpen}
            onFileGenerated={handleGenerateQr}
            initialText={`${process.env.NEXT_PUBLIC_FRONTEND_URL_OPENING}/${openingProgram.slug}`}
          />
        </FormItem>
      )}
    />
  );
}
