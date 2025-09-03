"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { SquarePen, Trash } from "lucide-react";
import { AddTopicDialog } from "./curriculum-popup";
import { AddSectionDialog } from "./description"; // <- fixed import
import { Button } from "../ui/button";

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

  const toggleExpand = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

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

  const handleDeleteTopic = (topicId: string) => {
    setCurriculum((prev) => prev.filter((t) => t.id !== topicId));
  };

  const handleAddSection = (topicId: string, title: string) => {
    setCurriculum((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? { ...topic, sections: [...topic.sections, { id: Date.now().toString(), title }] }
          : topic
      )
    );
  };

  const handleEditSection = (topicId: string, sectionId: string, newTitle: string) => {
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
          ? { ...topic, sections: topic.sections.filter((s) => s.id !== sectionId) }
          : topic
      )
    );
  };

   // 👇 handle save
  const handleSave = () => {
    console.log("Saved Curriculum:", curriculum);
    // TODO: call API to save curriculum
    // Example:
    // await fetch('/api/curriculum', { method: 'POST', body: JSON.stringify(curriculum) });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Curriculum</h2>
        <AddTopicDialog
          onSubmit={handleAddTopic}
          trigger={
            <Button>
              <FiPlus />
              <span className="text-[14px] font-bold">Add Topic</span>
            </Button>
          }
        />
      </div>

      {curriculum.map((topic) => {
        const isExpanded = expandedTopics.includes(topic.id);
        return (
          <div key={topic.id} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
            <div className="flex justify-between items-center">
              <div
                className="flex flex-col cursor-pointer"
                onClick={() => toggleExpand(topic.id)}
              >
                <span className="text-[16px] font-semibold text-foreground">{topic.title}</span>
                {topic.subtitle && <span className="text-[12px] text-muted-foreground">{topic.subtitle}</span>}
              </div>

              <div className="flex gap-2 items-center">
                <Trash size={18} className="text-destructive cursor-pointer" onClick={() => handleDeleteTopic(topic.id)} />
                <AddSectionDialog
                  initialTitle={topic.title}
                  onSubmit={(newTitle) => handleEditTopic(topic.id, newTitle, topic.subtitle)}
                  trigger={<SquarePen size={18} className="text-primary-hover cursor-pointer" />}
                />
                <FaChevronDown
                  onClick={() => toggleExpand(topic.id)}
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                />
              </div>
            </div>

            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {topic.sections.map((section) => (
                  <div key={section.id} className="flex justify-between items-center p-2.5 bg-background rounded-[4px]">
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">{section.title}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Trash size={18} className="text-destructive cursor-pointer" onClick={() => handleDeleteSection(topic.id, section.id)} />
                      <AddSectionDialog
                        initialTitle={section.title}
                        onSubmit={(newTitle) => handleEditSection(topic.id, section.id, newTitle)}
                        trigger={<SquarePen size={18} className="text-primary-hover cursor-pointer" />}
                      />
                    </div>
                  </div>
                ))}

                {/* Add new section */}
                <AddSectionDialog
                  onSubmit={(title) => handleAddSection(topic.id, title)}
                  trigger={
                    <Button className="flex w-fit items-center">
                      <FiPlus />
                      <span className="text-[14px] font-semibold">Add Section</span>
                    </Button>
                  }
                />
              </div>
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
