"use client";

import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddTopicDialog from "./AddTopicDialog";
import AddSectionDialog from "./SectionDialog";
import DeleteModal from "@/features/master-program/components/delete-modal-component";
import { SquarePen, Trash } from "lucide-react";
import {
  useGetAllRequirementsQuery,
  useUpdateRequirementsMutation,
} from "./requirementsApi";
import { RequirementsType } from "@/types/program";
import { SectionSkeleton } from "../section-skeleton";
import ModalDelete from "@/components/modal/ModalDelete";

type Props = { programUuid: string };

export default function CourseRequirementsAdmin({ programUuid }: Props) {
  const {
    data: requirements = [],
    isLoading,
    isError,
  } = useGetAllRequirementsQuery(programUuid, {
    refetchOnMountOrArgChange: true,
  });

  const [updateRequirements] = useUpdateRequirementsMutation();

  const [localRequirements, setLocalRequirements] = useState<
    RequirementsType[]
  >([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [expandedItems, setExpandedItems] = useState<string[]>([String(0)]);
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(
    null
  );
  const [editingSection, setEditingSection] = useState<{
    reqIndex: number;
    index: number;
  } | null>(null);
  const [addingSectionReqIndex, setAddingSectionReqIndex] = useState<
    number | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "section";
    title: string;
    reqIndex?: number;
    index?: number;
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // -------------------------------
  // Initialize local state safely
  // -------------------------------
  useEffect(() => {
    const safeRequirements = Array.isArray(requirements)
      ? requirements.map((r) => ({
          ...r,
          description: Array.isArray(r.description) ? r.description : [],
        }))
      : [];
    setLocalRequirements(safeRequirements);
    setHasChanges(false);
  }, [requirements]);

  const toggleExpand = (id: string) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  if (isLoading) return <SectionSkeleton count={4} />;
  if (isError)
    return <div className="text-destructive">Failed to load requirements</div>;

  // -------------------------------
  // Local Handlers
  // -------------------------------
  const handleSaveTopicLocal = (
    data: { title: string; subtitle: string },
    targetIndex?: number
  ) => {
    let message = "";

    setLocalRequirements((prev) => {
      let newRequirements: RequirementsType[];

      if (targetIndex !== undefined) {
        newRequirements = prev.map((r, i) =>
          i === targetIndex
            ? {
                ...r,
                title: data.title,
                subtitle: data.subtitle,
                description: Array.isArray(r.description) ? r.description : [],
              }
            : r
        );
        message = `Topic "${data.title}" updated!`;
      } else {
        newRequirements = [
          ...prev,
          {
            id: crypto.randomUUID(),
            title: data.title,
            subtitle: data.subtitle || "",
            description: [],
          },
        ];
        message = `Topic "${data.title}" created!`;
      }

      setHasChanges(true);
      return newRequirements;
    });

    // Show toast **after state update**
    toast.success(message);
  };

  const handleSaveSectionLocal = (
    reqIndex: number,
    data: { title: string },
    sectionIndex?: number
  ) => {
    setLocalRequirements((prev) => {
      const newReqs = [...prev];
      const req = newReqs[reqIndex];
      if (!req) return prev;

      const safeDescription = Array.isArray(req.description)
        ? [...req.description]
        : [];
      const updatedDescription =
        sectionIndex !== undefined
          ? safeDescription.map((d, i) => (i === sectionIndex ? data.title : d))
          : [...safeDescription, data.title];

      newReqs[reqIndex] = { ...req, description: updatedDescription };
      setHasChanges(true);
      return newReqs;
    });
  };

  const handleDeleteLocal = (
    type: "topic" | "section",
    reqIndex?: number,
    index?: number
  ) => {
    let deletedName = "";

    setLocalRequirements((prev) => {
      let newRequirements: RequirementsType[];

      if (type === "topic" && reqIndex !== undefined) {
        deletedName = prev[reqIndex]?.title || `Topic #${reqIndex + 1}`;
        newRequirements = prev.filter((_, i) => i !== reqIndex);
      } else if (
        type === "section" &&
        reqIndex !== undefined &&
        index !== undefined
      ) {
        const req = { ...prev[reqIndex] };
        const sections = Array.isArray(req.description)
          ? [...req.description]
          : [];
        deletedName = sections[index] || `Section #${index + 1}`;
        req.description = sections.filter((_, i) => i !== index);
        newRequirements = prev.map((r, i) => (i === reqIndex ? req : r));
      } else {
        return prev;
      }

      setHasChanges(true);
      return newRequirements;
    });

    setDeleteTarget(null);
    toast.info(`Requirement "${deletedName}" deleted!`);
  };

  const handleSaveAllToBackend = async () => {
    try {
      await updateRequirements({
        programUuid,
        requirements: localRequirements,
      }).unwrap();

      toast.success("All changes saved!");
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

  // -------------------------------
  // JSX
  // -------------------------------
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">
          Course Requirements
        </h2>
        <AddTopicDialog
        topicName="Requirements"
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          programUuid={programUuid}
          submitButtonText={{ add: "Save Requirement", edit: "Save Changes" }}
          onSubmit={(data) => {
            handleSaveTopicLocal(data);
            setIsCreateOpen(false);
          }}
          trigger={
            <Button>
              <FiPlus />
              <span className="text-[14px] font-bold cursor-pointer">
                Add Requirements
              </span>
            </Button>
          }
        />
      </div>

      {localRequirements.length === 0 && (
        <div className="text-muted-foreground">
          No requirements yet. Add one!
        </div>
      )}

      {/* List */}
      {localRequirements.map((req, reqIndex) => {
        const isExpanded = expandedItems.includes(String(reqIndex));
        const sections = Array.isArray(req.description) ? req.description : [];

        return (
          <div
            key={req.id || reqIndex}
            className="flex flex-col gap-2.5 bg-accent rounded-sm p-4"
          >
            {/* Topic Header */}
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => toggleExpand(String(reqIndex))}
              >
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-foreground">
                    {req.title}
                  </span>
                  {req.subtitle && (
                    <span className="text-[12px] text-muted-foreground">
                      {req.subtitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Trash
                  size={16}
                  className="text-destructive cursor-pointer"
                  onClick={() =>{
                    setDeleteTarget({
                      type: "topic",
                      reqIndex,
                      title:
                        requirements[reqIndex]?.title ||
                        `Requirement #${reqIndex + 1}`,
                    })
                  }}
                />
                <SquarePen
                  size={16}
                  className="text-primary-hover cursor-pointer"
                  onClick={() => setEditingTopicIndex(reqIndex)}
                />

                <AddTopicDialog
                  programUuid={programUuid}
                  open={editingTopicIndex === reqIndex}
                  onOpenChange={(open) =>
                    setEditingTopicIndex(open ? reqIndex : null)
                  }
                  initialData={{ title: req.title, subtitle: req.subtitle }}
                  onSubmit={(data) => {
                    handleSaveTopicLocal(data, reqIndex);
                    setEditingTopicIndex(null);
                  }}
                />

                <FaChevronDown
                  className={`transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : "rotate-0"
                  }`}
                  onClick={() => toggleExpand(String(reqIndex))}
                />
              </div>
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {sections.map((desc, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2.5 bg-background rounded-[4px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">
                        {desc}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Trash
                        size={16}
                        className="text-destructive cursor-pointer"
                        onClick={() =>{
                          setDeleteTarget({
                            type: "section",
                            reqIndex,
                            index,
                            title:
                              localRequirements[reqIndex]?.description?.[
                                index
                              ] || `Sectionn #${index + 1}`,
                          })
                        }}
                      />
                      <SquarePen
                        size={16}
                        className="text-primary-hover cursor-pointer"
                        onClick={() => setEditingSection({ reqIndex, index })}
                      />

                      <AddSectionDialog
                        programUuid={programUuid}
                        reqIndex={reqIndex}
                        open={
                          editingSection?.reqIndex === reqIndex &&
                          editingSection?.index === index
                        }
                        onOpenChange={(open) =>
                          !open && setEditingSection(null)
                        }
                        initialData={{ title: desc }}
                        onSubmit={(data) =>
                          handleSaveSectionLocal(reqIndex, data, index)
                        }
                      />
                    </div>
                  </div>
                ))}

                <Button
                  className="flex w-fit items-center"
                  onClick={() => setAddingSectionReqIndex(reqIndex)}
                >
                  <FiPlus />
                  <span className="text-[14px] font-semibold cursor-pointer">
                    Add Section
                  </span>
                </Button>

                {addingSectionReqIndex === reqIndex && (
                  <AddSectionDialog
                    programUuid={programUuid}
                    reqIndex={reqIndex}
                    open={true}
                    onOpenChange={(open) =>
                      !open && setAddingSectionReqIndex(null)
                    }
                    onSubmit={(data) => handleSaveSectionLocal(reqIndex, data)}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Save All Button */}
      <div className="flex justify-end mt-4">
        <Button
          variant={hasChanges ? "default" : "outline"}
          disabled={!hasChanges}
          onClick={handleSaveAllToBackend}
        >
          Save All Changes
        </Button>
      </div>

      {/* Delete Modal */}
      <ModalDelete
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `Delete "${deleteTarget?.title}"?`: ""}
        description={deleteTarget ? `Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`: ""}
        onDelete={() =>
          deleteTarget &&
          handleDeleteLocal(
            deleteTarget.type,
            deleteTarget.reqIndex,
            deleteTarget.index
          )
        }
      />
    </div>
  );
}
