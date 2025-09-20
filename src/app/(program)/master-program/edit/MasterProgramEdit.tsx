"use client";

import MasterProgramForm, { MasterProgramFormValues } from "../create/form-field";
import { useUpdateMasterProgramMutation, useGetMasterProgramBySlugQuery } from "@/features/master-program/masterProgramApi";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function MasterProgramEdit() {
  const params = useParams();
  const programSlug = params.slug as string;

  // Use the slug endpoint directly
  const { data: program, isLoading, error } =
   useGetMasterProgramBySlugQuery({ slug: programSlug },  { refetchOnMountOrArgChange: true } );
  const [updateMasterProgram] = useUpdateMasterProgramMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error || !program) return <div>Program not found</div>;

  const initialValues: MasterProgramFormValues = { ...program };

  const handleSubmit = (values: MasterProgramFormValues) => {
    const payload = { ...values, slug: program.slug };
    toast.promise(
      updateMasterProgram({ uuid: program.uuid, body: payload }).unwrap(),
      {
        loading: "Updating...",
        success: "Updated successfully!",
        error: (err) => `Failed: ${err.message || err}`,
      }
    );
  };

  return <MasterProgramForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Update" />;
}
