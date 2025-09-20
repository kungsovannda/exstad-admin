"use client";

import OpeningProgramForm, { OpeningProgramFormValue } from "../create/form-field";
import { useUpdateOpeningProgramMutation, useGetOpeningProgramBySlugQuery } from "@/features/opening-program/openingProgramApi";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function OpeningProgramEdit() {
  const params = useParams(); // get { slug } from the URL
  const programSlug = params?.slug as string;

  // Fetch program by slug
  const { data: openingProgram, isLoading, error } = useGetOpeningProgramBySlugQuery({ slug: programSlug });
  const [updateOpeningProgram] = useUpdateOpeningProgramMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error || !openingProgram) return <div>Program not found</div>;

  const initialValues: OpeningProgramFormValue = {
    ...openingProgram,
  };

  const handleSubmit = (values: OpeningProgramFormValue) => {
    const payload = {
      ...values,
      slug: openingProgram.slug, // keep existing slug
    };

    toast.promise(
      updateOpeningProgram({ uuid: openingProgram.uuid, body: payload }).unwrap(),
      {
        loading: "Updating...",
        success: "Updated successfully!",
        error: (err) => `Failed: ${err.message || err}`,
      }
    );
  };

  return <OpeningProgramForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Update" />;
}
