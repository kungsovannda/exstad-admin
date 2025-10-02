import { useCreateDocumentMutation } from "@/features/document/documentApi";
import { Button } from "@/components/ui/button";
import { CloudUpload, X } from "lucide-react";
import { FileUploader, FileInput } from "@/components/ui/file-upload";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import { ActivityFormValues } from "@/components/program/opening-program/activity/acitivity-modal";

export function ActivityUploadField({
  form,
  openingProgram,
  masterProgram,
}: {
  form: UseFormReturn<ActivityFormValues>;
  openingProgram: { uuid: string; generation: number };
  masterProgram: { uuid: string; slug: string };
}) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [createDocument] = useCreateDocumentMutation();

  // ✅ Move dropZoneConfig here
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

      const programSlug = masterProgram?.slug;  // Program slug from the master program
      const generation = openingProgram.generation;  // Generation from the opening program

      if (!programSlug || !generation) {
        form.setError("image", { message: "Select Program and Generation first" });
        return;
      }

      try {
        // Correct API endpoint format
        const res = await createDocument({
          file,
          programSlug,  // Use the programSlug from master program
          gen: generation,   // Use the generation from opening program
          documentType: "activity",
          filename: "",
        }).unwrap();

        form.setValue("image", res.uri, { shouldValidate: true });
        setPreviewUrl(res.uri);

        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Upload failed:", error);
        form.setError("image", { message: "Failed to upload activity file" });
      }
    } else {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFiles(null);
      form.setValue("image", "");
    }
  };

  const removeFile = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFiles(null);
    form.setValue("image", "");
  };

  return (
    <div className="space-y-4 mt-2">
      {!previewUrl ? (
        <FileUploader
          value={files}
          onValueChange={handleFileChange}
          dropzoneOptions={dropZoneConfig}  // ✅ now defined correctly
        >
          <FileInput className="outline-dashed outline-1 outline-slate-500">
            <div className="flex items-center justify-center flex-col p-8 w-full">
              <CloudUpload className="text-gray-500 w-10 h-10" />
              <p className="mb-1 text-sm text-gray-500">
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
            className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 w-6 h-6"
          >
            <X className="w-3 h-3" />
          </Button>

          <div className="space-y-2">
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              {previewUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <Image src={previewUrl} alt="Activity preview" fill className="object-contain" />
              ) : (
                <p className="text-center text-sm">{files?.[0]?.name || "Uploaded file"}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
