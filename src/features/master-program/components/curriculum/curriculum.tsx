"use client";

import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddTopicDialog from "../course-requirement/add-topic-dialog";
import AddSectionDialog from "../course-requirement/section-dialog";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { SquarePen, Trash } from "lucide-react";

import {
  useGetMasterCurriculumsQuery,
  useUpdateMasterCurriculumsMutation,
  useGetOpeningCurriculumsQuery,
  useUpdateOpeningCurriculumsMutation,
  CurriculumPayload,
} from "./curriculumApi";
import { CurriculumType } from "@/types/program";
import { SectionSkeleton } from "../section-skeleton";

type Props = {
  programUuid: string; // master program
  openingProgramUuid?: string; // optional opening program
};

export default function CurriculumAdmin({ programUuid, openingProgramUuid }: Props) {
  // Queries
  const { data: masterCurriculums, isLoading: isMasterLoading } = useGetMasterCurriculumsQuery(programUuid);
  const { data: openingCurriculums, isLoading: isOpeningLoading } = useGetOpeningCurriculumsQuery(
    openingProgramUuid ?? "",
    { skip: !openingProgramUuid }
  );

  // Mutations
  const [updateMasterCurriculums] = useUpdateMasterCurriculumsMutation();
  const [updateOpeningCurriculums] = useUpdateOpeningCurriculumsMutation();

  const [copied, setCopied] = useState(false);

  // Auto-copy Master -> Opening if opening is empty
  useEffect(() => {
    if (
      openingProgramUuid &&
      !copied &&
      (!openingCurriculums || openingCurriculums.length === 0) &&
      masterCurriculums?.length
    ) {
      const copiedCurriculums: CurriculumPayload[] = masterCurriculums.map(c => ({
        ...c,
        id: crypto.randomUUID(),
      }));

      updateOpeningCurriculums({ openingProgramUuid, curriculums: copiedCurriculums })
        .unwrap()
        .then(() => setCopied(true))
        .catch(err => console.error("Failed to copy master curriculum:", err));
    }
  }, [openingProgramUuid, openingCurriculums, masterCurriculums, updateOpeningCurriculums, copied]);

  const curriculums: CurriculumType[] =
    openingCurriculums?.length ? openingCurriculums : masterCurriculums ?? [];

  // UI states
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<number | null>(null);
  const [editingSection, setEditingSection] = useState<{ curriculumIndex: number; index: number } | null>(null);
  const [addingSectionCurriculumIndex, setAddingSectionCurriculumIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "curriculum" | "section"; curriculumIndex?: number; index?: number } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const toggleExpand = (id: string) =>
    setExpandedItems(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));

  if (isOpeningLoading || isMasterLoading) return <SectionSkeleton count={4}/>;
  if (!curriculums) return <div className="text-destructive">Failed to load curriculum</div>;

  const isOpening = !!openingProgramUuid; // detect if we are editing an opening program
  const canEdit = !!(programUuid || openingProgramUuid); // allow editing for both

  // ======================
  // Helper to call correct mutation
  // ======================
  const handleUpdateCurriculums = async (curriculumsToUpdate: CurriculumPayload[]) => {
    try {
      if (isOpening) {
        await updateOpeningCurriculums({ openingProgramUuid: openingProgramUuid!, curriculums: curriculumsToUpdate }).unwrap();
      } else {
        await updateMasterCurriculums({ programUuid, curriculums: curriculumsToUpdate }).unwrap();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to update curriculum: ${message}`);
      throw err;
    }
  };

  // ======================
  // Handlers
  // ======================
  const handleSaveCurriculum = async (data: { title: string; subtitle: string }, targetIndex?: number) => {
    if (!canEdit) return toast.error("Cannot edit program");

    const safeCurriculums = [...curriculums];
    const newCurriculums: CurriculumPayload[] =
      targetIndex !== undefined
        ? safeCurriculums.map((c, i) => (i === targetIndex ? { ...c, title: data.title, subtitle: data.subtitle } : c))
        : [
            ...safeCurriculums,
            {
              id: crypto.randomUUID(),
              order: safeCurriculums.length + 1,
              title: data.title,
              subtitle: data.subtitle || "",
              description: [],
            },
          ];

    await handleUpdateCurriculums(newCurriculums);
    toast.success(targetIndex !== undefined ? "Curriculum updated!" : "Curriculum added!");
  };

  const handleSaveSection = async (curriculumIndex: number, data: { title: string }, sectionIndex?: number) => {
    if (!canEdit) return toast.error("Cannot edit program");

    const safeCurriculums = curriculums.map(c => ({ ...c, description: [...(c.description ?? [])] }));
    const curriculum = safeCurriculums[curriculumIndex];
    if (!curriculum) return;

    const updatedCurriculum: CurriculumType =
      sectionIndex !== undefined
        ? { ...curriculum, description: curriculum.description.map((d, i) => (i === sectionIndex ? data.title : d)) }
        : { ...curriculum, description: [...curriculum.description, data.title] };

    safeCurriculums[curriculumIndex] = updatedCurriculum;
    await handleUpdateCurriculums(safeCurriculums);
  };

  const handleDelete = async (type: "curriculum" | "section", curriculumIndex?: number, index?: number) => {
    if (!canEdit) return toast.error("Cannot edit program");

    const safeCurriculums = [...curriculums];
    let newCurriculums: CurriculumType[] = safeCurriculums;

    if (type === "curriculum" && curriculumIndex !== undefined) {
      newCurriculums = safeCurriculums.filter((_, i) => i !== curriculumIndex);
    } else if (type === "section" && curriculumIndex !== undefined && index !== undefined) {
      const curriculum = { ...safeCurriculums[curriculumIndex] };
      curriculum.description = curriculum.description.filter((_, i) => i !== index);
      newCurriculums = safeCurriculums.map((c, i) => (i === curriculumIndex ? curriculum : c));
    } else return;

    await handleUpdateCurriculums(newCurriculums);
    toast.success(type === "curriculum" ? "Curriculum deleted!" : "Section deleted!");
    setDeleteTarget(null);
  };

  // ======================
  // JSX
  // ======================
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Curriculum</h2>

        {canEdit && (
          <AddTopicDialog
            programUuid={openingProgramUuid ?? programUuid}
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onSubmit={async data => {
              await handleSaveCurriculum(data);
              setIsCreateOpen(false);
            }}
            trigger={
              <Button className="flex items-center gap-2.5">
                <FiPlus />
                <span className="text-[14px] font-bold cursor-pointer">Add Curriculum</span>
              </Button>
            }
          />
        )}
      </div>

      {curriculums.length === 0 && <div className="text-muted-foreground">No curriculums yet.</div>}

      {curriculums.map((curriculum, curriculumIndex) => {
        const isExpanded = expandedItems.includes(String(curriculumIndex));
        return (
          <div key={curriculum.id || curriculumIndex} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
            {/* Curriculum Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggleExpand(String(curriculumIndex))}>
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-foreground">{curriculum.title}</span>
                  {curriculum.subtitle && <span className="text-[12px] text-muted-foreground">{curriculum.subtitle}</span>}
                </div>
              </div>

              {canEdit && (
                <div className="flex gap-2 items-center">
                  <Trash
                    size={16}
                    className="text-destructive cursor-pointer"
                    onClick={() => setDeleteTarget({ type: "curriculum", curriculumIndex })}
                  />
                  <SquarePen
                    size={16}
                    className="text-primary-hover cursor-pointer"
                    onClick={() => setEditingCurriculumIndex(curriculumIndex)}
                  />

                  <AddTopicDialog
                    programUuid={openingProgramUuid ?? programUuid}
                    open={editingCurriculumIndex === curriculumIndex}
                    onOpenChange={open => setEditingCurriculumIndex(open ? curriculumIndex : null)}
                    initialData={{ title: curriculum.title, subtitle: curriculum.subtitle }}
                    onSubmit={async data => {
                      await handleSaveCurriculum(data, curriculumIndex);
                      setEditingCurriculumIndex(null);
                    }}
                  />

                  <FaChevronDown
                    className={`transition-transform duration-200 cursor-pointer ${isExpanded ? "rotate-180" : "rotate-0"}`}
                    onClick={() => toggleExpand(String(curriculumIndex))}
                  />
                </div>
              )}
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {curriculum.description?.map((section, index) => (
                  <div key={index} className="flex justify-between items-center p-2.5 bg-background rounded-[4px]">
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">{section}</span>
                    </div>

                    {canEdit && (
                      <div className="flex gap-2 items-center">
                        <Trash
                          size={16}
                          className="text-destructive cursor-pointer"
                          onClick={() => setDeleteTarget({ type: "section", curriculumIndex, index })}
                        />
                        <SquarePen
                          size={16}
                          className="text-primary-hover cursor-pointer"
                          onClick={() => setEditingSection({ curriculumIndex, index })}
                        />

                        <AddSectionDialog
                          programUuid={openingProgramUuid ?? programUuid}
                          curriculumIndex={curriculumIndex}
                          open={editingSection?.curriculumIndex === curriculumIndex && editingSection?.index === index}
                          onOpenChange={open => !open && setEditingSection(null)}
                          initialData={{ title: section }}
                          onSubmit={data => handleSaveSection(curriculumIndex, data, index)}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {canEdit && (
                  <>
                    <Button className="flex w-fit items-center" onClick={() => setAddingSectionCurriculumIndex(curriculumIndex)}>
                      <FiPlus />
                      <span className="text-[14px] font-semibold cursor-pointer">Add Section</span>
                    </Button>

                    {addingSectionCurriculumIndex === curriculumIndex && (
                      <AddSectionDialog
                        programUuid={openingProgramUuid ?? programUuid}
                        curriculumIndex={curriculumIndex}
                        open={true}
                        onOpenChange={open => !open && setAddingSectionCurriculumIndex(null)}
                        onSubmit={data => handleSaveSection(curriculumIndex, data)}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {canEdit && deleteTarget && (
        <DeleteModal
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
          itemName={deleteTarget?.type === "curriculum" ? "curriculum" : "section"}
          onConfirm={() => deleteTarget && handleDelete(deleteTarget.type, deleteTarget.curriculumIndex, deleteTarget.index)}
        />
      )}
    </div>
  );
}
