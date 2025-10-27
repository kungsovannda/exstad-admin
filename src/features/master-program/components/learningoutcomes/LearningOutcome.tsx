"use client";

import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddTopicDialog from "@/features/master-program/components/course-requirement/AddTopicDialog";
import AddSectionDialog from "@/features/master-program/components/course-requirement/SectionDialog";
import DeleteModal from "@/features/master-program/components/delete-modal-component";
import { SquarePen, Trash } from "lucide-react";

import {
  useGetAllLearningOutcomesQuery,
  useUpdateLearningOutcomesMutation,
} from "@/features/master-program/components/learningoutcomes/learningOutcomesApi";
import { LearningOutcomeType } from "@/types/program";
import { SectionSkeleton } from "../section-skeleton";
import ModalDelete from "@/components/modal/ModalDelete";

type Props = { programUuid: string };

export default function LearningOutcomesAdmin({ programUuid }: Props) {
  // ======================
  // Data fetching + mutation
  // ======================
  const {
    data: outcomes = [],
    isLoading,
    isError,
  } = useGetAllLearningOutcomesQuery(programUuid, {
    refetchOnMountOrArgChange: true,
  });

  const [updateOutcomes] = useUpdateLearningOutcomesMutation();

  // ======================
  // Local State
  // ======================
  const [localOutcomes, setLocalOutcomes] = useState<LearningOutcomeType[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [expandedItems, setExpandedItems] = useState<string[]>([String(0)]);
  const [editingOutcomeIndex, setEditingOutcomeIndex] = useState<number | null>(
    null
  );
  const [editingSection, setEditingSection] = useState<{
    outcomeIndex: number;
    index: number;
  } | null>(null);
  const [addingSectionOutcomeIndex, setAddingSectionOutcomeIndex] = useState<
    number | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "outcome" | "section";
    title: string;
    outcomeIndex?: number;
    index?: number;
  } | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // sync server → local
  useEffect(() => {
    if (outcomes && Array.isArray(outcomes)) {
      // ensure each outcome.description is an array
      const safeOutcomes = outcomes.map((o) => ({
        ...o,
        description: Array.isArray(o.description) ? o.description : [],
      }));
      setLocalOutcomes(safeOutcomes);
      setHasChanges(false);
    }
  }, [outcomes]);

  // ======================
  // UI Helpers
  // ======================
  const toggleExpand = (id: string) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  if (isLoading) return <SectionSkeleton count={4} />;
  if (isError)
    return (
      <div className="text-destructive">Failed to load learning outcomes</div>
    );

  const handleSaveOutcomeLocal = (
    data: { title: string; subtitle: string },
    targetIndex?: number
  ) => {
    let message = "";
    setLocalOutcomes((prev) => {
      const safe = prev ?? [];
      let newOutcomes: LearningOutcomeType[];

      if (targetIndex !== undefined) {
        newOutcomes = safe.map((o, i) =>
          i === targetIndex
            ? { ...o, title: data.title, subtitle: data.subtitle }
            : o
        );
        message = `Learning Outcome "${data.title}" updated!`;
      } else {
        newOutcomes = [
          ...safe,
          {
            id: crypto.randomUUID(),
            title: data.title,
            subtitle: data.subtitle || "",
            description: [],
          },
        ];
        message = `Learning Outcome "${data.title}" created!`;
      }

      setHasChanges(true);
      return newOutcomes;
    });

    toast.success(message);
  };

  const handleSaveSectionLocal = (
    outcomeIndex: number,
    data: { title: string },
    sectionIndex?: number
  ) => {
    setLocalOutcomes((prev) => {
      const safe = prev.map((o) => ({
        ...o,
        description: Array.isArray(o.description) ? [...o.description] : [],
      }));

      const outcome = safe[outcomeIndex];
      if (!outcome) return prev;

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

      safe[outcomeIndex] = updatedOutcome;
      setHasChanges(true);
      return safe;
    });
  };

  const handleDeleteLocal = (
    type: "outcome" | "section",
    outcomeIndex?: number,
    index?: number
  ) => {
    let deletedName = "";

    setLocalOutcomes((prev) => {
      const safe = [...prev];
      let newOutcomes: LearningOutcomeType[];

      if (type === "outcome" && outcomeIndex !== undefined) {
        deletedName =
          safe[outcomeIndex]?.title || `Outcome #${outcomeIndex + 1}`;
        newOutcomes = safe.filter((_, i) => i !== outcomeIndex);
      } else if (
        type === "section" &&
        outcomeIndex !== undefined &&
        index !== undefined
      ) {
        const outcome = { ...safe[outcomeIndex] };
        deletedName = outcome.description?.[index] || `Section #${index + 1}`;
        outcome.description = Array.isArray(outcome.description)
          ? outcome.description.filter((_, i) => i !== index)
          : [];
        newOutcomes = safe.map((o, i) => (i === outcomeIndex ? outcome : o));
      } else return prev;

      setHasChanges(true);
      return newOutcomes;
    });

    setDeleteTarget(null);
    toast.info(`Learning Outcome "${deletedName}" deleted!`);
  };

  // ======================
  // Final Backend Save
  // ======================
  const handleSaveAllToBackend = async () => {
    try {
      await updateOutcomes({
        programUuid,
        learningOutcomes: localOutcomes,
      }).unwrap();

      toast.success("All learning outsomes saved!");
      setHasChanges(false);
    } catch (err: unknown) {
      const backendErrors = (
        err as {
          data?: {
            error?: { description?: { reason: string; field?: string }[] };
          };
        }
      )?.data?.error?.description;

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
          topicName="Learning Outcomes"
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          programUuid={programUuid}
          submitButtonText={{
            add: "Save Learning Outcomes",
            edit: "Save Changes",
          }}
          onSubmit={(data) => {
            handleSaveOutcomeLocal(data);
            setIsCreateOpen(false);
          }}
          trigger={
            <Button>
              <FiPlus />
              <span className="text-[14px] font-bold cursor-pointer">
                Add Outcome
              </span>
            </Button>
          }
        />
      </div>

      {localOutcomes.length === 0 && (
        <div className="text-muted-foreground">
          No learning outcomes yet. Add one!
        </div>
      )}

      {/* List */}
      {localOutcomes.map((outcome, outcomeIndex) => {
        const isExpanded = expandedItems.includes(String(outcomeIndex));
        const sections = Array.isArray(outcome.description)
          ? outcome.description
          : [];

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
                  onClick={() => {
                    setDeleteTarget({
                      type: "outcome",
                      outcomeIndex,
                      title:
                        localOutcomes[outcomeIndex]?.title ||
                        `Outcome #${outcomeIndex + 1}`,
                    });
                  }}
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
                  onSubmit={(data) => {
                    handleSaveOutcomeLocal(data, outcomeIndex);
                    setEditingOutcomeIndex(null);
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
                        onClick={() => {
                          setDeleteTarget({
                            type: "section",
                            outcomeIndex,
                            index,
                            title:
                              localOutcomes[outcomeIndex]?.description?.[
                                index
                              ] || `Section #${index + 1}`,
                          });
                        }}
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
                          handleSaveSectionLocal(outcomeIndex, data, index)
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
                  <span className="text-[14px] font-semibold cursor-pointer">
                    Add Section
                  </span>
                </Button>

                {addingSectionOutcomeIndex === outcomeIndex && (
                  <AddSectionDialog
                    programUuid={programUuid}
                    outcomeIndex={outcomeIndex}
                    open={true}
                    onOpenChange={(open) =>
                      !open && setAddingSectionOutcomeIndex(null)
                    }
                    onSubmit={(data) =>
                      handleSaveSectionLocal(outcomeIndex, data)
                    }
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Save Button at the bottom */}
      <div className="flex justify-end mt-4">
        <Button
          variant={hasChanges ? "default" : "outline"}
          disabled={!hasChanges}
          onClick={handleSaveAllToBackend}
        >
          Save All Learning Outcomes
        </Button>
      </div>

      {/* Delete Modal */}
      <ModalDelete
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `Delete "${deleteTarget?.title}"?` : ""}
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`
            : ""
        }
        onDelete={() =>
          deleteTarget &&
          handleDeleteLocal(
            deleteTarget.type,
            deleteTarget.outcomeIndex,
            deleteTarget.index
          )
        }
      />
    </div>
  );
}
