"use client";

import OpeningProgramForm, { OpeningProgramFormValue } from "./form-field";
import { useCreateOpeningProgramMutation } from "@/features/opening-program/openingProgramApi";
import { openingProgramCreate } from "@/types/opening-program";
import { toast } from "sonner";

export default function OpeningProgramCreate() {
  const [createOpeningProgram] = useCreateOpeningProgramMutation();

  const handleSubmit = async (values: OpeningProgramFormValue) => {
    const thumbnailUrl = values.thumbnail || "";

    const originalFee = values.price;
    const priceAfterDiscount = originalFee - (originalFee * values.scholarship) / 100;

    const payload: openingProgramCreate = {
      programUuid: values.programUuid,
      title: values.title,
      slug: `${values.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      generation: values.generation,
      programType: values.programType || "",
      price: priceAfterDiscount,
      scholarship: values.scholarship,
      originalFee: originalFee,
      duration: values.duration || "N/A",
      curriculumPdfUri: values.curriculumPdfUri || "",
      thumbnail: thumbnailUrl,
      totalSlot: values.totalSlot,
      telegramGroup: values.telegramGroup,
      status: "OPEN",
      qrCodeUrl: "",
    };

    toast.promise(createOpeningProgram(payload).unwrap(), {
      loading: "Creating...",
      success: "Created successfully!",
      error: (err) => `Failed: ${err.message || err}`,
    });
  };

  return <OpeningProgramForm onSubmit={handleSubmit} submitLabel="Create" />;
}
