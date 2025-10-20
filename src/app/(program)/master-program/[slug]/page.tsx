"use client";

import MasterProgramForm, { MasterProgramFormValues } from "../create/FormField";
import {
  useUpdateMasterProgramMutation,
  useGetMasterProgramBySlugQuery,
} from "@/features/master-program/masterProgramApi";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

function MasterProgramEdit() {
  const params = useParams();
  const programSlug = params.slug as string;
  const router = useRouter();

  const { data: program, isLoading, error } = useGetMasterProgramBySlugQuery(
    { slug: programSlug },
    { refetchOnMountOrArgChange: true }
  );

  const [updateMasterProgram, { isLoading: isUpdating }] =
    useUpdateMasterProgramMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error || !program) return <div>Program not found</div>;

  const initialValues: MasterProgramFormValues = {
    title: program.title || "",
    slug: program.slug || "",
    subtitle: program.subtitle || "",
    description: program.description || "",
    visibility: program.visibility || "PUBLIC",
    programType: program.programType || "",
    programLevel: program.programLevel || "",
    logoUrl: program.logoUrl || "",
    bgColor:
      program.bgColor ||
      "linear-gradient(90deg, rgba(96,165,250,1) 0%, rgba(168,85,247,1) 100%)",
  };

  const handleSubmit = async (values: MasterProgramFormValues) => {
    const payload = {
      ...values,
    };
    try {
      await toast.promise(
        updateMasterProgram({
          uuid: program.uuid,
          body: payload,
        }).unwrap(),
        {
          loading: "Updating...",
          success: "Updated successfully!",
          error: (err) => `Failed: ${err.message || err}`,
        }
      );
      router.push("/master-program");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  

  return (
    <MasterProgramForm
      key={program.uuid} 
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel={isUpdating ? "Updating..." : "Update"}
    />
  );
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
