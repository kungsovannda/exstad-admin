"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import HighlightsFormModal from "./highlight-modal";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { toast } from "sonner";
import { SquarePen, Trash } from "lucide-react";
import { useGetAllHighlightQuery } from "./highlightApi";
import { HighlightType } from "@/types/program";

type Props = {
  programUuid: string;
};

export default function HighlightsAdmin({ programUuid }: Props) {
  // RTK Query
   const { data: highlights = [], isLoading, isError,error } =useGetAllHighlightQuery(programUuid, {
      refetchOnMountOrArgChange: true,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HighlightType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HighlightType | null>(null);

  if (isLoading) return <div>Loading highlights...</div>;
  if (isError) return <div className="text-destructive">Failed to load highlights</div>;

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Highlights</h2>

        {/* Create Modal */}
        <HighlightsFormModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmitHighlight={(data) => {
            toast.success("Highlight created!");
            setIsCreateOpen(false);
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
      {highlights.map((h) => (
        <div
          key={`${h.label}-${h.value}`} 
          className="flex justify-between items-center bg-accent rounded-sm p-4"
        >
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold text-foreground">
              {h.label} - {h.value}
            </span>
            <span className="text-[12px] text-muted-foreground">{h.desc}</span>
          </div>

          <div className="flex gap-2 items-center">
            {/* Delete */}
            <Trash
              size={16}
              className="text-destructive cursor-pointer"
              onClick={() => setDeleteTarget(h)}
            />

            {/* Edit Modal */}
            <HighlightsFormModal
              open={!!editTarget && editTarget.id === h.id}
              onOpenChange={(open) => !open && setEditTarget(null)}
              initialData={editTarget || undefined}
              onSubmitHighlight={(data) => {
                toast.success("Highlight updated!");
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
      ))}

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.label || ""}
        onConfirm={() => {
          toast.success("Highlight deleted!");
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
