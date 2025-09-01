"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight, FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { DialogDemo } from "./curriculum-popup"; // adjust path
import { AddDescriptionDialog } from "./description";
import { SquarePen, Trash } from "lucide-react";

export default function CurriculumAdmin() {
  type Section = { id: string; title: string };
  type Topic = { id: string; title: string; sections: Section[] };

  const [curriculum, setCurriculum] = useState<Topic[]>([
    {
      id: "1",
      title: "Basic and fundamental programming concept",
      sections: [
        {
          id: "1",
          title: "Cloud Platform Overview",
        },
      ],
    },
  ]);

  // Delete a section from a topic
  const handleDeleteSection = (topicId: string, sectionId: string) => {
    setCurriculum((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
            ...topic,
            sections: topic.sections.filter((s) => s.id !== sectionId)
          }
          : topic
      )
    );
  };

  // Optional: Delete an entire topic
  const handleDeleteTopic = (topicId: string) => {
    setCurriculum((prev) => prev.filter((t) => t.id !== topicId));
  };
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  // Toggle topic collapse/expand
  const toggleExpand = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };
  // Add new topic
  const handleAddTopic = (title: string) => {
    const newTopic: Topic = { id: Date.now().toString(), title, sections: [] };
    setCurriculum((prev) => [...prev, newTopic]);
  };

  // Add section to topic
  const handleAddSection = (topicId: string, title: string) => {
    setCurriculum((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? { ...topic, sections: [...topic.sections, { id: Date.now().toString(), title }] }
          : topic
      )
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Curriculum</h2>
        <DialogDemo onAddTopic={handleAddTopic} />
      </div>

      {/* Topics */}
      {curriculum.map((topic) => {
        const isExpanded = expandedTopics.includes(topic.id);

        return (
          <div key={topic.id}
            className="flex flex-col gap-2.5 bg-accent rounded-sm p-4"
          >
            {/* Topic title */}
            <div className="flex justify-between items-center">
  <div className="flex items-center gap-2.5 cursor-pointer" >
    <FiPlus className="bg-black rounded-full text-white text-lg" />
    <span className="text-[16px] font-semibold text-foreground">{topic.title}</span>
  </div>
  <div className="flex gap-2 items-center">
    <Trash size={18}
      className="text-destructive cursor-pointer"
      onClick={() => handleDeleteTopic(topic.id)}
    />
    <SquarePen size={18} className="text-primary-hover" />
    <FaChevronDown onClick={() => toggleExpand(topic.id)}
      className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
    />
  </div>
</div>


            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {topic.sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex p-2.5 justify-between bg-background rounded-[4px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">{section.title}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Trash size={18}
                        className="text-destructive text-[18px] cursor-pointer"
                        onClick={() => handleDeleteSection(topic.id, section.id)}
                      />

                      <SquarePen size={18} className="text-primary-hover" />
                    </div>
                  </div>
                ))}

                {/* AddDescriptionDialog */}
                <AddDescriptionDialog 
                  onAddDescription={(title) => handleAddSection(topic.id, title)}
                />

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
