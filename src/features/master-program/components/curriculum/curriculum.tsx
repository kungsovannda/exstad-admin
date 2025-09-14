"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddTopicDialog from "../course-requirement/add-topic-dialog";
import AddSectionDialog from "../course-requirement/section-dialog";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { SquarePen, Trash } from "lucide-react";

import {
  useGetAllCurriculumQuery,
  useUpdateCurriculumsMutation,
} from "./curriculumApi";
import { CurriculumType } from "@/types/program";

type Props = { programUuid: string };

export default function CurriculumAdmin({ programUuid }: Props) {
  const { data: curriculums = [], isLoading, isError } =
    useGetAllCurriculumQuery(programUuid, { refetchOnMountOrArgChange: true });

  const [updateCurriculums] = useUpdateCurriculumsMutation();

  // UI states
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<number | null>(null);
  const [editingSection, setEditingSection] = useState<{
    curriculumIndex: number;
    index: number;
  } | null>(null);
  const [addingSectionCurriculumIndex, setAddingSectionCurriculumIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "curriculum" | "section";
    curriculumIndex?: number;
    index?: number;
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const toggleExpand = (id: string) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  if (isLoading) return <div>Loading curriculum...</div>;
  if (isError) return <div className="text-destructive">Failed to load curriculum</div>;

  // ======================
  // Handlers
  // ======================
  const handleSaveCurriculum = async (
    data: { title: string; subtitle: string },
    targetIndex?: number
  ) => {
    try {
      const safeCurriculums: CurriculumType[] = curriculums ?? [];
      let newCurriculums: CurriculumType[];

      if (targetIndex !== undefined) {
        // Edit existing, keep order
        newCurriculums = safeCurriculums.map((c, i) =>
          i === targetIndex ? { ...c, title: data.title, subtitle: data.subtitle } : c
        );
      } else {
        // Add new curriculum
        newCurriculums = [
          ...safeCurriculums,
          {
            id: crypto.randomUUID(),
            order: safeCurriculums.length + 1, // next order
            title: data.title,
            subtitle: data.subtitle || "",
            description: [],
          },
        ];
      }

      await updateCurriculums({ programUuid, curriculums: newCurriculums }).unwrap();
      toast.success(targetIndex !== undefined ? "Curriculum updated!" : "Curriculum added!");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save curriculum: ${message || err}`);
    }
  };

  const handleSaveSection = async (
    curriculumIndex: number,
    data: { title: string },
    sectionIndex?: number
  ) => {
    try {
      const safeCurriculums: CurriculumType[] = curriculums.map((c) => ({
        ...c,
        description: [...(c.description ?? [])],
      }));

      const curriculum = safeCurriculums[curriculumIndex];
      if (!curriculum) return;

      const updatedCurriculum =
        sectionIndex !== undefined
          ? {
              ...curriculum,
              description: curriculum.description.map((d, i) =>
                i === sectionIndex ? data.title : d
              ),
            }
          : { ...curriculum, description: [...curriculum.description, data.title] };

      safeCurriculums[curriculumIndex] = updatedCurriculum;

      await updateCurriculums({ programUuid, curriculums: safeCurriculums }).unwrap();
      toast.success(sectionIndex !== undefined ? "Section updated!" : "Section added!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save section: ${message || err}`);
    }
  };

  const handleDelete = async (
    type: "curriculum" | "section",
    curriculumIndex?: number,
    index?: number
  ) => {
    try {
      const safeCurriculums = [...curriculums];
      let newCurriculums: CurriculumType[];

      if (type === "curriculum" && curriculumIndex !== undefined) {
        newCurriculums = safeCurriculums.filter((_, i) => i !== curriculumIndex);
      } else if (type === "section" && curriculumIndex !== undefined && index !== undefined) {
        const curriculum = { ...safeCurriculums[curriculumIndex] };
        curriculum.description = curriculum.description.filter((_, i) => i !== index);
        newCurriculums = safeCurriculums.map((c, i) => (i === curriculumIndex ? curriculum : c));
      } else return;

      await updateCurriculums({ programUuid, curriculums: newCurriculums }).unwrap();
      toast.success(type === "curriculum" ? "Curriculum deleted!" : "Section deleted!");
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
        <h2 className="text-[18px] font-bold text-foreground">Curriculum</h2>

        <AddTopicDialog
          programUuid={programUuid}
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={async (data) => {
            await handleSaveCurriculum(data);
            setIsCreateOpen(false);
          }}
          trigger={
            <Button className="flex items-center gap-2.5">
              <FiPlus />
              <span className="text-[14px] font-bold">Add Curriculum</span>
            </Button>
          }
        />
      </div>

      {(!curriculums || curriculums.length === 0) && (
        <div className="text-muted-foreground">No curriculums yet. Add one!</div>
      )}

      {/* Curriculum List */}
      {curriculums?.map((curriculum, curriculumIndex) => {
        const isExpanded = expandedItems.includes(String(curriculumIndex));
        return (
          <div key={curriculum.id} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
            {/* Curriculum Header */}
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => toggleExpand(String(curriculumIndex))}
              >
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-foreground">{curriculum.title}</span>
                  {curriculum.subtitle && (
                    <span className="text-[12px] text-muted-foreground">{curriculum.subtitle}</span>
                  )}
                </div>
              </div>

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
                  programUuid={programUuid}
                  open={editingCurriculumIndex === curriculumIndex}
                  onOpenChange={(open) =>
                    setEditingCurriculumIndex(open ? curriculumIndex : null)
                  }
                  initialData={{ title: curriculum.title, subtitle: curriculum.subtitle }}
                  onSubmit={async (data) => {
                    await handleSaveCurriculum(data, curriculumIndex);
                    setEditingCurriculumIndex(null);
                  }}
                />

                <FaChevronDown
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                  onClick={() => toggleExpand(String(curriculumIndex))}
                />
              </div>
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

                    <div className="flex gap-2 items-center">
                      <Trash
                        size={16}
                        className="text-destructive cursor-pointer"
                        onClick={() =>
                          setDeleteTarget({ type: "section", curriculumIndex, index })
                        }
                      />
                      <SquarePen
                        size={16}
                        className="text-primary-hover cursor-pointer"
                        onClick={() => setEditingSection({ curriculumIndex, index })}
                      />

                      <AddSectionDialog
                        programUuid={programUuid}
                        curriculumIndex={curriculumIndex}
                        open={editingSection?.curriculumIndex === curriculumIndex && editingSection?.index === index}
                        onOpenChange={(open) => !open && setEditingSection(null)}
                        initialData={{ title: section }}
                        onSubmit={(data) => handleSaveSection(curriculumIndex, data, index)}
                      />
                    </div>
                  </div>
                ))}

                {/* Add Section */}
                <Button className="flex w-fit items-center" onClick={() => setAddingSectionCurriculumIndex(curriculumIndex)}>
                  <FiPlus />
                  <span className="text-[14px] font-semibold">Add Section</span>
                </Button>

                {addingSectionCurriculumIndex === curriculumIndex && (
                  <AddSectionDialog
                    programUuid={programUuid}
                    curriculumIndex={curriculumIndex}
                    open={true}
                    onOpenChange={(open) => !open && setAddingSectionCurriculumIndex(null)}
                    onSubmit={(data) => handleSaveSection(curriculumIndex, data)}
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
        itemName={deleteTarget?.type === "curriculum" ? "curriculum" : "section"}
        onConfirm={() =>
          deleteTarget &&
          handleDelete(deleteTarget.type, deleteTarget.curriculumIndex, deleteTarget.index)
        }
      />
    </div>
  );
}
