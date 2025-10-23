  "use client";

  import React, { useState, useMemo, useEffect } from "react";
  import { FiPlus } from "react-icons/fi";
  import { Button } from "@/components/ui/button";
  import HighlightsFormModal, { HighlightFormValues } from "./HighlightModal";
  import DeleteModal from "@/features/master-program/components/delete-modal-component";
  import { toast } from "sonner";
  import { SquarePen, Trash } from "lucide-react";
  import {
    useGetAllHighlightQuery,
    useUpdateHighlightsMutation,
  } from "./highlightApi";
  import { HighlightPayload, HighlightType } from "@/types/program";
  import { SectionSkeleton } from "../section-skeleton";
import ModalDelete from "@/components/modal/ModalDelete";

  type Props = { programUuid: string };

  export default function HighlightsAdmin({ programUuid }: Props) {
    const { data: highlights, isLoading, isError } = useGetAllHighlightQuery(
      programUuid,
      { refetchOnMountOrArgChange: true }
    );

    const [putHighlights] = useUpdateHighlightsMutation();

    // ✅ Local state
    const [localHighlights, setLocalHighlights] = useState<HighlightType[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<HighlightType | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<HighlightType | null>(null);

    // Normalize server data
    useEffect(() => {
      const safeHighlights = Array.isArray(highlights) ? highlights : [];
      setLocalHighlights(safeHighlights);
      setHasChanges(false);
    }, [highlights]);

    // Add UID to each highlight for React keys
    const highlightsWithUid = useMemo(
      () =>
        (localHighlights ?? []).map((h) => ({
          ...h,
          uid: crypto.randomUUID(),
        })),
      [localHighlights]
    );

    if (isLoading) return <SectionSkeleton count={4} />;
    if (isError)
      return <div className="text-destructive">Failed to load highlights</div>;

    // ✅ Local add/edit
    const handleSaveHighlightLocal = (
      data: HighlightFormValues,
      target?: HighlightType
    ) => {
      const newHighlights = target
        ? localHighlights.map((h) =>
            h.label === target.label &&
            h.value === target.value &&
            h.desc === target.desc
              ? { ...h, ...data }
              : h
          )
        : [...localHighlights, { ...data }];

      setLocalHighlights(newHighlights);
      setHasChanges(true);
    };

    // ✅ Local delete only
    const handleDeleteHighlightLocal = (target: HighlightType) => {
      const newHighlights = localHighlights.filter(
        (h) =>
          !(
            h.label === target.label &&
            h.value === target.value &&
            h.desc === target.desc
          )
      );

      setLocalHighlights(newHighlights);
      setHasChanges(true);

      toast.info(`Highlight "${target.label}" deleted!`);
    };

    // ✅ Save all to backend
    const handleSaveAll = async () => {
      try {
        const payload: HighlightPayload[] = localHighlights.map(
          ({ label, value, desc }) => ({ label, value, desc })
        );
        await putHighlights({ programUuid, highlights: payload }).unwrap();
        toast.success("All highlights saved!");
        setHasChanges(false);
      } catch (err: unknown) {
        const backendErrors =
              (err as {
                data?: { error?: { description?: { reason: string; field?: string }[] } };
              })?.data?.error?.description;
        
            if (Array.isArray(backendErrors) && backendErrors.length > 0) {
              backendErrors.forEach((e) => {
                toast.error(`${e.reason}`);
              });
            } else {
              const message = err instanceof Error ? err.message : String(err);
              toast.error(`Failed to save: ${message}`);
            }
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
            onSubmitHighlight={(data) => {
              handleSaveHighlightLocal(data);
              setIsCreateOpen(false);
            }}
            trigger={
              <Button>
                <FiPlus />
                <span className="font-bold cursor-pointer">Add Highlight</span>
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
                  onClick={() => {
                    setDeleteTarget(h);
                  }}
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
                  onSubmitHighlight={(data) => {
                    if (editTarget) handleSaveHighlightLocal(data, editTarget);
                    setEditTarget(null);
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
        <ModalDelete
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title={deleteTarget ? `Delete ${deleteTarget?.label }?`: ""}
          description={deleteTarget ? `Are you sure you want to delete ${deleteTarget?.label}? This action can not be undone `: ""}
          onDelete={() => {
            if (deleteTarget) handleDeleteHighlightLocal(deleteTarget);
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
            Save All Highlights
          </Button>
        </div>
      </div>
    );
  }
