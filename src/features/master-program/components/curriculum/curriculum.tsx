"use client";

import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddTopicDialog from "../course-requirement/AddTopicDialog";
import AddSectionDialog from "../course-requirement/SectionDialog";
import { SquarePen, Trash, GripVertical } from "lucide-react";

import {
  useGetMasterCurriculumsQuery,
  useUpdateMasterCurriculumsMutation,
  useGetOpeningCurriculumsQuery,
  useUpdateOpeningCurriculumsMutation,
  CurriculumPayload,
} from "./curriculumApi";
import { CurriculumType } from "@/types/program";
import { SectionSkeleton } from "../section-skeleton";
import ModalDelete from "@/components/modal/ModalDelete";

type Props = {
  programUuid: string;
  openingProgramUuid?: string;
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

  // ======================
  // Local state
  // ======================
  const [localCurriculums, setLocalCurriculums] = useState<CurriculumType[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([String(0)]);
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<number | null>(null);
  const [editingSection, setEditingSection] = useState<{ curriculumIndex: number; index: number } | null>(null);
  const [addingSectionCurriculumIndex, setAddingSectionCurriculumIndex] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "curriculum" | "section";
    title: string;
    curriculumIndex?: number;
    index?: number;
  } | null>(null);
  // Drag & Drop states - FIXED: Use index instead of ID
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const isOpening = !!openingProgramUuid;
  const canEdit = !!(programUuid || openingProgramUuid);

  // Initialize local state
  useEffect(() => {
    setLocalCurriculums(openingCurriculums?.length ? openingCurriculums : masterCurriculums ?? []);
    setHasChanges(false);
  }, [openingCurriculums, masterCurriculums]);

  // Auto-copy master -> opening if empty
  useEffect(() => {
    if (
      openingProgramUuid &&
      !copied &&
      (!openingCurriculums || openingCurriculums.length === 0) &&
      masterCurriculums?.length
    ) {
      const copiedCurriculums: CurriculumPayload[] = masterCurriculums.map(c => ({ ...c, id: crypto.randomUUID() }));

      updateOpeningCurriculums({ openingProgramUuid, curriculums: copiedCurriculums })
        .unwrap()
        .then(() => setCopied(true))
        .catch(err => console.error("Failed to copy master curriculum:", err));
    }
  }, [openingProgramUuid, openingCurriculums, masterCurriculums, updateOpeningCurriculums, copied]);

  if (isOpeningLoading || isMasterLoading) return <SectionSkeleton count={4} />;
  if (!localCurriculums) return <div className="text-destructive">Failed to load curriculum</div>;

  // Expand / collapse
  const toggleExpand = (id: string) =>
    setExpandedItems(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));

  // ======================
  // CRUD Handlers
  // ======================
  const handleSaveCurriculumLocal = (data: { title: string; subtitle: string }, targetIndex?: number) => {
    let message = "";

    setLocalCurriculums(prev => {
      let newCurriculums: CurriculumType[];

      if (targetIndex !== undefined) {
        newCurriculums = prev.map((c, i) =>
          i === targetIndex ? { ...c, title: data.title, subtitle: data.subtitle } : c
        );
        message = `Curriculum "${data.title}" updated!`;
      } else {
        newCurriculums = [
          ...prev,
          {
            id: crypto.randomUUID(),
            order: prev.length + 1,
            title: data.title,
            subtitle: data.subtitle || "",
            description: [],
          },
        ];
        message = `Curriculum "${data.title}" created!`;
      }

      setHasChanges(true);
      return newCurriculums;
    });

    toast.success(message);
  };

  const handleSaveSectionLocal = (curriculumIndex: number, data: { title: string }, sectionIndex?: number) => {
    setLocalCurriculums(prev => {
      const newCurr = prev.map((c, i) => (i === curriculumIndex ? { ...c, description: [...(c.description ?? [])] } : c));
      const curriculum = newCurr[curriculumIndex];
      if (!curriculum) return prev;
      newCurr[curriculumIndex] =
        sectionIndex !== undefined
          ? { ...curriculum, description: curriculum.description.map((d, i) => (i === sectionIndex ? data.title : d)) }
          : { ...curriculum, description: [...(curriculum.description ?? []), data.title] };
      setHasChanges(true);
      return newCurr;
    });
  };

  const handleDeleteLocal = (type: "curriculum" | "section", curriculumIndex?: number, index?: number) => {
    let deletedName = "";

    setLocalCurriculums(prev => {
      let newCurriculums: CurriculumType[];

      if (type === "curriculum" && curriculumIndex !== undefined) {
        deletedName = prev[curriculumIndex]?.title || `Curriculum #${curriculumIndex + 1}`;
        newCurriculums = prev.filter((_, i) => i !== curriculumIndex);
      } else if (type === "section" && curriculumIndex !== undefined && index !== undefined) {
        const curr = { ...prev[curriculumIndex] };
        const sections = Array.isArray(curr.description) ? [...curr.description] : [];
        deletedName = sections[index] || `Section #${index + 1}`;
        curr.description = sections.filter((_, i) => i !== index);
        newCurriculums = prev.map((c, i) => (i === curriculumIndex ? curr : c));
      } else return prev;

      setHasChanges(true);
      return newCurriculums;
    });

    setDeleteTarget(null);
    toast.info(`"${deletedName}" deleted!`);
  };

  const handleSaveAllToBackend = async () => {
    try {
      const updated = localCurriculums.map((c, i) => ({ ...c, order: i + 1 }));

      if (isOpening) {
        await updateOpeningCurriculums({
          openingProgramUuid: openingProgramUuid!,
          curriculums: updated,
        }).unwrap();
      } else {
        await updateMasterCurriculums({
          programUuid,
          curriculums: updated,
        }).unwrap();
      }

      toast.success("All changes saved!");
      setHasChanges(false);
    } catch (err) {
      toast.error("Failed to save changes!");
    }
  };

  // ======================
  // Drag & Drop Handlers - FIXED
  // ======================
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...localCurriculums];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    setLocalCurriculums(updated);
    setHasChanges(true);
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    toast.success("Curriculum reordered!");
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
            onSubmit={data => {
              handleSaveCurriculumLocal(data);
              setIsCreateOpen(false);
            }}
            submitButtonText={{ add: "Save Curriculum", edit: "Save Changes" }}
            trigger={
              <Button className="flex items-center gap-2.5">
                <FiPlus />
                <span className="text-[14px] font-bold cursor-pointer">Add Curriculum</span>
              </Button>
            }
          />
        )}
      </div>

      {localCurriculums.length === 0 && <div className="text-muted-foreground">No curriculums yet.</div>}

      {localCurriculums.map((curriculum, index) => {
        const isExpanded = expandedItems.includes(String(index));
        const isDragging = draggedIndex === index;
        const isDropTarget = dragOverIndex === index && draggedIndex !== index;
        
        return (
          <div
            key={curriculum.id || index}
            draggable={canEdit}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex flex-col gap-2.5 bg-accent rounded-sm p-4 transition-all ${
              canEdit ? "cursor-move" : ""
            } ${
              isDragging ? "opacity-40 scale-95" : ""
            } ${
              isDropTarget ? "border-2 border-primary scale-[1.02] shadow-lg" : "border-2 border-transparent"
            }`}
          >
            {/* Curriculum Header */}
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2.5 cursor-pointer flex-1"
                onClick={() => toggleExpand(String(index))}
              >
                {canEdit && <GripVertical className="text-muted-foreground flex-shrink-0" />}
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-foreground">{curriculum.title}</span>
                  {curriculum.subtitle && (
                    <span className="text-[12px] text-muted-foreground">{curriculum.subtitle}</span>
                  )}
                </div>
              </div>

              {canEdit && (
                <div className="flex gap-2 items-center">
                  <Trash
                    size={16}
                    className="text-destructive cursor-pointer hover:text-destructive/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ 
                        type: "curriculum",
                        curriculumIndex: index ,     
                        title: curriculum.title, });
                    }}
                  />
                  <SquarePen
                    size={16}
                    className="text-primary-hover cursor-pointer hover:opacity-80"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCurriculumIndex(index);
                    }}
                  />

                  <AddTopicDialog
                    programUuid={openingProgramUuid ?? programUuid}
                    open={editingCurriculumIndex === index}
                    onOpenChange={open => setEditingCurriculumIndex(open ? index : null)}
                    initialData={{ title: curriculum.title, subtitle: curriculum.subtitle }}
                    onSubmit={data => {
                      handleSaveCurriculumLocal(data, index);
                      setEditingCurriculumIndex(null);
                    }}
                  />

                  <FaChevronDown
                    className={`transition-transform duration-200 cursor-pointer ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(String(index));
                    }}
                  />
                </div>
              )}
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {curriculum.description?.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className="flex justify-between items-center p-2.5 bg-background rounded-[4px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">{section}</span>
                    </div>

                    {canEdit && (
                      <div className="flex gap-2 items-center">
                        <Trash
                          size={16}
                          className="text-destructive cursor-pointer hover:text-destructive/80"
                          onClick={() =>
                            setDeleteTarget({ type: "section", curriculumIndex: index, index: sectionIndex,
                                        title: curriculum.description.join(", ") || `Curriculum #${index + 1}`,})
                          }
                        />
                        <SquarePen
                          size={16}
                          className="text-primary-hover cursor-pointer hover:opacity-80"
                          onClick={() => setEditingSection({ curriculumIndex: index, index: sectionIndex })}
                        />

                        <AddSectionDialog
                          programUuid={openingProgramUuid ?? programUuid}
                          curriculumIndex={index}
                          open={
                            editingSection?.curriculumIndex === index &&
                            editingSection?.index === sectionIndex
                          }
                          onOpenChange={open => !open && setEditingSection(null)}
                          initialData={{ title: section }}
                          onSubmit={data => handleSaveSectionLocal(index, data, sectionIndex)}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {canEdit && (
                  <>
                    <Button
                      className="flex w-fit items-center"
                      onClick={() => setAddingSectionCurriculumIndex(index)}
                    >
                      <FiPlus />
                      <span className="text-[14px] font-semibold cursor-pointer">Add Section</span>
                    </Button>

                    {addingSectionCurriculumIndex === index && (
                      <AddSectionDialog
                        programUuid={openingProgramUuid ?? programUuid}
                        curriculumIndex={index}
                        open={true}
                        onOpenChange={open => !open && setAddingSectionCurriculumIndex(null)}
                        onSubmit={data => handleSaveSectionLocal(index, data)}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Save All Changes */}
      {canEdit && (
        <div className="flex justify-end mt-4">
          <Button disabled={!hasChanges} onClick={handleSaveAllToBackend}>
            Save All Changes
          </Button>
        </div>
      )}

      {/* Delete Modal */}
      {canEdit && deleteTarget && (
        <ModalDelete
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
          title={deleteTarget ? `Delete ${deleteTarget?.title }?`: ""}
          description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`
            : ""
        }
          onDelete={() =>
            deleteTarget && handleDeleteLocal(deleteTarget.type, deleteTarget.curriculumIndex, deleteTarget.index)
          }
        />
      )}
    </div>
  );
}