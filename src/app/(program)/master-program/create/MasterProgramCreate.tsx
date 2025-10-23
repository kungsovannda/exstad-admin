"use client";

import MasterProgramForm, { MasterProgramFormValues } from "./FormField";
import { useCreateMasterProgramMutation } from "@/features/master-program/masterProgramApi";
import { generateSlug } from "@/services/generate-slug";
import type { MasterProgramCreate } from "@/types/program";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Define the shape of possible backend errors
interface BackendError {
  reason: string;
}

interface ApiErrorData {
  error?: {
    description?: BackendError[];
  };
  message?: string;
}

interface ApiErrorResponse {
  data?: ApiErrorData;
  message?: string;
}

export default function MasterProgramCreate() {
  const [createMasterProgram] = useCreateMasterProgramMutation();
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const router = useRouter();
  const handleSubmit = async (values: MasterProgramFormValues) => {
    const payload: MasterProgramCreate = {
      ...values,
      slug: isSlugEdited ? values.slug : generateSlug(values.title),
      programType: values.programType!,
      programLevel: values.programLevel!,
      visibility: values.visibility!,
    };

    try {
      toast.loading("Creating...");
      await createMasterProgram(payload).unwrap();
      toast.dismiss();
      toast.success("Created successfully!");
      router.push("/master-program");
    } catch (err: unknown) {
      toast.dismiss();

      // Type guard to check if error has data structure
      const isApiError = (error: unknown): error is ApiErrorResponse => {
        return typeof error === "object" && error !== null && "data" in error;
      };

      if (isApiError(err)) {
        const backendErrors = err.data?.error?.description;

        if (Array.isArray(backendErrors) && backendErrors.length > 0) {
          backendErrors.forEach((e) => toast.error(e.reason));
        } else {
          const message = err.data?.message || err.message || "Failed to create program.";
          toast.error(message);
        }
      } else if (err instanceof Error) {
        // Generic JS error
        toast.error(err.message);
      } else {
        // Unknown error type
        toast.error("Failed to create program.");
      }
    }
  };

  return (
    <MasterProgramForm
      onSubmit={handleSubmit}
      submitLabel="Create"
      onSlugEdited={() => setIsSlugEdited(true)}
    />
  );
}
