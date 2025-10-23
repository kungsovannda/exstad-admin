"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ActivityFormModal, { ActivityFormValues } from "./AcitivityModal";
import ActivityTable from "@/features/opening-program/components/activity/table/activity-table";
import {
  ActivityPayload,
  useGetAllActivityQuery,
  useUpdateActivityMutation,
} from "@/features/opening-program/components/activity/activityApi";
import { useCreateDocumentMutation } from "@/features/document/documentApi";
import { toast } from "sonner";
import { ActivityType } from "@/types/opening-program";
import { ActivityColumns } from "@/features/opening-program/components/activity/table/activityColumn";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import generateFilename from "@/services/generate-filename";

interface Props {
  masterProgram: { uuid: string; slug: string };
  openingProgram: { uuid: string; generation: number };
}

export default function ActivityAdmin({
  masterProgram,
  openingProgram,
}: Props) {
  const {
    data: activitiesData,
    isLoading,
    isFetching,
    isError,
  } = useGetAllActivityQuery(openingProgram.uuid, {
    refetchOnMountOrArgChange: true,
  });

  const activities: ActivityType[] = Array.isArray(activitiesData)
    ? activitiesData
    : [];
  const [localActivities, setLocalActivities] = useState<ActivityType[]>([]);

  const [putActivities] = useUpdateActivityMutation();
  const [createDocument] = useCreateDocumentMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(
    null
  );

  // Initialize localActivities when fetched
  useEffect(() => {
    // Compare arrays by length or a simple shallow equality
    if (activities.length !== localActivities.length) {
      setLocalActivities(activities);
    }
  }, [activities, localActivities]);

  if (isLoading) return <div>Loading activities...</div>;
  if (isError)
    return <div className="text-destructive">Failed to load activities</div>;

  const handleSaveActivity = async (
    data: ActivityFormValues,
    file?: File,
    target?: ActivityType
  ) => {
    try {
      let imageUrl = data.image;

      // Handle file upload
      if (file) {
        const toastId = toast.loading("Uploading image...");
        try {
          const uploadResult = await createDocument({
            file,
            programSlug: masterProgram.slug,
            gen: openingProgram.generation,
            documentType: "activity",
            filename: generateFilename({
              type: "activity",
              program: masterProgram.slug,
              generation: String(openingProgram.generation),
            }),
          }).unwrap();
          imageUrl = uploadResult.uri;
          toast.dismiss(toastId);
        } catch {
          toast.dismiss(toastId);
          throw new Error("Failed to upload image");
        }
      }

      const activityData: ActivityType = { ...data, image: imageUrl };

      let newActivities: ActivityType[];
      if (target) {
        // Edit: replace and move to top
        newActivities = [
          activityData,
          ...localActivities.filter((a) => a !== target),
        ];
      } else {
        // New: add to top
        newActivities = [activityData, ...localActivities];
      }

      // Save to backend
      const payload: ActivityPayload[] = newActivities.map((a) => ({
        title: a.title,
        description: a.description,
        image: a.image,
      }));
      await putActivities({
        openingProgramUuid: openingProgram.uuid,
        activities: payload,
      }).unwrap();

      // Update local state
      setLocalActivities(newActivities);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save: ${message}`);
      throw err;
    }
  };

  const handleDeleteActivity = async (target: ActivityType) => {
    try {
      const newActivities = localActivities.filter((a) => a !== target);
      const payload: ActivityPayload[] = newActivities.map((a) => ({
        title: a.title,
        description: a.description,
        image: a.image,
      }));
      await putActivities({
        openingProgramUuid: openingProgram.uuid,
        activities: payload,
      }).unwrap();
      setLocalActivities(newActivities);
      toast.success(`Activity "${target.title}" deleted!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete: ${message}`);
    }
  };

  const columns = ActivityColumns(localActivities, {
    onEdit: (activity) => {
      setCurrentActivity(activity);
      setModalOpen(true);
    },
    onDelete: async (activity) => await handleDeleteActivity(activity),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-lg font-semibold">Activities</h1>

        <ActivityFormModal
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setCurrentActivity(null);
          }}
          masterProgram={masterProgram}
          openingProgram={openingProgram}
          initialData={currentActivity || undefined}
          onSubmitActivity={async (data, file) => {
            await handleSaveActivity(data, file, currentActivity || undefined);
          }}
          trigger={
            <Button className="font-bold cursor-pointer">Add Activity</Button>
          }
        />
      </div>

      {isFetching ? (
        <DataTableSkeleton columnCount={4} />
      ) : (
        <ActivityTable
          data={localActivities}
          totalItems={localActivities.length}
          columns={columns}
        />
      )}
    </div>
  );
}
