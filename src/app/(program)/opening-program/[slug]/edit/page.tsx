"use client";

import OpeningProgramForm, { OpeningProgramFormValue } from "../../create/FormField";
import {
  useUpdateOpeningProgramMutation,
  useGetOpeningProgramBySlugQuery,
} from "@/features/opening-program/openingProgramApi";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { useEffect, useState } from "react";
import Loader from "@/app/loading";

function OpeningProgramEdit() {
  const params = useParams();
  const router = useRouter();
  const programSlug = params?.slug as string;

  const { data: openingProgram, isLoading, error, refetch, } = useGetOpeningProgramBySlugQuery(
    { slug: programSlug },
    { refetchOnMountOrArgChange: true }
  );

  const { data: masterPrograms = [] } = useGetAllMasterProgramsQuery();
  const [updateOpeningProgram] = useUpdateOpeningProgramMutation();
  const [formKey, setFormKey] = useState(0); //  used to re-render form when data updates

  if (isLoading) return  <Loader/>;
  if (error || !openingProgram) return <div>Program not found</div>;

  // Map programName from backend to UUID
  const programUuid =
    masterPrograms.find((p) => p.title === openingProgram.programName)?.uuid || "";

  const initialValues: OpeningProgramFormValue = {
    title: openingProgram.title || "",
    telegramGroup: openingProgram.telegramGroup || "",
    generation: openingProgram.generation || 0,
    originalFee: openingProgram.originalFee || 0,
    scholarship: openingProgram.scholarship || 0,
    price: openingProgram.price || 0,
    totalSlot: openingProgram.totalSlot || 0,
    duration: openingProgram.duration || "",
  deadline: openingProgram.deadline
    ? new Date(openingProgram.deadline) 
    : new Date(),    thumbnail: openingProgram.thumbnail || "",
    posterUrl: openingProgram.posterUrl || "",
    slug: openingProgram.slug || "",
    status: openingProgram.status || "DRAFT",
    qrCodeUrl: openingProgram.qrCodeUrl || "",
    curriculumPdfUri: openingProgram.curriculumPdfUri || "",
    programUuid,
    registerFee:openingProgram.registerFee || 0,
  };

  const handleSubmit = async (values: OpeningProgramFormValue) => {
    const payload = {
      ...values,
      slug: values.slug,
      status: values.status ?? "OPEN",
      deadline: values.deadline.toISOString(), // ✅ convert Date -> string

    };

    try {
      await toast.promise(
        updateOpeningProgram({
          uuid: openingProgram.uuid,
          body: payload,
        }).unwrap(),
        {
          loading: "Updating...",
          success: "Updated successfully!",
          error: (err) => `Failed: ${err.message || err}`,
        }
      );

      // ✅ After successful update, re-fetch new data
      await refetch();

      // ✅ Force re-render form with new data (to reflect new image URLs immediately)
      setFormKey((prev) => prev + 1);

      // ✅ Optional redirect
      router.push("/opening-program");

    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <OpeningProgramForm
      key={formKey} // ✅ important — ensures UI fully refreshes
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel="Update"
    />
  );
}

export default function Page() {
  return (
    <div className="p-5 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Edit Opening Program</h1>
      <div className="w-[70%]">
        <OpeningProgramEdit />
      </div>
    </div>
  );
}