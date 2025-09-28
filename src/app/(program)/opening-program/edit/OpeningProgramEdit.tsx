"use client";

import OpeningProgramForm, { OpeningProgramFormValue } from "../create/form-field";
import { useUpdateOpeningProgramMutation, useGetOpeningProgramBySlugQuery } from "@/features/opening-program/openingProgramApi";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";

export default function OpeningProgramEdit() {
  const params = useParams(); // get { slug } from the URL
  const programSlug = params?.slug as string;

  // Fetch program by slug
  const { data: openingProgram, isLoading, error } = useGetOpeningProgramBySlugQuery({ slug: programSlug });
   // Fetch all master programs
  const { data: masterPrograms = [] } = useGetAllMasterProgramsQuery();
  const [updateOpeningProgram] = useUpdateOpeningProgramMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error || !openingProgram) return <div>Program not found</div>;

    // Map programName from backend to UUID
  const programUuid =
    masterPrograms.find((p) => p.title === openingProgram.programName)?.uuid || "";

  const initialValues: OpeningProgramFormValue = {
    ...openingProgram,
    programUuid, // set the correct UUID for the Select
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
