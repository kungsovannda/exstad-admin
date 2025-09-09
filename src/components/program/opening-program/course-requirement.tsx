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
type Requirement = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  sections: Section[];
};

// ===== MOCK DATA =====
const initialRequirements: Requirement[] = [
  {
    id: "1",
    order: 1,
    title: "Course Requirements",
    subtitle:
      "Pre-university is the stage of education that bridges high school and university.",
    sections: [
      {
        id: "1-1",
        title:
          "For foundation-year or first-year students in the Digital Technology (IT) field",
      },
      {
        id: "1-2",
        title:
          "Grade 12 students who have the interest and aspiration to learn digital technology (IT) skills",
      },
    ],
  },
];

export default function CourseRequirementsAdmin() {
  const [requirements, setRequirements] = useState<Requirement[]>(
    initialRequirements
  );

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const toggleExpand = (id: string) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  // ===== Handlers =====
  const handleAddRequirement = (data: { title: string; subtitle?: string }) => {
    const newRequirement: Requirement = {
      id: Date.now().toString(),
      order: requirements.length + 1,
      title: data.title,
      subtitle: data.subtitle || "",
      sections: [],
    };
    setRequirements((prev) => [...prev, newRequirement]);
  };

  const handleEditRequirement = (
    id: string,
    data: { title: string; subtitle?: string }
  ) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  };

  const handleDeleteRequirement = (id: string) => {
    setRequirements((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddSection = (reqId: string, data: { title: string }) => {
    setRequirements((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              sections: [
                ...r.sections,
                { id: Date.now().toString(), title: data.title },
              ],
            }
          : r
      )
    );
  };

  const handleEditSection = (
    reqId: string,
    sectionId: string,
    data: { title: string }
  ) => {
    setRequirements((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              sections: r.sections.map((s) =>
                s.id === sectionId ? { ...s, ...data } : s
              ),
            }
          : r
      )
    );
  };

  const handleDeleteSection = (reqId: string, sectionId: string) => {
    setRequirements((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, sections: r.sections.filter((s) => s.id !== sectionId) }
          : r
      )
    );
  };

  const handleSave = () => {
    console.log("Saved Course Requirements:", requirements);
    toast.success("Course requirements saved!");
  };

  // ===== Modal State =====
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "section";
    id: string;
    parentId?: string;
  } | null>(null);

  const [editingRequirementId, setEditingRequirementId] = useState<string | null>(null);

  const [editingSection, setEditingSection] = useState<{
    reqId: string;
    sectionId: string;
  } | null>(null);

  const [addingSectionReqId, setAddingSectionReqId] = useState<string | null>(
    null
  );

  // ===== JSX =====
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header + Add Requirement */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Course Requirements</h2>
        <AddTopicDialog
          onSubmit={handleAddRequirement}
          trigger={
            <Button>
              <FiPlus />
              <span className="text-[14px] font-bold">Add Requirement</span>
            </Button>
          }
        />
      </div>

      {/* Requirement List */}
      {requirements.map((req) => {
        const isExpanded = expandedItems.includes(req.id);

        return (
          <div key={req.id} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => toggleExpand(req.id)}
              >
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <div className="flex flex-col cursor-pointer">
                  <span className="text-[16px] font-semibold text-foreground">{req.title}</span>
                  {req.subtitle && (
                    <span className="text-[12px] text-muted-foreground">{req.subtitle}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Trash
                  size={16}
                  className="text-destructive cursor-pointer"
                  onClick={() => setDeleteTarget({ type: "topic", id: req.id })}
                />
                <SquarePen
                  size={16}
                  className="text-primary-hover cursor-pointer"
                  onClick={() => setEditingRequirementId(req.id)}
                />

                {/* Edit Requirement Modal */}
                <AddTopicDialog
                  open={editingRequirementId === req.id}
                  onOpenChange={(open) => setEditingRequirementId(open ? req.id : null)}
                  initialData={{ title: req.title, subtitle: req.subtitle }}
                  onSubmit={(data) => {
                    handleEditRequirement(req.id, data);
                    setEditingRequirementId(null);
                  }}
                />

                <FaChevronDown
                  onClick={() => toggleExpand(req.id)}
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                />
              </div>
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {req.sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex justify-between items-center p-2.5 bg-background rounded-[4px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">{section.title}</span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Trash
                        size={16}
                        className="text-destructive cursor-pointer"
                        onClick={() =>
                          setDeleteTarget({ type: "section", id: section.id, parentId: req.id })
                        }
                      />
                      <SquarePen
                        size={16}
                        className="text-primary-hover cursor-pointer"
                        onClick={() =>
                          setEditingSection({ reqId: req.id, sectionId: section.id })
                        }
                      />

                      {/* Edit Section Modal */}
                      <AddSectionDialog
                        open={editingSection?.reqId === req.id && editingSection?.sectionId === section.id}
                        onOpenChange={(open) => !open && setEditingSection(null)}
                        initialData={{ title: section.title }}
                        onSubmit={(data) => {
                          handleEditSection(req.id, section.id, data);
                          setEditingSection(null);
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Add Section Modal */}
                <Button className="flex w-fit items-center" onClick={() => setAddingSectionReqId(req.id)}  >
                <FiPlus /> <span className="text-[14px] font-semibold">Add Section</span>  </Button>
                <AddSectionDialog
                  open={addingSectionReqId === req.id}
                  onOpenChange={(open) => !open && setAddingSectionReqId(null)}
                  onSubmit={(data) => {
                    handleAddSection(req.id, data);
                    setAddingSectionReqId(null);
                  }}
                />
              </div>
            )}

            {/* Delete Modal */}
            <DeleteModal
              open={!!deleteTarget}
              onOpenChange={(open) => !open && setDeleteTarget(null)}
              itemName={deleteTarget?.type === "topic" ? "requirement" : "section"}
              onConfirm={() => {
                if (deleteTarget?.type === "topic") handleDeleteRequirement(deleteTarget.id);
                else if (deleteTarget?.type === "section" && deleteTarget.parentId)
                  handleDeleteSection(deleteTarget.parentId, deleteTarget.id);
                setDeleteTarget(null);
                toast.success("Deleted successfully!");
              }}
            />
          </div>
        );
      })}

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} className="bg-primary text-white">
          Save Course Requirements
        </Button>
      </div>
    </div>
  );
}
