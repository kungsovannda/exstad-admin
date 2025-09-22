"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
// import { PiNotePencilFill } from "react-icons/pi";
import { Button } from "../ui/button";
import AddTopicDialog from "./curriculum-popup"; // default export
import { SectionModal } from "./description"; // named export
import DeleteModal from "./activity/delete-modal-component";
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

export default function CurriculumAdmin() {
  const [curriculum, setCurriculum] = useState<Topic[]>([
    {
      id: "1",
      order: 1,
      title: "Basic and fundamental programming concept",
      subtitle:
        "Refresh Java fundamentals, OOP concepts, and prepare for Spring development",
      sections: [
        { id: "1", title: "Cloud Platform Overview" },
        { id: "2", title: "Digital Ocean" },
      ],
    },
  ]);

  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<{
    topicId: string;
    sectionId: string;
  } | null>(null);

  // --- Topic Handlers ---
  const handleAddTopic = (title: string, subtitle: string) => {
    const newTopic: Topic = {
      id: Date.now().toString(),
      order: curriculum.length + 1,
      title,
      subtitle,
      sections: [],
    };
    setCurriculum((prev) => [...prev, newTopic]);
  };

  const handleEditTopic = (
    topicId: string,
    newTitle: string,
    newSubtitle: string
  ) => {
    setCurriculum((prev) =>
      prev.map((t) =>
        t.id === topicId ? { ...t, title: newTitle, subtitle: newSubtitle } : t
      )
    );
  };

  // const handleDelete = (topicId: string) => {
  //   setCurriculum((prev) => prev.filter((t) => t.id !== topicId));
  //   toast.success("Topic deleted successfully!");
  // };

  // const handleDeleteTopic = (topicId: string) => {
  //   setCurriculum((prev) => prev.filter((t) => t.id !== topicId));
  // };

  // --- Section Handlers ---
  const handleAddSection = (topicId: string, title: string) => {
    setCurriculum((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              sections: [
                ...topic.sections,
                { id: Date.now().toString(), title },
              ],
            }
          : topic
      )
    );
  };

  const handleEditSection = (
    topicId: string,
    sectionId: string,
    newTitle: string
  ) => {
    setCurriculum((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              sections: topic.sections.map((s) =>
                s.id === sectionId ? { ...s, title: newTitle } : s
              ),
            }
          : topic
      )
    );
  };

  const handleDeleteSection = (topicId: string, sectionId: string) => {
    setCurriculum((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              sections: topic.sections.filter((s) => s.id !== sectionId),
            }
          : topic
      )
    );
  };

  const toggleExpand = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSave = () => {
    console.log("Saved Curriculum:", curriculum);
    // TODO: call API or use RTK Query mutation
  };

  // Track which topic/section is being deleted
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "section";
    id: string;
    parentId?: string;
     itemName?: string;
  } | null>(null);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">Curriculum</h2>

        {/* Add Topic (uncontrolled modal with trigger) */}
        <AddTopicDialog
          onSubmit={({ title, subtitle }) =>  handleAddTopic(title, subtitle || "")  }
          trigger={
            <Button className="flex items-center gap-2.5">
              <FiPlus />{" "}
              <span className="text-[14px] font-bold">Add Topic</span>
            </Button>
          }
        />
      </div>

      {/* Topics List */}
      {curriculum.map((topic) => {
        const isExpanded = expandedTopics.includes(topic.id);

        return (
          <div  key={topic.id}  className="flex flex-col gap-2.5 bg-accent rounded-sm p-4"  >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggleExpand(topic.id)} >
               <FiPlus className="bg-black rounded-full text-white text-lg" />
              <div   className="flex flex-col cursor-pointer"  >
                <span className="text-[16px] font-semibold text-foreground">  {topic.title} </span>
                {topic.subtitle && (
                  <span className="text-[12px] text-muted-foreground"> {topic.subtitle} </span>
                )}
              </div>
              </div>
              <div className="flex gap-2 items-center">
                <Trash
                  size={16}
                  className="text-destructive cursor-pointer"
                  onClick={() =>
                    setDeleteTarget({ type: "topic", id: topic.id ,itemName:topic.title})
                  }
                />

                {/* Edit topic: controlled modal */}
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
                  onSubmit={(data) =>
                    handleEditTopic(topic.id, data.title, data.subtitle || "")
                  }
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

                      {/* edit section controlled */}
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
                      <SectionModal
                        open={
                          editingSection?.topicId === topic.id &&
                          editingSection?.sectionId === section.id
                        }
                        onOpenChange={(open) => {
                          if (!open) setEditingSection(null);
                          else
                            setEditingSection({
                              topicId: topic.id,
                              sectionId: section.id,
                            });
                        }}
                        initialData={{ title: section.title }}
                        onSubmit={(data) => {
                          handleEditSection(topic.id, section.id, data.title);
                          setEditingSection(null);
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Add new section (uncontrolled with trigger) */}
                <SectionModal
                  onSubmit={({ title }) => handleAddSection(topic.id, title)}
                  trigger={
                    <Button className="flex w-fit items-center gap-2.5">
                      <FiPlus />
                      <span className="text-[14px] font-semibold">
                        Add Section
                      </span>
                    </Button>
                  }
                />
              </div>
            )}
            {deleteTarget && (
            <DeleteModal
  open={!!deleteTarget}
  onOpenChange={(open) => {
    if (!open) setDeleteTarget(null); // clear when modal closes
  }}
  itemName={deleteTarget?.itemName} // directly use itemName, no fallback
  onConfirm={() => {
    if (deleteTarget?.type === "topic") {
      setCurriculum((prev) =>
        prev.filter((t) => t.id !== deleteTarget.id)
      );
      toast.success("Topic deleted successfully!");
    } else if (deleteTarget?.type === "section" && deleteTarget.parentId) {
      setCurriculum((prev) =>
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
            )}
          </div>
        );
      })}

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} className="bg-primary text-white">
          Save Curriculum
        </Button>
      </div>
    </div>
  );
}
