"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import ProgramOverviewFormModal, { ProgramOverviewFormValue } from "./programOverview-modal";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { toast } from "sonner";
import { SquarePen, Trash } from "lucide-react";
import { useGetAllProgramOverviewQuery, useUpdateProgramOverviewMutation } from "./programOverviewApi";
import { programOverviewsPayload, programOverviewType } from "@/types/program";
import { SectionSkeleton } from "../section-skeleton";

type Props = { programUuid: string };

export default function ProgramOverviewAdmin({ programUuid }: Props) {
  const { data: programOverviews = [], isLoading, isError } =
    useGetAllProgramOverviewQuery(programUuid, { refetchOnMountOrArgChange: true });

  const [putProgramOverview] = useUpdateProgramOverviewMutation();

  // ✅ Local state
  const [localOverviews, setLocalOverviews] = useState<programOverviewType[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<programOverviewType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<programOverviewType | null>(null);

  // Load server data into local state
  useEffect(() => {
    setLocalOverviews(programOverviews);
    setHasChanges(false);
  }, [programOverviews]);

  const overviewsWithUid = useMemo(
    () =>
      (localOverviews ?? []).map(o => ({
        ...o,
        uid: crypto.randomUUID()
      })),
    [localOverviews]
  );

  if (isLoading) return <SectionSkeleton count={4} />;
  if (isError) return <div className="text-destructive">Failed to load program overviews</div>;

  // ✅ Local add/edit
  const handleSaveOverviewLocal = (data: ProgramOverviewFormValue, target?: programOverviewType) => {
    const newOverviews = target
      ? localOverviews.map(o =>
          o.title === target.title && o.description === target.description ? { ...o, ...data } : o
        )
      : [...localOverviews, { ...data }];

    setLocalOverviews(newOverviews);
    setHasChanges(true);
  };

  // ✅ Local delete only
  const handleDeleteOverviewLocal = (target: programOverviewType) => {
    const newOverviews = localOverviews.filter(
      o => !(o.title === target.title && o.description === target.description)
    );
    setLocalOverviews(newOverviews);
    setHasChanges(true);

    toast.info(`Program Overviews "${target.title}" deleted!`);
  };

  // ✅ Save all to backend
  const handleSaveAll = async () => {
    try {
      const payload: programOverviewsPayload[] = localOverviews.map(({ title, description }) => ({ title, description }));
      await putProgramOverview({ programUuid, programOverviews: payload }).unwrap();
      toast.success("All program overviews saved!");
      setHasChanges(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save: ${message || err}`);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Program Overviews</h2>

        <ProgramOverviewFormModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmitProgramOverview={data => {
            handleSaveOverviewLocal(data);
            setIsCreateOpen(false);
          }}
          trigger={
            <Button className="flex items-center gap-2.5">
              <FiPlus />
              <span className="font-bold cursor-pointer">Add Program Overview</span>
            </Button>
          }
        />
      </div>

      {/* Overview List */}
      {(overviewsWithUid ?? []).length === 0 ? (
        <div className="text-muted-foreground">No program overviews yet. Add one to get started!</div>
      ) : (
        overviewsWithUid.map(o => (
          <div key={o.uid} className="flex justify-between items-center bg-accent rounded-sm p-4">
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-foreground">{o.title}</span>
              <span className="text-[12px] text-muted-foreground">{o.description}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Trash
                size={16}
                className="text-destructive cursor-pointer"
                onClick={() => setDeleteTarget(o)}
              />
              <ProgramOverviewFormModal
                open={!!editTarget && editTarget.title === o.title && editTarget.description === o.description}
                onOpenChange={open => !open && setEditTarget(null)}
                initialData={editTarget || undefined}
                onSubmitProgramOverview={data => {
                  if (editTarget) handleSaveOverviewLocal(data, editTarget);
                  setEditTarget(null);
                }}
                trigger={
                  <SquarePen
                    size={16}
                    className="text-primary-hover cursor-pointer"
                    onClick={() => setEditTarget(o)}
                  />
                }
              />
            </div>
          </div>
        ))
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.title || ""}
        onConfirm={() => {
          if (deleteTarget) handleDeleteOverviewLocal(deleteTarget);
          setDeleteTarget(null);
        }}
      />

      {/* Save All Button */}
      <div className="flex justify-end mt-4">
        <Button
          variant={hasChanges ? "default" : "outline"}
          disabled={!hasChanges}
          onClick={handleSaveAll}
        >
          Save All Program Overviews
        </Button>
      </div>
    </div>
  );
}
