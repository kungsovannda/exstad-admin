"use client";

import React, { useState, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import HighlightsFormModal, { HighlightFormValues } from "./highlight-modal";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { toast } from "sonner";
import { SquarePen, Trash } from "lucide-react";
import {
  useGetAllHighlightQuery,
  useUpdateHighlightsMutation,
} from "./highlightApi";
import { HighlightPayload, HighlightType } from "@/types/program";

type Props = { programUuid: string };

export default function HighlightsAdmin({ programUuid }: Props) {
  const { data: highlights = [], isLoading, isError } =
    useGetAllHighlightQuery(programUuid, { refetchOnMountOrArgChange: true });

  const [putHighlights] = useUpdateHighlightsMutation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HighlightType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HighlightType | null>(null);

  const highlightsWithUid = useMemo(
    () => (highlights ?? []).map((h) => ({ ...h, uid: crypto.randomUUID() })),
    [highlights]
  );

  if (isLoading) return <div>Loading highlights...</div>;
  if (isError) return <div className="text-destructive">Failed to load highlights</div>;

  const handleSaveHighlight = async (data: HighlightFormValues, target?: HighlightType) => {
    try {
      const safeHighlights = highlights ?? [];
      let newHighlights: HighlightType[];

      if (target) {
        newHighlights = safeHighlights.map((h) =>
          h.label === target.label && h.value === target.value && h.desc === target.desc
            ? { ...h, ...data }
            : h
        );
      } else {
        newHighlights = [...safeHighlights, { ...data }];
      }

      const payload: HighlightPayload[] = newHighlights.map(({ label, value, desc }) => ({
        label,
        value,
        desc,
      }));

      await putHighlights({ programUuid, highlights: payload }).unwrap();
      toast.success(target ? "Highlight updated!" : "Highlight added!");
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message || err}`);
    }
  };

  const handleDeleteHighlight = async (target: HighlightType) => {
    try {
      const safeHighlights = highlights ?? [];
      const newHighlights = safeHighlights.filter(
        (h) =>
          !(h.label === target.label && h.value === target.value && h.desc === target.desc)
      );

      const payload: HighlightPayload[] = newHighlights.map(({ label, value, desc }) => ({
        label,
        value,
        desc,
      }));

      await putHighlights({ programUuid, highlights: payload }).unwrap();
      toast.success(`Highlight "${target.label}" deleted!`);
    } catch (err: any) {
      toast.error(`Failed to delete: ${err.message || err}`);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Highlights</h2>

        <HighlightsFormModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmitHighlight={async (data) => {
            await handleSaveHighlight(data);
            setIsCreateOpen(false); // close modal after save
          }}
          trigger={
            <Button>
              <FiPlus />
              <span className="font-bold">Add Highlight</span>
            </Button>
          }
        />
      </div>

      {/* Highlight List */}
      {highlightsWithUid.length === 0 ? (
        <div className="text-muted-foreground">
          No highlights yet. Add one to get started!
        </div>
      ) : (
        highlightsWithUid.map((h) => (
          <div
            key={h.uid}
            className="flex justify-between items-center bg-accent rounded-sm p-4"
          >
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-foreground">
                {h.label} - {h.value}
              </span>
              <span className="text-[12px] text-muted-foreground">{h.desc}</span>
            </div>

            <div className="flex gap-2 items-center">
              <Trash
                size={16}
                className="text-destructive cursor-pointer"
                onClick={() => setDeleteTarget(h)}
              />

              <HighlightsFormModal
                open={
                  !!editTarget &&
                  editTarget.label === h.label &&
                  editTarget.value === h.value &&
                  editTarget.desc === h.desc
                }
                onOpenChange={(open) => !open && setEditTarget(null)}
                initialData={editTarget || undefined}
                onSubmitHighlight={async (data) => {
                  if (editTarget) await handleSaveHighlight(data, editTarget);
                  setEditTarget(null); // close modal after edit
                }}
                trigger={
                  <SquarePen
                    size={16}
                    className="text-primary-hover cursor-pointer"
                    onClick={() => setEditTarget(h)}
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
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.label || ""}
        onConfirm={async () => {
          if (deleteTarget) await handleDeleteHighlight(deleteTarget);
          setDeleteTarget(null); // close after delete
        }}
      />
    </div>
  );
}
