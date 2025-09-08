"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { PiNotePencilFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import DeleteModal from "../activity/delete-modal-component";
import { toast } from "sonner";
import { AddTopicDialog } from "../curriculum-popup"; // for parent add/edit
import { AddSectionDialog } from "../description"; // for section add/edit

export type SectionType = { id: string; title: string };
export type ItemType = {
  id: string;
  title: string;
  subtitle?: string;
  sections: SectionType[];
};

type ItemAdminProps = {
  title: string; // "Learning Outcomes" or "Course Requirements"
  initialItems?: ItemType[];
};

export default function ItemAdmin({ title, initialItems = [] }: ItemAdminProps) {
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "item" | "section"; itemId?: string; sectionId?: string } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  // --- CRUD functions (front-end only) ---
  const handleAddItem = (title: string, subtitle?: string) => {
    const newItem: ItemType = { id: Date.now().toString(), title, subtitle, sections: [] };
    setItems(prev => [...prev, newItem]);
    toast.success(`${title} added successfully!`);
  };

  const handleEditItem = (id: string, title: string, subtitle?: string) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, title, subtitle } : i)));
    toast.success(`${title} updated successfully!`);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success("Item deleted successfully!");
  };

  const handleAddSection = (itemId: string, title: string) => {
    setItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, sections: [...i.sections, { id: Date.now().toString(), title }] } : i))
    );
    toast.success("Section added successfully!");
  };

  const handleEditSection = (itemId: string, sectionId: string, title: string) => {
    setItems(prev =>
      prev.map(i =>
        i.id === itemId ? { ...i, sections: i.sections.map(s => (s.id === sectionId ? { ...s, title } : s)) } : i
      )
    );
    toast.success("Section updated successfully!");
  };

  const handleDeleteSection = (itemId: string, sectionId: string) => {
    setItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, sections: i.sections.filter(s => s.id !== sectionId) } : i))
    );
    toast.success("Section deleted successfully!");
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">{title}</h2>
        <AddTopicDialog
          onSubmit={(title, subtitle) => handleAddItem(title, subtitle)}
          trigger={
            <Button className="flex items-center gap-2">
              <FiPlus />
              <span className="text-[14px] font-bold">Add {title}</span>
            </Button>
          }
        />
      </div>

      {/* Items */}
      {items.map(item => {
        const isExpanded = expandedItems.includes(item.id);
        return (
          <div key={item.id} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
            {/* Item Header */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col cursor-pointer" onClick={() => toggleExpand(item.id)}>
                <span className="text-[16px] font-semibold text-foreground">{item.title}</span>
                {item.subtitle && <span className="text-[12px] text-muted-foreground">{item.subtitle}</span>}
              </div>
              <div className="flex gap-2 items-center">
                <FaTrash size={18} className="text-destructive cursor-pointer" onClick={() => setDeleteTarget({ type: "item", itemId: item.id })} />
                <AddTopicDialog
                  initialTitle={item.title}
                  initialSubtitle={item.subtitle}
                  onSubmit={(title, subtitle) => handleEditItem(item.id, title, subtitle)}
                  trigger={<PiNotePencilFill size={20} className="text-primary-hover cursor-pointer" />}
                />
                <FaChevronDown
                  onClick={() => toggleExpand(item.id)}
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                />
              </div>
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {item.sections.map(section => (
                  <div key={section.id} className="flex justify-between items-center p-2.5 bg-background rounded-[4px]">
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">{section.title}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FaTrash size={18} className="text-destructive cursor-pointer" onClick={() => setDeleteTarget({ type: "section", itemId: item.id, sectionId: section.id })} />
                      <AddSectionDialog
                        initialTitle={section.title}
                        onSubmit={(title) => handleEditSection(item.id, section.id, title)}
                        trigger={<PiNotePencilFill size={20} className="text-primary-hover cursor-pointer" />}
                      />
                    </div>
                  </div>
                ))}
                <AddSectionDialog
                  onSubmit={(title) => handleAddSection(item.id, title)}
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

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={
          deleteTarget?.type === "item"
            ? items.find(i => i.id === deleteTarget.itemId)?.title ?? "item"
            : deleteTarget?.type === "section" && deleteTarget.itemId
            ? items.find(i => i.id === deleteTarget.itemId)?.sections.find(s => s.id === deleteTarget.sectionId)?.title ?? "section"
            : ""
        }
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.type === "item" && deleteTarget.itemId) handleDeleteItem(deleteTarget.itemId);
          if (deleteTarget.type === "section" && deleteTarget.itemId && deleteTarget.sectionId)
            handleDeleteSection(deleteTarget.itemId, deleteTarget.sectionId);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
