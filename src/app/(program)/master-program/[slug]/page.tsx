"use client";

import MasterProgramForm, { MasterProgramFormValues } from "../create/form-field";
import { useUpdateMasterProgramMutation, useGetMasterProgramBySlugQuery } from "@/features/master-program/masterProgramApi";
import { toast } from "sonner";
import { useParams } from "next/navigation";

 function MasterProgramEdit() {
  const params = useParams();
  const programSlug = params.slug as string;

  const { data: program, isLoading, error } =
    useGetMasterProgramBySlugQuery({ slug: programSlug }, { refetchOnMountOrArgChange: true });

  const [updateMasterProgram] = useUpdateMasterProgramMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error || !program) return <div>Program not found</div>;

  // Map API data to form values
  const initialValues: MasterProgramFormValues = {
    ...program,
    programType: program.programType!,   // assert defined
    programLevel: program.programLevel!,
    visibility: program.visibility!,
  };

  const handleSubmit = (values: MasterProgramFormValues) => {
    const payload = {
      ...values,
      slug: program.slug,
      programType: values.programType!,
      programLevel: values.programLevel!,
      visibility: values.visibility!,
    };

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

export default function Page() {
  return (
    <div className="p-5 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Edit Program</h1>
      <div className="w-[70%]">
        <MasterProgramEdit />
      </div>
    </div>
  );
}
