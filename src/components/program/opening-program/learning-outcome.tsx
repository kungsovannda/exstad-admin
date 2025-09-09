"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddTopicDialog from "./item-admin/add-topic-dialog";
import AddSectionDialog from "./item-admin/section-dialog";
import DeleteModal from "../activity/delete-modal-component";
import { SquarePen, Trash } from "lucide-react";

type Section = { id: string; title: string };
type Outcome = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  sections: Section[];
};

const initialRequirements: Outcome[] = [
  {
    id: "1",
    title: "Learning Outcomes",
    order: 1,
    subtitle:
      "Upon completing the course, learners will understand the concept of the programming process.",
    sections: [
      {
        id: "1-1",
        title: "Build responsive layouts with HTML, CSS, and Tailwind",
      },
      {
        id: "1-2",
        title: "Create interactive UIs using React",
      },
    ],
  },
];

export default function LearningOutcomesAdmin() {
  const [outcomes, setOutcomes] = useState<Outcome[]>(initialRequirements);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const toggleExpand = (id: string) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  // ===== Outcome Handlers =====
  const handleAddOutcome = (data: { title: string; subtitle?: string }) => {
    const newOutcome: Outcome = {
      id: Date.now().toString(),
      order: outcomes.length + 1,
      title: data.title,
      subtitle: data.subtitle || "",
      sections: [],
    };
    setOutcomes((prev) => [...prev, newOutcome]);
  };

  const handleEditOutcome = (
    id: string,
    data: { title: string; subtitle?: string }
  ) => {
    setOutcomes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...data } : o))
    );
  };

  // ===== Section Handlers =====
  const handleAddSection = (outcomeId: string, data: { title: string }) => {
    setOutcomes((prev) =>
      prev.map((o) =>
        o.id === outcomeId
          ? {
              ...o,
              sections: [
                ...o.sections,
                { id: Date.now().toString(), title: data.title },
              ],
            }
          : o
      )
    );
  };

  const handleEditSection = (
    outcomeId: string,
    sectionId: string,
    data: { title: string }
  ) => {
    setOutcomes((prev) =>
      prev.map((o) =>
        o.id === outcomeId
          ? {
              ...o,
              sections: o.sections.map((s) =>
                s.id === sectionId ? { ...s, ...data } : s
              ),
            }
          : o
      )
    );
  };

  const handleSave = () => {
    console.log("Saved Learning Outcomes:", outcomes);
    // TODO: API integration
  };

  // ===== State for Modals =====
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "section";
    id: string;
    parentId?: string;
  } | null>(null);

  const [editingOutcomeId, setEditingOutcomeId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<{
    outcomeId: string;
    sectionId: string;
  } | null>(null);

  const [addingSectionOutcomeId, setAddingSectionOutcomeId] = useState<
    string | null
  >(null);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header + Add Outcome */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">
          Learning Outcomes
        </h2>
        <AddTopicDialog
          onSubmit={handleAddOutcome}
          trigger={
            <Button>
              <FiPlus />
              <span className="text-[14px] font-bold">Add Outcome</span>
            </Button>
          }
        />
      </div>

      {/* Outcome List */}
      {outcomes.map((outcome) => {
        const isExpanded = expandedItems.includes(outcome.id);
        return (
          <div
            key={outcome.id}
            className="flex flex-col gap-2.5 bg-accent rounded-sm p-4"
          >
            {/* Outcome Header */}
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => toggleExpand(outcome.id)}
              >
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <div className="flex flex-col cursor-pointer">
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
                {/* Delete Outcome */}
                <Trash
                  size={16}
                  className="text-destructive cursor-pointer"
                  onClick={() =>
                    setDeleteTarget({ type: "topic", id: outcome.id })
                  }
                />
                {/* Edit Outcome */}
                <SquarePen
                  size={16}
                  className="text-primary-hover cursor-pointer"
                  onClick={() => setEditingOutcomeId(outcome.id)}
                />

                <AddTopicDialog
                  open={editingOutcomeId === outcome.id}
                  onOpenChange={(open) =>
                    setEditingOutcomeId(open ? outcome.id : null)
                  }
                  initialData={{
                    title: outcome.title,
                    subtitle: outcome.subtitle,
                  }}
                  onSubmit={(data) => {
                    handleEditOutcome(outcome.id, data);
                    setEditingOutcomeId(null);
                  }}
                />

                <FaChevronDown
                  onClick={() => toggleExpand(outcome.id)}
                  className={`transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {outcome.sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex justify-between items-center p-2.5 bg-background rounded-[4px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">
                        {section.title}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      {/* Delete Section */}
                      <Trash
                        size={16}
                        className="text-destructive cursor-pointer"
                        onClick={() =>
                          setDeleteTarget({
                            type: "section",
                            id: section.id,
                            parentId: outcome.id,
                          })
                        }
                      />

                      {/* Edit Section */}
                      <SquarePen
                        size={16}
                        className="text-primary-hover cursor-pointer"
                        onClick={() =>
                          setEditingSection({
                            outcomeId: outcome.id,
                            sectionId: section.id,
                          })
                        }
                      />

                      <AddSectionDialog
                        open={
                          editingSection?.outcomeId === outcome.id &&
                          editingSection?.sectionId === section.id
                        }
                        onOpenChange={(open) => {
                          if (!open) setEditingSection(null);
                        }}
                        initialData={{ title: section.title }}
                        onSubmit={(data) => {
                          handleEditSection(outcome.id, section.id, data);
                          setEditingSection(null);
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Add Section (Controlled) */}
                <Button
                  className="flex w-fit items-center"
                  onClick={() => setAddingSectionOutcomeId(outcome.id)}
                >
                  <FiPlus />
                  <span className="text-[14px] font-semibold">Add Section</span>
                </Button>

                <AddSectionDialog
                  open={addingSectionOutcomeId === outcome.id}
                  onOpenChange={(open) =>
                    !open && setAddingSectionOutcomeId(null)
                  }
                  onSubmit={(data) => {
                    handleAddSection(outcome.id, data);
                    setAddingSectionOutcomeId(null);
                  }}
                />
              </div>
            )}

            {/* Delete Modal */}
            <DeleteModal
              open={!!deleteTarget}
              onOpenChange={(open) => !open && setDeleteTarget(null)}
              itemName={
                deleteTarget?.type === "topic"
                  ? "topic"
                  : deleteTarget?.type === "section"
                  ? "section"
                  : "item"
              }
              onConfirm={() => {
                if (deleteTarget?.type === "topic") {
                  setOutcomes((prev) =>
                    prev.filter((t) => t.id !== deleteTarget.id)
                  );
                  toast.success("Topic deleted successfully!");
                } else if (
                  deleteTarget?.type === "section" &&
                  deleteTarget.parentId
                ) {
                  setOutcomes((prev) =>
                    prev.map((t) =>
                      t.id === deleteTarget.parentId
                        ? {
                            ...t,
                            sections: t.sections.filter(
                              (s) => s.id !== deleteTarget.id
                            ),
                          }
                        : t
                    )
                  );
                  toast.success("Section deleted successfully!");
                }
                setDeleteTarget(null);
              }}
            />
          </div>
        );
      })}

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} className="bg-primary text-white">
          Save Learning Outcomes
        </Button>
      </div>
    </div>
  );
}
