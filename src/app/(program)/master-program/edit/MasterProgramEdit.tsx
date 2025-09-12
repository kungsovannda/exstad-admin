"use client";

import MasterProgramForm, { MasterProgramFormValues } from "../create/form-field";
import { useUpdateMasterProgramMutation, useGetMasterProgramByUuidQuery } from "@/features/master-program/masterProgramApi";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function MasterProgramEdit() {
  const params = useParams(); // get { uuid } from the URL
  const uuid = params?.uuid as string;

  const { data: program, isLoading, error } = useGetMasterProgramByUuidQuery({ uuid });
  const [updateMasterProgram] = useUpdateMasterProgramMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error || !program) return <div>Program not found</div>;

  // Convert numeric fields to strings for the form
  const initialValues: MasterProgramFormValues = {
    ...program,
    price: program.price?.toString() ?? "0",
    scholarship: program.scholarship?.toString() ?? "0",
  };

  const handleSubmit = (values: MasterProgramFormValues) => {
    const payload = {
      ...values,
      slug: program.slug, // keep existing slug
      price: Number(values.price),
      scholarship: Number(values.scholarship),
    };
    toast.promise(updateMasterProgram({ uuid: program.uuid, body: payload }).unwrap(), {
      loading: "Updating...",
      success: "Updated successfully!",
      error: (err) => `Failed: ${err.message || err}`,
    });
  };

  return <MasterProgramForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Update" />;
}
