"use client";

import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddTopicDialog from "../course-requirement/AddTopicDialog";
import AddSectionDialog from "../course-requirement/SectionDialog";
import DeleteModal from "@/features/master-program/components/delete-modal-component";
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
  // Local state for immediate edits
  // ======================
  const [localCurriculums, setLocalCurriculums] = useState<CurriculumType[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<number | null>(null);
  const [editingSection, setEditingSection] = useState<{ curriculumIndex: number; index: number } | null>(null);
  const [addingSectionCurriculumIndex, setAddingSectionCurriculumIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "curriculum" | "section"; curriculumIndex?: number; index?: number } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isOpening = !!openingProgramUuid;
  const canEdit = !!(programUuid || openingProgramUuid);

  // Initialize local state from server
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

  const toggleExpand = (id: string) =>
    setExpandedItems(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));

  // ======================
  // Local handlers
  // ======================
const handleSaveCurriculumLocal = (
  data: { title: string; subtitle: string },
  targetIndex?: number
) => {
  let message = "";

  setLocalCurriculums((prev) => {
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

  // Show toast **after state update**
  toast.success(message);
};


  const handleSaveSectionLocal = (curriculumIndex: number, data: { title: string }, sectionIndex?: number) => {
    setLocalCurriculums(prev => {
      const newCurr = prev.map((c, i) => i === curriculumIndex ? { ...c, description: [...(c.description ?? [])] } : c);
      const curriculum = newCurr[curriculumIndex];
      if (!curriculum) return prev;
      newCurr[curriculumIndex] = sectionIndex !== undefined
        ? { ...curriculum, description: curriculum.description.map((d, i) => i === sectionIndex ? data.title : d) }
        : { ...curriculum, description: [...(curriculum.description ?? []), data.title] };
      setHasChanges(true);
      return newCurr;
    });
  };

const handleDeleteLocal = (
  type: "curriculum" | "section",
  curriculumIndex?: number,
  index?: number
) => {
  let deletedName = "";

  setLocalCurriculums((prev) => {
    let newCurriculums: CurriculumType[];

    if (type === "curriculum" && curriculumIndex !== undefined) {
      deletedName = prev[curriculumIndex]?.title || `Curriculum #${curriculumIndex + 1}`;
      newCurriculums = prev.filter((_, i) => i !== curriculumIndex);
    } else if (
      type === "section" &&
      curriculumIndex !== undefined &&
      index !== undefined
    ) {
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
  toast.info(`Curriculum "${deletedName}" deleted!`);
};


const handleSaveAllToBackend = async () => {
  try {
    if (isOpening) {
      await updateOpeningCurriculums({
        openingProgramUuid: openingProgramUuid!,
        curriculums: localCurriculums,
      }).unwrap();
    } else {
      await updateMasterCurriculums({
        programUuid,
        curriculums: localCurriculums,
      }).unwrap();
    }

    toast.success("All changes saved!");
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
            onSubmit={data => { handleSaveCurriculumLocal(data); setIsCreateOpen(false); }}
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

      {localCurriculums.map((curriculum, curriculumIndex) => {
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
                  <Trash size={16} className="text-destructive cursor-pointer" onClick={() => setDeleteTarget({ type: "curriculum", curriculumIndex })} />
                  <SquarePen size={16} className="text-primary-hover cursor-pointer" onClick={() => setEditingCurriculumIndex(curriculumIndex)} />

                  <AddTopicDialog
                    programUuid={openingProgramUuid ?? programUuid}
                    open={editingCurriculumIndex === curriculumIndex}
                    onOpenChange={open => setEditingCurriculumIndex(open ? curriculumIndex : null)}
                    initialData={{ title: curriculum.title, subtitle: curriculum.subtitle }}
                    onSubmit={data => { handleSaveCurriculumLocal(data, curriculumIndex); setEditingCurriculumIndex(null); }}
                  />

                  <FaChevronDown className={`transition-transform duration-200 cursor-pointer ${isExpanded ? "rotate-180" : "rotate-0"}`} onClick={() => toggleExpand(String(curriculumIndex))} />
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
                        <Trash size={16} className="text-destructive cursor-pointer" onClick={() => setDeleteTarget({ type: "section", curriculumIndex, index })} />
                        <SquarePen size={16} className="text-primary-hover cursor-pointer" onClick={() => setEditingSection({ curriculumIndex, index })} />

                        <AddSectionDialog
                          programUuid={openingProgramUuid ?? programUuid}
                          curriculumIndex={curriculumIndex}
                          open={editingSection?.curriculumIndex === curriculumIndex && editingSection?.index === index}
                          onOpenChange={open => !open && setEditingSection(null)}
                          initialData={{ title: section }}
                          onSubmit={data => handleSaveSectionLocal(curriculumIndex, data, index)}
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
                        onSubmit={data => handleSaveSectionLocal(curriculumIndex, data)}
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
        <DeleteModal
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
          itemName={deleteTarget.type === "curriculum" ? "curriculum" : "section"}
          onConfirm={() => deleteTarget && handleDeleteLocal(deleteTarget.type, deleteTarget.curriculumIndex, deleteTarget.index)}
        />
      )}
    </div>
  );
}
