'use client';

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
// import { PiNotePencilFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import HighlightsFormModal from "./form-field";
import DeleteModal from "../../activity/delete-modal-component";
import { toast } from "sonner";
// import { FaTrash } from "react-icons/fa";
import { SquarePen, Trash } from "lucide-react";

type Highlight = {
  id: string;
  label: string;
  value: string;
  desc: string;
};

const initialHighlights: Highlight[] = [
  { id: "1", label: "Project-based", value: "2 projects", desc: "Build real-world IT projects." },
  { id: "2", label: "Duration", value: "12 AGU", desc: "Flexible study schedule." },
  { id: "3", label: "Scholarship", value: "20%", desc: "Early bird discount." },
  { id: "4", label: "Price", value: "$499", desc: "Full course fee." },
];

export default function HighlightsAdmin() {
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
  const [editTarget, setEditTarget] = useState<Highlight | null>(null);
  const [openModal, setOpenModal] = useState(false);
  

  // Track which highlight is being deleted
  const [deleteTarget, setDeleteTarget] = useState<Highlight | null>(null);

  const handleAddHighlight = (data: Omit<Highlight, "id">) => {
    const newHighlight: Highlight = { id: Date.now().toString(), ...data };
    setHighlights(prev => [...prev, newHighlight]);
    toast.success("Highlight added successfully!");
  };

  const handleEditHighlight = (data: Omit<Highlight, "id">) => {
    if (!editTarget) return;
    setHighlights(prev =>
      prev.map(h => (h.id === editTarget.id ? { ...h, ...data } : h))
    );
    toast.success("Highlight updated successfully!");
    setEditTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setHighlights(prev => prev.filter(h => h.id !== deleteTarget.id));
    toast.success("Highlight deleted successfully!");
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Highlights</h2>
        <HighlightsFormModal
          open={openModal}
          onOpenChange={setOpenModal}
          onSubmitHighlight={handleAddHighlight}
          trigger={
            <Button>
              <FiPlus />
              <span className="ml-2 font-bold">Add Highlight</span>
            </Button>
          }
        />
      </div>

      {/* Highlight List */}
      {highlights.map(h => (
        <div key={h.id} className="flex justify-between items-center bg-accent rounded-sm p-4">
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

            {/* Edit */}
            <HighlightsFormModal
              open={!!editTarget && editTarget.id === h.id}
              onOpenChange={setOpenModal}
              initialData={h}
              onSubmitHighlight={handleEditHighlight}
              trigger={
                <SquarePen
                  size={16}
                  className="text-primary-hover cursor-pointer"
                  onClick={() => {
                    setEditTarget(h);
                    setOpenModal(true);
                  }}
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
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
