"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
// import { PiNotePencilFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { AddTopicFaq } from "./faq-dialog";
import { AddQuestionDialog } from "./faqdialog";
import DeleteModal from "../../activity/delete-modal-component";
import { SquarePen, Trash } from "lucide-react";

type Section = { id: string; question: string; answer: string };
type Topic = { id: string; title: string; sections: Section[] };

export default function Faq() {
  const [faq, setFaq] = useState<Topic[]>([
    {
      id: "1",
      title: "Frequently Asked Questions",
      sections: [
        {
          id: "1",
          question: "What is the ISTAD Scholarship Program?",
          answer:
            "The ISTAD scholarship is a fully funded opportunity for students to study digital technology.",
        },
        {
          id: "2",
          question: "Which courses are included?",
          answer:
            "Programming, software development, and digital technology subjects.",
        },
      ],
    },
  ]);

  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<{
    topicId: string;
    sectionId: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "section";
    id: string;
    parentId?: string;
    itemName?: string;
  } | null>(null);

  // --- Topic Handlers ---
  const handleAddTopic = (title: string) => {
    const newTopic: Topic = { id: Date.now().toString(), title, sections: [] };
    setFaq((prev) => [...prev, newTopic]);
  };

  const handleEditTopic = (topicId: string, newTitle: string) => {
    setFaq((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, title: newTitle } : t))
    );
  };

  // const handleDeleteTopic = (topicId: string) => {
  //   setFaq((prev) => prev.filter((t) => t.id !== topicId));
  //   toast.success("Topic deleted successfully!");
  // };

  const toggleExpand = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  // --- Section Handlers ---
  const handleAddSection = (topicId: string, q: string, a: string) => {
    setFaq((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              sections: [
                ...t.sections,
                { id: Date.now().toString(), question: q, answer: a },
              ],
            }
          : t
      )
    );
  };

  const handleEditSection = (
    topicId: string,
    sectionId: string,
    q: string,
    a: string
  ) => {
    setFaq((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              sections: t.sections.map((s) =>
                s.id === sectionId ? { ...s, question: q, answer: a } : s
              ),
            }
          : t
      )
    );
  };

  // const handleDeleteSection = (topicId: string, sectionId: string) => {
  //   setFaq((prev) =>
  //     prev.map((t) =>
  //       t.id === topicId
  //         ? { ...t, sections: t.sections.filter((s) => s.id !== sectionId) }
  //         : t
  //     )
  //   );
  //   toast.success("Question deleted successfully!");
  // };

  const handleSave = () => {
    console.log("Saved FAQ:", faq);
    // TODO: send faq to API
  };

  return (  
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">FAQ</h2>
        <AddTopicFaq
          onSubmit={handleAddTopic}
          trigger={
            <Button className="flex items-center gap-2.5">
              <FiPlus />{" "}
              <span className="text-[14px] font-bold">Add Topic</span>
            </Button>
          }
        />
      </div>

      {/* Topics */}
      {faq.map((topic) => {
        const isExpanded = expandedTopics.includes(topic.id);

        return (
          <div key={topic.id} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4" >
            {/* Topic Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggleExpand(topic.id)}  >
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <span className="text-[16px] font-semibold">{topic.title}</span>
              </div>
              <div className="flex gap-2 items-center">
                {/* Delete Topic */}
                <Trash
                  size={16}
                  className="text-destructive cursor-pointer"
                  onClick={() =>
                    setDeleteTarget({ type: "topic", id: topic.id ,itemName: topic.title,   })
                  }
                />
                {/* Edit Topic (controlled) */}
                <SquarePen
                  size={16}
                  className="text-primary-hover cursor-pointer"
                  onClick={() => setEditingTopicId(topic.id)}
                />
                <AddTopicFaq
                  open={editingTopicId === topic.id}
                  onOpenChange={(open) =>
                    setEditingTopicId(open ? topic.id : null)
                  }
                  initialTitle={topic.title}
                  onSubmit={(newTitle) => handleEditTopic(topic.id, newTitle)}
                />
                {/* Expand */}
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
                {topic.sections.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col gap-1 p-2.5 bg-background rounded-[4px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold">
                        {s.question}
                      </span>
                    </div>

                    {/* Answer */}
                    <div className="ml-7 text-[14px] text-muted-foreground">
                      {s.answer}
                    </div>

                    {/* Edit / Delete Buttons */}
                    <div className="flex gap-2 mt-1 items-center ml-7">
                      <Trash
                        size={16}
                        className="text-destructive cursor-pointer"
                        onClick={() =>
                          setDeleteTarget({
                            type: "section",
                            id: s.id,
                            itemName: s.question,
                            parentId: topic.id,
                          })
                        }
                      />
                      <SquarePen
                        size={16}
                        className="text-primary-hover cursor-pointer"
                        onClick={() =>
                          setEditingSection({
                            topicId: topic.id,
                            sectionId: s.id,
                          })
                        }
                      />
                      <AddQuestionDialog
                        open={
                          editingSection?.topicId === topic.id &&
                          editingSection?.sectionId === s.id
                        }
                        onOpenChange={(open) =>
                          !open && setEditingSection(null)
                        }
                        initialQuestion={s.question}
                        initialAnswer={s.answer}
                        submitText="Update Question"
                        onUpdateQuestion={(q, a) =>
                          handleEditSection(topic.id, s.id, q, a)
                        }
                      />
                    </div>
                  </div>
                ))}

                {/* Add Section */}
                <AddQuestionDialog
                  submitText="Add Question"
                  trigger={
                    <Button className="flex items-center w-fit gap-2.5 mt-2">
                      <FiPlus className="text-[18px]" />
                      <span className="text-[14px] font-bold">
                        Add Question
                      </span>
                    </Button>
                  }
                  onAddQuestion={(q, a) => handleAddSection(topic.id, q, a)}
                />
              </div>
            )}
          </div>
        );
      })}

{deleteTarget && (
  <DeleteModal
    open={true}
    onOpenChange={(open) => !open && setDeleteTarget(null)}
    itemName={deleteTarget.itemName} // guaranteed to exist
    onConfirm={() => {
      if (deleteTarget.type === "topic") {
        setFaq((prev) => prev.filter((t) => t.id !== deleteTarget.id));
        toast.success("Topic deleted successfully!");
      } else if (deleteTarget.type === "section" && deleteTarget.parentId) {
        setFaq((prev) =>
          prev.map((t) =>
            t.id === deleteTarget.parentId
              ? { ...t, sections: t.sections.filter((s) => s.id !== deleteTarget.id) }
              : t
          )
        );
        toast.success("Question deleted successfully!");
      }
      setDeleteTarget(null);
    }}
  />
)}






      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} className="bg-primary text-white">
          Save FAQ
        </Button>
      </div>
    </div>
  );
}
