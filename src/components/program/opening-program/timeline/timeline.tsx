"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TimelineModal, { TimelineFormValues } from "./timeline-modal";
import TimelineTable from "@/features/opening-program/components/timeline/table/timeline-table";
import {
  TimelinePayload,
  useGetAllTimelineQuery,
  useUpdateTimelineMutation,
} from "@/features/opening-program/components/timeline/timelineApi";
import { toast } from "sonner";
import { TimelineType } from "@/types/opening-program";
import { TimelineColumns } from "@/features/opening-program/components/timeline/table/timelineColumn";

type Props = { openingProgramUuid: string };

export default function TimelinePage({ openingProgramUuid }: Props) {
  const { data: timelines = [], isLoading, isError } =
    useGetAllTimelineQuery(openingProgramUuid, { refetchOnMountOrArgChange: true });

  const [putTimelines] = useUpdateTimelineMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentTimeline, setCurrentTimeline] = useState<TimelineType | null>(null);
  const [localTimelines, setLocalTimelines] = useState<TimelineType[]>([]);


  // Ensure each timeline has a stable _clientId
  const timelinesWithId = useMemo(
    () =>
      timelines.map((t, index) => ({
        ...t,
        _clientId: t._clientId ?? `${t.title}-${index}`,
      })),
    [timelines]
  );
  useEffect(() => {
  setLocalTimelines(timelinesWithId);
}, [timelinesWithId]);

const handleReorder = async (newData: TimelineType[]) => {
  setLocalTimelines(newData); // update UI immediately
  const payload = newData.map(toPayload);
  try {
    await putTimelines({ openingProgramUuid, timelines: payload }).unwrap();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    toast.error(`Failed to reorder timeline: ${message || err}`);
  }
};


  if (isLoading) return <div>Loading timelines...</div>;
  if (isError) return <div className="text-destructive">Failed to load timelines</div>;

  // Convert TimelineType to payload for API
  const toPayload = (t: TimelineType): TimelinePayload => ({
    title: t.title,
    startDate: t.startDate,
    endDate: t.endDate,
  });

  // Update timeline list and sync to backend
  const updateTimelines = async (updated: TimelineType[]) => {
    const payload = updated.map(toPayload);
    await putTimelines({ openingProgramUuid, timelines: payload }).unwrap();
  };

  // Add/Edit timeline
  const handleSaveTimeline = async (data: TimelineFormValues, target?: TimelineType) => {
    try {
      let updated: TimelineType[];
      if (target) {
        updated = timelinesWithId.map(t =>
          t._clientId === target._clientId ? { ...t, ...data, _clientId: t._clientId } : t
        );
      } else {
        updated = [...timelinesWithId, { ...data, _clientId: `${data.title}-${Date.now()}` }];
      }
      await updateTimelines(updated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save timeline: ${message || err}`);
    }
  };

  // Delete timeline
  const handleDeleteTimeline = async (target: TimelineType) => {
    try {
      const updated = timelinesWithId.filter(t => t._clientId !== target._clientId);
      await updateTimelines(updated);
      toast.success(`Timeline "${target.title}" deleted!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete timeline: ${message || err}`);
    }
  };

  // Handle date change from table
  const handleDateChange = async (rowId: string, field: "startDate" | "endDate", date: string) => {
    const updated = timelinesWithId.map(t =>
      t._clientId === rowId ? { ...t, [field]: date } : t
    );
    await updateTimelines(updated);
  };

  // Columns with callbacks
  const columns = TimelineColumns(handleDateChange, {
    onEdit: (timeline) => {
      setCurrentTimeline(timeline);
      setModalOpen(true);
    },
    onDelete: async (timeline) => await handleDeleteTimeline(timeline),
  });

  
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-lg font-semibold">Timeline</h1>

        <TimelineModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          initialData={currentTimeline || undefined}
          onSubmitTimeline={async (data) => {
            await handleSaveTimeline(data, currentTimeline || undefined);
            setModalOpen(false);
            setCurrentTimeline(null);
          }}
          trigger={<Button className="font-bold">Add Timeline</Button>}
        />
      </div>

      {/* Table */}
      {timelinesWithId.length === 0 ? (
        <div className="text-muted-foreground">
          No timelines yet. Add one to get started!
        </div>
      ) : (
        <TimelineTable
          data={timelinesWithId}
          totalItems={timelines.length}
          columns={columns}
            onReorder={handleReorder}
        />
      )}
    </div>
  );
}
