"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddTopicDialog from "./add-topic-dialog";
import AddSectionDialog from "./section-dialog";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { SquarePen, Trash } from "lucide-react";
import {
  useGetAllRequirementsQuery,
  useUpdateRequirementsMutation,
} from "./requirementsApi";
import { RequirementsType } from "@/types/program";
import { SectionSkeleton } from "../section-skeleton";

type Props = { programUuid: string };

export default function CourseRequirementsAdmin({ programUuid }: Props) {
  const { data: requirements = [], isLoading, isError } =
    useGetAllRequirementsQuery(programUuid, {
      refetchOnMountOrArgChange: true,
    });

  const [updateRequirements] = useUpdateRequirementsMutation();

  // UI states
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null );
  const [editingSection, setEditingSection] = useState<{
    reqIndex: number;
    index: number;
  } | null>(null);
  const [addingSectionReqIndex, setAddingSectionReqIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "section";
    reqIndex?: number;
    index?: number;
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const toggleExpand = (id: string) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  if (isLoading) return <SectionSkeleton count={4}/>;
  if (isError)
    return <div className="text-destructive">Failed to load requirements</div>;

  // ======================
  // Handlers
  // ======================
  const handleSaveTopic = async (
    data: { title: string; subtitle: string },
    targetIndex?: number
  ) => {
    try {
      const safeRequirements = requirements ?? [];
      let newRequirements: RequirementsType[];

      if (targetIndex !== undefined) {
        newRequirements = safeRequirements.map((r, i) =>
          i === targetIndex ? { ...r, title: data.title, subtitle: data.subtitle } : r
        );
      } else {
        newRequirements = [
          ...safeRequirements,
          { id: crypto.randomUUID(), title: data.title, subtitle: data.subtitle || "", description: [] },
        ];
      }

      await updateRequirements({ programUuid, requirements: newRequirements }).unwrap();
      toast.success(targetIndex !== undefined ? "Topic updated!" : "Topic added!");
    } catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  toast.error(`Failed to save topic: ${message}`);
}
  };

  const handleSaveSection = async (
    reqIndex: number,
    data: { title: string },
    sectionIndex?: number
  ) => {
    try {
      const safeRequirements = requirements.map((r) => ({
        ...r,
        description: [...(r.description || [])],
      }));

      const req = safeRequirements[reqIndex];
      if (!req) return;

      const updatedReq =
        sectionIndex !== undefined
          ? { ...req, description: (req.description || []).map((d, i) => (i === sectionIndex ? data.title : d)) }
          : { ...req, description: [...(req.description || []), data.title] };
      safeRequirements[reqIndex] = updatedReq;

      await updateRequirements({ programUuid, requirements: safeRequirements }).unwrap();
      toast.success(sectionIndex !== undefined ? "Section updated!" : "Section added!");
    } catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  toast.error(`Failed to save section: ${message}`);
}

  };

  const handleDelete = async (type: "topic" | "section", reqIndex?: number, index?: number) => {
    try {
      const safeRequirements = [...requirements];
      let newRequirements: RequirementsType[];

      if (type === "topic" && reqIndex !== undefined) {
        newRequirements = safeRequirements.filter((_, i) => i !== reqIndex);
      } else if (type === "section" && reqIndex !== undefined && index !== undefined) {
        const req = { ...safeRequirements[reqIndex] };
        req.description = (req.description || []).filter((_, i) => i !== index);
        newRequirements = safeRequirements.map((r, i) => (i === reqIndex ? req : r));
      } else return;

      await updateRequirements({ programUuid, requirements: newRequirements }).unwrap();
      toast.success(type === "topic" ? "Topic deleted!" : "Section deleted!");
      setDeleteTarget(null);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete: ${message || err}`);
    }
  };

  // ======================
  // JSX
  // ======================
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Course Requirements</h2>

        <AddTopicDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          programUuid={programUuid}
          onSubmit={async (data) => {
            await handleSaveTopic(data);
            setIsCreateOpen(false);
          }}
          trigger={
            <Button>
              <FiPlus />
              <span className="text-[14px] font-bold cursor-pointer">Add Topic</span>
            </Button>
          }
        />
      </div>

      {(!requirements || requirements.length === 0) && (
        <div className="text-muted-foreground">No requirements yet. Add one!</div>
      )}

      {/* List */}
      {(requirements || []).map((req, reqIndex) => {
        const isExpanded = expandedItems.includes(String(reqIndex));
        const sections = req.description || [];

        return (
          <div key={req.id || reqIndex} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
            {/* Topic Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggleExpand(String(reqIndex))}>
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-foreground">{req.title}</span>
                  {req.subtitle && <span className="text-[12px] text-muted-foreground">{req.subtitle}</span>}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Trash size={16} className="text-destructive cursor-pointer" onClick={() => setDeleteTarget({ type: "topic", reqIndex })} />
                <SquarePen size={16} className="text-primary-hover cursor-pointer" onClick={() => setEditingTopicIndex(reqIndex)} />

                <AddTopicDialog
                  programUuid={programUuid}
                  open={editingTopicIndex === reqIndex}
                  onOpenChange={(open) => setEditingTopicIndex(open ? reqIndex : null)}
                  initialData={{ title: req.title, subtitle: req.subtitle }}
                  onSubmit={async (data) => {
                    await handleSaveTopic(data, reqIndex);
                    setEditingTopicIndex(null);
                  }}
                />

                <FaChevronDown
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                  onClick={() => toggleExpand(String(reqIndex))}
                />
              </div>
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {sections.map((desc, index) => (
                  <div key={index} className="flex justify-between items-center p-2.5 bg-background rounded-[4px]">
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">{desc}</span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Trash size={16} className="text-destructive cursor-pointer" onClick={() => setDeleteTarget({ type: "section", reqIndex, index })} />
                      <SquarePen size={16} className="text-primary-hover cursor-pointer" onClick={() => setEditingSection({ reqIndex, index })} />

                      <AddSectionDialog
                        programUuid={programUuid}
                        reqIndex={reqIndex}
                        open={editingSection?.reqIndex === reqIndex && editingSection?.index === index}
                        onOpenChange={(open) => !open && setEditingSection(null)}
                        initialData={{ title: desc }}
                        onSubmit={(data) => handleSaveSection(reqIndex, data, index)}
                      />
                    </div>
                  </div>
                ))}

                <Button className="flex w-fit items-center" onClick={() => setAddingSectionReqIndex(reqIndex)}>
                  <FiPlus />
                  <span className="text-[14px] font-semibold cursor-pointer">Add Section</span>
                </Button>

                {addingSectionReqIndex === reqIndex && (
                  <AddSectionDialog
                    programUuid={programUuid}
                    reqIndex={reqIndex}
                    open={true}
                    onOpenChange={(open) => !open && setAddingSectionReqIndex(null)}
                    onSubmit={(data) => handleSaveSection(reqIndex, data)}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.type === "topic" ? "topic" : "section"}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.type, deleteTarget.reqIndex, deleteTarget.index)}
      />
    </div>
  );
}
