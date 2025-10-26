"use client";

import MasterProgramForm, { MasterProgramFormValues } from "../create/FormField";
import {
  useUpdateMasterProgramMutation,
  useGetMasterProgramBySlugQuery,
} from "@/features/master-program/masterProgramApi";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/app/loading";

function MasterProgramEdit() {
  const params = useParams();
  const programSlug = params.slug as string;
  const router = useRouter();

  const { data: program, isLoading, error,refetch } = useGetMasterProgramBySlugQuery(
    { slug: programSlug },
    { refetchOnMountOrArgChange: true }
  );

  const [updateMasterProgram, { isLoading: isUpdating }] =
    useUpdateMasterProgramMutation();
  const [formKey, setFormKey] = useState(0); 

  if (isLoading) return  <Loader/>
  if (error || !program) return <div>Master Program not found</div>;

  const initialValues: MasterProgramFormValues = {
    title: program.title || "",
    slug: program.slug || "",
    subtitle: program.subtitle || "",
    description: program.description || "",
    visibility: program.visibility ,
    programType: program.programType || "SCHOLARSHIP" ,
    programLevel: program.programLevel ,
    logoUrl: program.logoUrl || "",
    thumbnailUrl:program.thumbnailUrl || "",
    bgColor:
      program.bgColor ||
      "linear-gradient(90deg, rgba(96,165,250,1) 0%, rgba(168,85,247,1) 100%)",
  };

  const handleSubmit = async (values: MasterProgramFormValues) => {
    const payload = {
      ...values,
      programType: values.programType || "SCHOLARSHIP",
      programLevel: values.programLevel || "BASIC",
      visibility: values.visibility || "PUBLIC",
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
      await refetch();
      router.push("/master-program");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  

  return (
    <MasterProgramForm
      key={formKey} 
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel={isUpdating ? "Updating..." : "Update"}
    />
  );
}

export default function Page() {
  return (
    <div className="p-5 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Edit Master Program</h1>
      <div className="w-[70%]">
        <MasterProgramEdit />
      </div>
    </div>
  );
}
