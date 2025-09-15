"use client";

import OpeningProgramForm,{OpeningProgramFormValue} from "../create/form-field";
import { useUpdateOpeningProgramMutation,useGetOpeningProgramByUuidQuery } from "@/features/opening-program/openingProgramApi";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function OpeningProgramEdit() {
  const params = useParams(); // get { uuid } from the URL
  const uuid = params?.uuid as string;

  const { data: openingProgram, isLoading, error } = useGetOpeningProgramByUuidQuery({ uuid });
  const [updateOpeningProgram] = useUpdateOpeningProgramMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error || !openingProgram) return <div>Program not found</div>;

  // Convert numeric fields to strings for the form
  const initialValues: OpeningProgramFormValue = {
    ...openingProgram,
  };

  const handleSubmit = (values: OpeningProgramFormValue) => {
    const payload = {
      ...values,
      slug: openingProgram.slug, // keep existing slug
      // price: Number(values.price),
      // scholarship: Number(values.scholarship),
    };
    toast.promise(updateOpeningProgram({ uuid: openingProgram.uuid, body: payload }).unwrap(), {
      loading: "Updating...",
      success: "Updated successfully!",
      error: (err) => `Failed: ${err.message || err}`,
    });
  };

  return <OpeningProgramForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Update" />;
}
