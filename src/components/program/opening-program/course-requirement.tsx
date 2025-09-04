"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { SquarePen, Trash } from "lucide-react";
import { AddTopicDialog } from "../curriculum-popup"; // reuse dialog
import { AddSectionDialog } from "../description";
import { Button } from "@/components/ui/button";

type Section = { id: string; title: string };
type Requirement = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  sections: Section[];
};

export default function CourseRequirementsAdmin() {
  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: "1", order: 1, title: "Basic Programming Knowledge", subtitle: "", sections: [] },
  ]);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) =>
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

  const handleAddRequirement = (title: string, subtitle: string) => {
    const newReq: Requirement = {
      id: Date.now().toString(),
      order: requirements.length + 1,
      title,
      subtitle,
      sections: [],
    };
    setRequirements(prev => [...prev, newReq]);
  };

  const handleEditRequirement = (id: string, title: string, subtitle: string) => {
    setRequirements(prev =>
      prev.map(r => r.id === id ? { ...r, title, subtitle } : r)
    );
  };

  const handleDeleteRequirement = (id: string) => {
    setRequirements(prev => prev.filter(r => r.id !== id));
  };

  const handleAddSection = (reqId: string, title: string) => {
    setRequirements(prev =>
      prev.map(r =>
        r.id === reqId ? { ...r, sections: [...r.sections, { id: Date.now().toString(), title }] } : r
      )
    );
  };

  const handleEditSection = (reqId: string, sectionId: string, newTitle: string) => {
    setRequirements(prev =>
      prev.map(r =>
        r.id === reqId
          ? { ...r, sections: r.sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s) }
          : r
      )
    );
  };

  const handleDeleteSection = (reqId: string, sectionId: string) => {
    setRequirements(prev =>
      prev.map(r =>
        r.id === reqId
          ? { ...r, sections: r.sections.filter(s => s.id !== sectionId) }
          : r
      )
    );
  };

  const handleSave = () => {
    console.log("Saved Course Requirements:", requirements);
    // TODO: API call
  };

  return (
    <div className="flex flex-col gap-5 w-full  ">
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Course Requirements</h2>
        <AddTopicDialog
          onSubmit={(title, subtitle) => handleAddRequirement(title, subtitle)}
          trigger={
            <Button>
              <FiPlus />
              <span className="text-[14px] font-bold">Add Requirement</span>
            </Button>
          }
        />
      </div>

      {requirements.map(req => {
        const isExpanded = expandedItems.includes(req.id);
        return (
          <div key={req.id} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col cursor-pointer" onClick={() => toggleExpand(req.id)}>
                <span className="text-[16px] font-semibold text-foreground">{req.title}</span>
                {req.subtitle && <span className="text-[12px] text-muted-foreground">{req.subtitle}</span>}
              </div>

              <div className="flex gap-2 items-center">
                <Trash size={18} className="text-destructive cursor-pointer" onClick={() => handleDeleteRequirement(req.id)} />
                <AddSectionDialog
                  initialTitle={req.title}
                  onSubmit={(newTitle) => handleEditRequirement(req.id, newTitle, req.subtitle)}
                  trigger={<SquarePen size={18} className="text-primary-hover cursor-pointer" />}
                />
                <FaChevronDown
                  onClick={() => toggleExpand(req.id)}
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                />
              </div>
            </div>

            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {req.sections.map(section => (
                  <div key={section.id} className="flex justify-between items-center p-2.5 bg-background rounded-[4px]">
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">{section.title}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Trash size={18} className="text-destructive cursor-pointer" onClick={() => handleDeleteSection(req.id, section.id)} />
                      <AddSectionDialog
                        initialTitle={section.title}
                        onSubmit={(newTitle) => handleEditSection(req.id, section.id, newTitle)}
                        trigger={<SquarePen size={18} className="text-primary-hover cursor-pointer" />}
                      />
                    </div>
                  </div>
                ))}

                <AddSectionDialog
                  onSubmit={(title) => handleAddSection(req.id, title)}
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
          Save Course Requirements
        </Button>
      </div>
    </div>
  );
}
