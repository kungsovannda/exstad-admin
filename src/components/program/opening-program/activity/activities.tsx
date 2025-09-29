"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ActivityModal, { ActivityFormValues } from "./acitivity-modal";
import ActivityTable from "@/features/opening-program/components/activity/table/activity-table";
import {
  ActivityPayload,
  useGetAllActivityQuery,
  useUpdateActivityMutation,
} from "@/features/opening-program/components/activity/activityApi";
import { toast } from "sonner";
import { ActivityType } from "@/types/opening-program";
import { ActivityColumns } from "@/features/opening-program/components/activity/table/activityColumn";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

type Props = { openingProgramUuid: string };

export default function ActivityAdmin({ openingProgramUuid }: Props) {
  const { data: activitiesData, isLoading,isFetching, isError } =
    useGetAllActivityQuery(openingProgramUuid, { refetchOnMountOrArgChange: true });

  // Always ensure activities is an array
  const activities: ActivityType[] = Array.isArray(activitiesData) ? activitiesData : [];

  const [putActivities] = useUpdateActivityMutation();

  // Single modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);

  // Stable uid for rendering
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

  // Convert ActivityType to payload for API
  const toPayload = (a: ActivityType): ActivityPayload => ({
    title: a.title,
    description: a.description,
    image: a.image,
  });

  // Add/Edit activity
  const handleSaveActivity = async (data: ActivityFormValues, target?: ActivityType) => {
    try {
      const safeActivities = Array.isArray(activities) ? activities : [];
      let newActivities: ActivityType[];

      if (target) {
        // Edit existing
        newActivities = safeActivities.map((a) =>
          a.title === target.title &&
          a.description === target.description &&
          a.image === target.image
            ? { ...a, ...data }
            : a
        );
      } else {
        // Add new
        newActivities = [...safeActivities, { ...data }];
      }

      const payload = newActivities.map(toPayload);
      await putActivities({ openingProgramUuid, activities: payload }).unwrap();
      toast.success(target ? "Activity updated!" : "Activity added!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save: ${message || err}`);
    }
  };

  // Delete activity
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
      await putActivities({ openingProgramUuid, activities: payload }).unwrap();
      toast.success(`Activity "${target.title}" deleted!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete: ${message || err}`);
    }
  };

  // Columns with parent callbacks
  const columns = ActivityColumns(activities, {
    onEdit: (activity: ActivityType) => {
      setCurrentActivity(activity);
      setModalOpen(true);
    },
    onDelete: async (activity: ActivityType) => await handleDeleteActivity(activity),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-lg font-semibold">Activities</h1>

        {/* Add Activity button */}
        <ActivityModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          initialData={currentActivity || undefined}
          onSubmitActivity={async (data) => {
            await handleSaveActivity(data, currentActivity || undefined);
            setModalOpen(false);
            setCurrentActivity(null);
          }}
          trigger={<Button className="font-bold cursor-pointer">Add Activity</Button>}
        />
      </div>

      {/* Activity Table */}

      {isFetching ? (
        <DataTableSkeleton columnCount={4} />
      ) :
      activitiesWithUid.length === 0 ? (
        <div className="text-muted-foreground">
          No activities yet. Add one to get started!
        </div>
      ) : (
        <ActivityTable
          data={activitiesWithUid}
          totalItems={activities.length}
          columns={columns}
        />
      )}
    </div>
  );
}
