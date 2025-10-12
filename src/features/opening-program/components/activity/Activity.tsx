"use client";

import { useState, useMemo } from "react";
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

interface Props {
  masterProgram: { uuid: string; slug: string };
  openingProgram: { uuid: string; generation: number };
}

export default function ActivityAdmin({ masterProgram, openingProgram }: Props) {
  const { data: activitiesData, isLoading, isFetching, isError } =
    useGetAllActivityQuery(openingProgram.uuid, { refetchOnMountOrArgChange: true });

  const activities: ActivityType[] = Array.isArray(activitiesData) ? activitiesData : [];

  const [putActivities] = useUpdateActivityMutation();
  const [createDocument] = useCreateDocumentMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);

  const activitiesWithUid = useMemo(
    () =>
      activities.map((a, index) => ({
        ...a,
        uid: `${a.title}-${index}`,
      })),
    [activities]
  );

  if (isLoading) return <div>Loading activities...</div>;
  if (isError) return <div className="text-destructive">Failed to load activities</div>;

  const toPayload = (a: ActivityType): ActivityPayload => ({
    title: a.title,
    description: a.description,
    image: a.image,
  });

  const handleSaveActivity = async (data: ActivityFormValues, file?: File, target?: ActivityType) => {
    try {
      const safeActivities = Array.isArray(activities) ? activities : [];
      let newActivities: ActivityType[];
      
      // Handle file upload if a new file was provided
      let imageUrl = data.image;
      
      if (file) {
        const toastId = toast.loading("Uploading image...");
        
        try {
          const uploadResult = await createDocument({
            file,
            programSlug: masterProgram.slug,
            gen: openingProgram.generation,
            documentType: "activity",
            filename: file.name,
          }).unwrap();
          
          // Get the URI from the upload result
          imageUrl = uploadResult.uri;
          
          toast.dismiss(toastId);
        } catch (uploadError) {
          toast.dismiss(toastId);
          throw new Error("Failed to upload image");
        }
      }

      const activityData = { ...data, image: imageUrl };

      if (target) {
        newActivities = safeActivities.map((a) =>
          a.title === target.title &&
          a.description === target.description &&
          a.image === target.image
            ? { ...a, ...activityData }
            : a
        );
      } else {
        newActivities = [...safeActivities, activityData];
      }

      const payload = newActivities.map(toPayload);
      await putActivities({ openingProgramUuid: openingProgram.uuid, activities: payload }).unwrap();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save: ${message}`);
      throw err;
    }
  };

  const handleDeleteActivity = async (target: ActivityType) => {
    try {
      const safeActivities = Array.isArray(activities) ? activities : [];
      const newActivities = safeActivities.filter(
        (a) =>
          !(a.title === target.title &&
            a.description === target.description &&
            a.image === target.image)
      );

      const payload = newActivities.map(toPayload);
      await putActivities({ openingProgramUuid: openingProgram.uuid, activities: payload }).unwrap();
      toast.success(`Activity "${target.title}" deleted!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete: ${message}`);
    }
  };

  const columns = ActivityColumns(activities, {
    onEdit: (activity: ActivityType) => {
      setCurrentActivity(activity);
      setModalOpen(true);
    },
    onDelete: async (activity: ActivityType) => await handleDeleteActivity(activity),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-lg font-semibold">Activities</h1>

        <ActivityFormModal
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) {
              setCurrentActivity(null);
            }
          }}
          masterProgram={masterProgram}
          openingProgram={openingProgram}
          initialData={currentActivity || undefined}
          onSubmitActivity={async (data, file) => {
            await handleSaveActivity(data, file, currentActivity || undefined);
          }}
          trigger={<Button className="font-bold cursor-pointer">Add Activity</Button>}
        />
      </div>

      {isFetching ? (
        <DataTableSkeleton columnCount={4} />
      )  : (
        <ActivityTable
          data={activitiesWithUid}
          totalItems={activities.length}
          columns={columns}
        />
      )}
    </div>
  );
}