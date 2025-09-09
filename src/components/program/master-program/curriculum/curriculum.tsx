"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Button } from "../../../ui/button";
import AddTopicDialog from "../../opening-program/item-admin/add-topic-dialog";
import AddSectionDialog from "../../opening-program/item-admin/section-dialog";
import DeleteModal from "../../activity/delete-modal-component";
import { toast } from "sonner";
import { SquarePen, Trash } from "lucide-react";

type Section = { id: string; title: string };
type Topic = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  sections: Section[];
};

// ===== MOCK DATA =====
const initialCurriculum: Topic[] = [
  {
    id: "1",
    order: 1,
    title: "Basic and fundamental programming concept",
    subtitle:
      "Refresh Java fundamentals, OOP concepts, and prepare for Spring development",
    sections: [
      { id: "1-1", title: "Cloud Platform Overview" },
      { id: "1-2", title: "Digital Ocean" },
    ],
  },
];

export default function CurriculumAdmin() {
  const [curriculum, setCurriculum] = useState<Topic[]>(initialCurriculum);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<{
    topicId: string;
    sectionId: string;
  } | null>(null);
  const [addingSectionTopicId, setAddingSectionTopicId] = useState<
    string | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "section";
    id: string;
    parentId?: string;
    itemName?: string;
  } | null>(null);

  // ===== Handlers =====
  const toggleExpand = (id: string) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleAddTopic = (title: string, subtitle: string) => {
    const newTopic: Topic = {
      id: Date.now().toString(),
      order: curriculum.length + 1,
      title,
      subtitle,
      sections: [],
    };
    setCurriculum((prev) => [...prev, newTopic]);
    return true;
  };

  const handleEditTopic = (id: string, title: string, subtitle: string) => {
    setCurriculum((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, subtitle } : t))
    );
  };

  const handleDeleteTopic = (id: string) => {
    setCurriculum((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddSection = (topicId: string, title: string) => {
    setCurriculum((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              sections: [...t.sections, { id: Date.now().toString(), title }],
            }
          : t
      )
    );
  };

  const handleEditSection = (
    topicId: string,
    sectionId: string,
    title: string
  ) => {
    setCurriculum((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              sections: t.sections.map((s) =>
                s.id === sectionId ? { ...s, title } : s
              ),
            }
          : t
      )
    );
  };

  const handleDeleteSection = (topicId: string, sectionId: string) => {
    setCurriculum((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? { ...t, sections: t.sections.filter((s) => s.id !== sectionId) }
          : t
      )
    );
  };

  const handleSave = () => {
    console.log("Saved Curriculum:", curriculum);
    toast.success("Curriculum saved!");
  };

  // ===== JSX =====
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header + Add Topic */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Curriculum</h2>
        <AddTopicDialog
          onSubmit={({ title, subtitle }) =>
            handleAddTopic(title, subtitle || "")
          }
          trigger={
            <Button className="flex items-center gap-2.5">
              <FiPlus />
              <span className="text-[14px] font-bold">Add Topic</span>
            </Button>
          }
        />
      </div>

      {/* Curriculum List */}
      {curriculum.map((topic) => {
        const isExpanded = expandedItems.includes(topic.id);
        return (
          <div
            key={topic.id}
            className="flex flex-col gap-2.5 bg-accent rounded-sm p-4"
          >
            {/* Topic Header */}
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => toggleExpand(topic.id)}
              >
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-foreground">
                    {topic.title}
                  </span>
                  {topic.subtitle && (
                    <span className="text-[12px] text-muted-foreground">
                      {topic.subtitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Trash
                  size={16}
                  className="text-destructive cursor-pointer"
                  onClick={() =>
                    setDeleteTarget({
                      type: "topic",
                      id: topic.id,
                      itemName: topic.title,
                    })
                  }
                />
                <SquarePen
                  size={16}
                  className="text-primary-hover cursor-pointer"
                  onClick={() => setEditingTopicId(topic.id)}
                />

                <AddTopicDialog
                  open={editingTopicId === topic.id}
                  onOpenChange={(open) =>
                    setEditingTopicId(open ? topic.id : null)
                  }
                  initialData={{ title: topic.title, subtitle: topic.subtitle }}
                  onSubmit={(data) => {
                    handleEditTopic(topic.id, data.title, data.subtitle || "");
                    setEditingTopicId(null);
                  }}
                />

                <FaChevronDown
                  onClick={() => toggleExpand(topic.id)}
                  className={`transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {topic.sections.map((section) => (
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
                      <Trash
                        size={16}
                        className="text-destructive cursor-pointer"
                        onClick={() =>
                          setDeleteTarget({
                            type: "section",
                            id: section.id,
                            parentId: topic.id,
                            itemName: section.title,
                          })
                        }
                      />
                      <SquarePen
                        size={16}
                        className="text-primary-hover cursor-pointer"
                        onClick={() =>
                          setEditingSection({
                            topicId: topic.id,
                            sectionId: section.id,
                          })
                        }
                      />

                      <AddSectionDialog
                        open={
                          editingSection?.topicId === topic.id &&
                          editingSection?.sectionId === section.id
                        }
                        onOpenChange={(open) =>
                          !open && setEditingSection(null)
                        }
                        initialData={{ title: section.title }}
                        onSubmit={(data) => {
                          handleEditSection(topic.id, section.id, data.title);
                          setEditingSection(null);
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Add Section Button + Modal */}
                <Button
                  className="flex w-fit items-center"
                  onClick={() => setAddingSectionTopicId(topic.id)}
                >
                  <FiPlus />{" "}
                  <span className="text-[14px] font-semibold">Add Section</span>
                </Button>
                <AddSectionDialog
                  open={addingSectionTopicId === topic.id}
                  onOpenChange={(open) =>
                    !open && setAddingSectionTopicId(null)
                  }
                  onSubmit={(data) => {
                    handleAddSection(topic.id, data.title); // pass the title string
                    setAddingSectionTopicId(null);
                  }}
                />
              </div>
            )}

            {/* Delete Modal */}
            <DeleteModal
              open={!!deleteTarget}
              onOpenChange={(open) => !open && setDeleteTarget(null)}
              itemName={deleteTarget?.itemName}
              onConfirm={() => {
                if (!deleteTarget) return;

                if (deleteTarget.type === "topic") {
                  handleDeleteTopic(deleteTarget.id);
                  toast.success("Topic deleted successfully!");
                } else if (
                  deleteTarget.type === "section" &&
                  deleteTarget.parentId
                ) {
                  handleDeleteSection(deleteTarget.parentId, deleteTarget.id);
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
          Save Curriculum
        </Button>
      </div>
    </div>
  );
}
