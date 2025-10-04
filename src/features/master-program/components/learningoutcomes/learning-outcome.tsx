"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddTopicDialog from "@/features/master-program/components/course-requirement/add-topic-dialog";
import AddSectionDialog from "@/features/master-program/components/course-requirement/section-dialog";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { SquarePen, Trash } from "lucide-react";

import {
  useGetAllLearningOutcomesQuery,
  useUpdateLearningOutcomesMutation,
} from "@/features/master-program/components/learningoutcomes/learningOutcomesApi";
import { LearningOutcomeType } from "@/types/program";
import { SectionSkeleton } from "../section-skeleton";

type Props = { programUuid: string };

export default function LearningOutcomesAdmin({ programUuid }: Props) {
  const { data: outcomes = [], isLoading, isError } =
    useGetAllLearningOutcomesQuery(programUuid, {
      refetchOnMountOrArgChange: true,
    });

  const [updateOutcomes] = useUpdateLearningOutcomesMutation();

  // UI states
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingOutcomeIndex, setEditingOutcomeIndex] = useState<number | null>(
    null
  );
  const [editingSection, setEditingSection] = useState<{
    outcomeIndex: number;
    index: number;
  } | null>(null);
  const [addingSectionOutcomeIndex, setAddingSectionOutcomeIndex] =
    useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "outcome" | "section";
    outcomeIndex?: number;
    index?: number;
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const toggleExpand = (id: string) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  if (isLoading) return <SectionSkeleton count={4}/>;
  if (isError)
    return (
      <div className="text-destructive">Failed to load learning outcomes</div>
    );

  // ======================
  // Handlers
  // ======================

  const handleSaveOutcome = async (
    data: { title: string; subtitle: string },
    targetIndex?: number
  ) => {
    try {
      const safeOutcomes: LearningOutcomeType[] = outcomes ?? [];
      let newOutcomes: LearningOutcomeType[];

      if (targetIndex !== undefined) {
        newOutcomes = safeOutcomes.map((o, i) =>
          i === targetIndex
            ? { ...o, title: data.title, subtitle: data.subtitle }
            : o
        );
      } else {
        newOutcomes = [
          ...safeOutcomes,
          {
            id: crypto.randomUUID(),
            title: data.title,
            subtitle: data.subtitle || "",
            description: [],
          },
        ];
      }

      await updateOutcomes({
        programUuid,
        learningOutcomes: newOutcomes,
      }).unwrap();

      toast.success(
        targetIndex !== undefined ? "Outcome updated!" : "Outcome added!"
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save outcome: ${message}`);
    }
  };

  const handleSaveSection = async (
    outcomeIndex: number,
    data: { title: string },
    sectionIndex?: number
  ) => {
    try {
      const safeOutcomes: LearningOutcomeType[] = outcomes.map((o) => ({
        ...o,
        description: [...(o.description || [])],
      }));

      const outcome = safeOutcomes[outcomeIndex];
      if (!outcome) return;

      const updatedOutcome =
        sectionIndex !== undefined
          ? {
              ...outcome,
              description: (outcome.description || []).map((d, i) =>
                i === sectionIndex ? data.title : d
              ),
            }
          : {
              ...outcome,
              description: [...(outcome.description || []), data.title],
            };

      safeOutcomes[outcomeIndex] = updatedOutcome;

      await updateOutcomes({
        programUuid,
        learningOutcomes: safeOutcomes,
      }).unwrap();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save section: ${message || err}`);
    }
  };

  const handleDelete = async (
    type: "outcome" | "section",
    outcomeIndex?: number,
    index?: number
  ) => {
    try {
      const safeOutcomes = [...outcomes];
      let newOutcomes: LearningOutcomeType[];

      if (type === "outcome" && outcomeIndex !== undefined) {
        newOutcomes = safeOutcomes.filter((_, i) => i !== outcomeIndex);
      } else if (
        type === "section" &&
        outcomeIndex !== undefined &&
        index !== undefined
      ) {
        const outcome = { ...safeOutcomes[outcomeIndex] };
        outcome.description = (outcome.description || []).filter(
          (_, i) => i !== index
        );
        newOutcomes = safeOutcomes.map((o, i) =>
          i === outcomeIndex ? outcome : o
        );
      } else return;

      await updateOutcomes({ programUuid, learningOutcomes: newOutcomes }).unwrap();
      toast.success(type === "outcome" ? "Outcome deleted!" : "Section deleted!");
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
        <h2 className="text-[18px] font-bold text-foreground">
          Learning Outcomes
        </h2>

        <AddTopicDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          programUuid={programUuid}
          onSubmit={async (data) => {
            await handleSaveOutcome(data);
            setIsCreateOpen(false); // automatically close after submit
          }}
          trigger={
            <Button>
              <FiPlus />
              <span className="text-[14px] font-bold cursor-pointer">Add Outcome</span>
            </Button>
          }
        />
      </div>

      {(!outcomes || outcomes.length === 0) && (
        <div className="text-muted-foreground">
          No learning outcomes yet. Add one!
        </div>
      )}

      {/* List */}
      {(outcomes || []).map((outcome, outcomeIndex) => {
        const isExpanded = expandedItems.includes(String(outcomeIndex));
        const sections = outcome.description || [];

        return (
          <div
            key={outcome.id || outcomeIndex}
            className="flex flex-col gap-2.5 bg-accent rounded-sm p-4"
          >
            {/* Outcome Header */}
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => toggleExpand(String(outcomeIndex))}
              >
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-foreground">
                    {outcome.title}
                  </span>
                  {outcome.subtitle && (
                    <span className="text-[12px] text-muted-foreground">
                      {outcome.subtitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Trash
                  size={16}
                  className="text-destructive cursor-pointer"
                  onClick={() =>
                    setDeleteTarget({ type: "outcome", outcomeIndex })
                  }
                />
                <SquarePen
                  size={16}
                  className="text-primary-hover cursor-pointer"
                  onClick={() => setEditingOutcomeIndex(outcomeIndex)}
                />

                <AddTopicDialog
                  programUuid={programUuid}
                  open={editingOutcomeIndex === outcomeIndex}
                  onOpenChange={(open) =>
                    setEditingOutcomeIndex(open ? outcomeIndex : null)
                  }
                  initialData={{
                    title: outcome.title,
                    subtitle: outcome.subtitle,
                  }}
                  onSubmit={async (data) => {
                    await handleSaveOutcome(data, outcomeIndex);
                    setEditingOutcomeIndex(null); // close after edit
                  }}
                />

                <FaChevronDown
                  className={`transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : "rotate-0"
                  }`}
                  onClick={() => toggleExpand(String(outcomeIndex))}
                />
              </div>
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2.5 bg-background rounded-[4px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">
                        {section}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Trash
                        size={16}
                        className="text-destructive cursor-pointer"
                        onClick={() =>
                          setDeleteTarget({
                            type: "section",
                            outcomeIndex,
                            index,
                          })
                        }
                      />
                      <SquarePen
                        size={16}
                        className="text-primary-hover cursor-pointer"
                        onClick={() =>
                          setEditingSection({ outcomeIndex, index })
                        }
                      />

                      <AddSectionDialog
                        programUuid={programUuid}
                        outcomeIndex={outcomeIndex}
                        open={
                          editingSection?.outcomeIndex === outcomeIndex &&
                          editingSection?.index === index
                        }
                        onOpenChange={(open) =>
                          !open && setEditingSection(null)
                        }
                        initialData={{ title: section }}
                        onSubmit={(data) =>
                          handleSaveSection(outcomeIndex, data, index)
                        }
                      />
                    </div>
                  </div>
                ))}

                <Button
                  className="flex w-fit items-center"
                  onClick={() => setAddingSectionOutcomeIndex(outcomeIndex)}
                >
                  <FiPlus />
                  <span className="text-[14px] font-semibold cursor-pointer">Add Section</span>
                </Button>

                {addingSectionOutcomeIndex === outcomeIndex && (
                  <AddSectionDialog
                    programUuid={programUuid}
                    outcomeIndex={outcomeIndex}
                    open={true}
                    onOpenChange={(open) =>
                      !open && setAddingSectionOutcomeIndex(null)
                    }
                    onSubmit={(data) => handleSaveSection(outcomeIndex, data)}
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
        itemName={deleteTarget?.type === "outcome" ? "outcome" : "section"}
        onConfirm={() =>
          deleteTarget &&
          handleDelete(
            deleteTarget.type,
            deleteTarget.outcomeIndex,
            deleteTarget.index
          )
        }
      />
    </div>
  );
}
