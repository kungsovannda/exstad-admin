"use client";

import OpeningProgramForm, { OpeningProgramFormValue } from "./form-field";
import { useCreateOpeningProgramMutation } from "@/features/opening-program/openingProgramApi";
import { generateSlug } from "@/services/generate-slug";
import { openingProgramCreate } from "@/types/opening-program";
import { toast } from "sonner";

export default function OpeningProgramCreate() {
  const [createOpeningProgram] = useCreateOpeningProgramMutation();

  const handleSubmit = async (values: OpeningProgramFormValue) => {
    try {
      // Ensure numbers
      const generation = Number(values.generation || 0);
      const totalSlot = Number(values.totalSlot || 0);
      const originalFee = Number(values.originalFee || 0);
      const scholarship = Number(values.scholarship || 0);

      // Calculate discounted price
      const price = originalFee - (originalFee * scholarship) / 100;

      // Replace local file URL with placeholder or uploaded URL
      const thumbnailUrl =
        values.thumbnail && values.thumbnail.startsWith("http")
          ? values.thumbnail
          : "https://example.com/thumbnails/fsd.png";

      const posterUrl =
        values.posterUrl && values.posterUrl.startsWith("http")
          ? values.posterUrl
          : "https://example.com/thumbnails/fsd.png";

      const qrCodeUrl = 
        values.qrCodeUrl && values.qrCodeUrl.startsWith("http")
          ? values.qrCodeUrl
          : "https://example.com/thumbnails/fsd.png"

      const curriculumPdfUri = values.curriculumPdfUri || "";

      const payload: openingProgramCreate = {
        programUuid: values.programUuid,
        title: values.title,
        slug: generateSlug(values.title),
        generation,
        price,
        scholarship,
        originalFee,
        duration: values.duration || "N/A",
        curriculumPdfUri,
        thumbnail: thumbnailUrl,
        posterUrl: posterUrl,
        totalSlot,
        telegramGroup: values.telegramGroup || "",
        status: "OPEN",
        qrCodeUrl: qrCodeUrl,
        deadline: values.deadline,
      };

      console.log("Submitting payload:", payload);

      await toast.promise(createOpeningProgram(payload).unwrap(), {
        loading: "Creating...",
        success: "Created successfully!",
        error: (err) => `Failed: ${err.message || err}`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to create: ${message || err}`);
    }
  };

  return <OpeningProgramForm onSubmit={handleSubmit} submitLabel="Create" />;
}
