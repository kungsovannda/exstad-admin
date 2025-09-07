'use client';

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { SquarePen, Trash } from "lucide-react";
import { AddTopicDialog } from "../curriculum-popup"; // reuse popup for adding outcome
import { AddSectionDialog } from "../description";    // reuse section dialog
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { PiNotePencilFill } from "react-icons/pi";

type Section = { id: string; title: string };
type Outcome = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  sections: Section[];
};

export default function LearningOutcomesAdmin() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([
    {
      id: "1",
      order: 1,
      title: "Understand Java basics",
      subtitle: "OOP concepts",
      sections: [
        { id: "1", title: "Classes and Objects" },
        { id: "2", title: "Inheritance and Polymorphism" },
      ],
    },
  ]);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddOutcome = (title: string, subtitle: string) => {
    const newOutcome: Outcome = {
      id: Date.now().toString(),
      order: outcomes.length + 1,
      title,
      subtitle,
      sections: [],
    };
    setOutcomes(prev => [...prev, newOutcome]);
  };

  const handleEditOutcome = (id: string, title: string, subtitle: string) => {
    setOutcomes(prev =>
      prev.map(o => o.id === id ? { ...o, title, subtitle} : o)
    );
  };

  const handleDeleteOutcome = (id: string) => {
    setOutcomes(prev => prev.filter(o => o.id !== id));
  };

  const handleAddSection = (outcomeId: string, title: string) => {
    setOutcomes(prev =>
      prev.map(o =>
        o.id === outcomeId
          ? { ...o, sections: [...o.sections, { id: Date.now().toString(), title }] }
          : o
      )
    );
  };

  const handleEditSection = (outcomeId: string, sectionId: string, newTitle: string) => {
    setOutcomes(prev =>
      prev.map(o =>
        o.id === outcomeId
          ? {
              ...o,
              sections: o.sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s)
            }
          : o
      )
    );
  };

  const handleDeleteSection = (outcomeId: string, sectionId: string) => {
    setOutcomes(prev =>
      prev.map(o =>
        o.id === outcomeId
          ? { ...o, sections: o.sections.filter(s => s.id !== sectionId) }
          : o
      )
    );
  };

  const handleSave = () => {
    console.log("Saved Learning Outcomes:", outcomes);
    // TODO: send API request to save outcomes
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Learning Outcomes</h2>
        <AddTopicDialog
          onSubmit={(title, subtitle) => handleAddOutcome(title, subtitle)}
          trigger={
            <Button>
              <FiPlus />
              <span className="text-[14px] font-bold">Add Outcome</span>
            </Button>
          }
        />
      </div>

      {outcomes.map(outcome => {
        const isExpanded = expandedItems.includes(outcome.id);
        return (
          <div key={outcome.id} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col cursor-pointer" onClick={() => toggleExpand(outcome.id)}>
                <span className="text-[16px] font-semibold text-foreground">{outcome.title}</span>
                {outcome.subtitle && <span className="text-[12px] text-muted-foreground">{outcome.subtitle}</span>}
              </div>

              <div className="flex gap-2 items-center">
                <FaTrash size={18} className="text-destructive cursor-pointer" onClick={() => handleDeleteOutcome(outcome.id)} />
                <AddSectionDialog
                  initialTitle={outcome.title}
                  onSubmit={(newTitle) => handleEditOutcome(outcome.id, newTitle, outcome.subtitle)}
                  trigger={<PiNotePencilFill size={20} className="text-primary-hover cursor-pointer" />}
                />
                <FaChevronDown
                  onClick={() => toggleExpand(outcome.id)}
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                />
              </div>
            </div>

            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {outcome.sections.map(section => (
                  <div key={section.id} className="flex justify-between items-center p-2.5 bg-background rounded-[4px]">
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">{section.title}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FaTrash size={18} className="text-destructive cursor-pointer" onClick={() => handleDeleteSection(outcome.id, section.id)} />
                      <AddSectionDialog
                        initialTitle={section.title}
                        onSubmit={(newTitle) => handleEditSection(outcome.id, section.id, newTitle)}
                        trigger={<PiNotePencilFill size={20} className="text-primary-hover cursor-pointer" />}
                      />
                    </div>
                  </div>
                ))}

                <AddSectionDialog
                  onSubmit={(title) => handleAddSection(outcome.id, title)}
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
          Save Learning Outcomes
        </Button>
      </div>
    </div>
  );
}
