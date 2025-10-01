"use client";

import { useState, useEffect } from "react";
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
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

type Props = { openingProgramUuid: string };

export default function TimelinePage({ openingProgramUuid }: Props) {
  const { data: timelines = [], isLoading,isFetching, isError } =
    useGetAllTimelineQuery(openingProgramUuid, { refetchOnMountOrArgChange: true });

  const [putTimelines] = useUpdateTimelineMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentTimeline, setCurrentTimeline] = useState<TimelineType | null>(null);

  // Local copy for drag-and-drop or temporary edits
  const [localTimelines, setLocalTimelines] = useState<TimelineType[]>([]);

  // Initialize localTimelines when timelines change
useEffect(() => {
  if (timelines && localTimelines.length === 0) {
    setLocalTimelines(
      timelines.map((t, index) => ({
        ...t,
        _clientId: t._clientId ?? `${t.title}-${index}`,
      }))
    );
  }
}, [timelines, localTimelines.length]);


  // Convert TimelineType to API payload
  const toPayload = (t: TimelineType): TimelinePayload => ({
    title: t.title,
    startDate: t.startDate,
    endDate: t.endDate,
  });

  // Update timeline list and sync to backend
  const updateTimelines = async (updated: TimelineType[]) => {
    const payload = updated.map(toPayload);
    try {
      await putTimelines({ openingProgramUuid, timelines: payload }).unwrap();
      setLocalTimelines(updated); // keep local state in sync
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to update timeline: ${message || err}`);
    }
  };

  // Add/Edit timeline
  const handleSaveTimeline = async (data: TimelineFormValues, target?: TimelineType) => {
    let updated: TimelineType[];
    if (target) {
      updated = localTimelines.map(t =>
        t._clientId === target._clientId ? { ...t, ...data } : t
      );
    } else {
      updated = [
        ...localTimelines,
        { ...data, _clientId: `${data.title}-${Date.now()}` },
      ];
    }
    await updateTimelines(updated);
  };

  // Delete timeline
  const handleDeleteTimeline = async (target: TimelineType) => {
    const updated = localTimelines.filter(t => t._clientId !== target._clientId);
    await updateTimelines(updated);
    toast.success(`Timeline "${target.title}" deleted!`);
  };

  // Handle drag-and-drop reorder
  const handleReorder = async (newData: TimelineType[]) => {
    await updateTimelines(newData);
  };

  // Handle date change from table
  const handleDateChange = async (rowId: string, field: "startDate" | "endDate", date: string) => {
    const updated = localTimelines.map(t =>
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

  if (isLoading) return <div>Loading timelines...</div>;
  if (isError) return <div className="text-destructive">Failed to load timelines</div>;

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
          trigger={<Button className="font-bold cursor-pointer">Add Timeline</Button>}
        />
      </div>

      {/* Table */}
      {isFetching ? (
        <DataTableSkeleton columnCount={5} />
      ):
      localTimelines.length === 0 ? (
        <div className="text-muted-foreground">
          No timelines yet. Add one to get started!
        </div>
      ) : (
        <TimelineTable
          data={localTimelines}
          totalItems={localTimelines.length}
          columns={columns}
          onReorder={handleReorder}
        />
      )}
    </div>
  );
}
