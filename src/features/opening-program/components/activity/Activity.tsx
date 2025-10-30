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
import Loader from "@/app/loading";

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
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);

  // --- Initialize local state when fetched
  // Make sure every incoming activity has a stable, unique _clientId
  useEffect(() => {
    if (!activities) return;

    const withIds = activities.map((a, index) => ({
      ...a,
      // keep existing _clientId if present; otherwise generate one predictable-ish
      // (title-index used to avoid collisions; you can replace with crypto.randomUUID())
      _clientId: a._clientId ?? `${a.title ?? "activity"}-${index}`,
    }));

    // Only set when IDs changed to avoid stomping user edits during DnD
    const incomingIds = withIds.map((x) => x._clientId).join(",");
    const localIds = localActivities.map((x) => x._clientId).join(",");
    if (incomingIds !== localIds) {
      setLocalActivities(withIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  if (isLoading) return <Loader />;
  if (isError) return <div className="text-destructive">Failed to load activities</div>;

  // ✅ Handle reorder (drag & drop)
  const handleReorder = async (newData: ActivityType[]) => {
    try {
      setLocalActivities(newData); // update UI instantly

      const payload: ActivityPayload[] = newData.map((a) => ({
        title: a.title,
        description: a.description,
        image: a.image,
        // optionally include order index if your backend supports it
        // orderIndex: newData.findIndex(n => n._clientId === a._clientId),
      }));

      await putActivities({
        openingProgramUuid: openingProgram.uuid,
        activities: payload,
      }).unwrap();

      toast.success("Activities reordered successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to reorder: ${message}`);
    }
  };

  // ✅ Handle create / update
  const handleSaveActivity = async (
    data: ActivityFormValues,
    file?: File,
    target?: ActivityType
  ) => {
    try {
      let imageUrl = data.image;
      // Upload image if any
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

      // Ensure we always have a stable _clientId
      const newClientId = target?._clientId ?? crypto.randomUUID();
      const activityData: ActivityType = {
        ...data,
        image: imageUrl,
        _clientId: newClientId,
      };

      let newActivities: ActivityType[];
      if (target) {
        // Edit existing (keep order)
        newActivities = localActivities.map((a) =>
          a._clientId === target._clientId ? { ...a, ...activityData } : a
        );
      } else {
        // New: add to top (if you prefer append, change accordingly)
        newActivities = [activityData, ...localActivities];
      }

      // Save
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save: ${message}`);
      throw err;
    }
  };

  const handleDeleteActivity = async (target: ActivityType) => {
    try {
      const newActivities = localActivities.filter(
        (a) => a._clientId !== target._clientId
      );
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
          onSubmitActivity={async (data, file) =>
            await handleSaveActivity(data, file, currentActivity || undefined)
          }
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
          onReorder={handleReorder} // ✅ connect reorder handler
        />
      )}
    </div>
  );
}
