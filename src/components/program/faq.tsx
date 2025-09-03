"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { AddTopicDialog } from "./curriculum-popup";
import { SquarePen, Trash } from "lucide-react";
import { AddQuestionDialog } from "./faqdialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LearningOutcomesAdmin from "./opening-program/learning-outcome";
import CourseRequirementsAdmin from "./opening-program/course-requirement";

export default function Faq() {
  type Section = {
    id: string;
    question: string;
    answer: string;
  };

  type Topic = {
    id: string;
    title: string;
    sections: Section[];
  };

  const [curriculum, setCurriculum] = useState<Topic[]>([
    {
      id: "1",
      title: "Frequently Asked Questions",
      sections: [
        {
          id: "1",
          question: "What is the ISTAD Scholarship Program?",
          answer:
            "The ISTAD scholarship is a fully funded opportunity for students to study digital technology, focusing on programming and software development.",
        },
        {
          id: "2",
          question:
            "Which courses or subjects are included in the scholarship?",
          answer: "Yes, after completing the course.",
        },
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

  const handleAddTopic = (title: string) => {
    const newTopic: Topic = { id: Date.now().toString(), title, sections: [] };
    setCurriculum((prev) => [...prev, newTopic]);
  };

  const handleEditTopic = (topicId: string, newTitle: string) => {
    setCurriculum((prev) =>
      prev.map((topic) =>
        topic.id === topicId ? { ...topic, title: newTitle } : topic
      )
    );
  };

  const handleDeleteTopic = (topicId: string) => {
    setCurriculum((prev) => prev.filter((t) => t.id !== topicId));
  };

  const handleAddQuestion = (
    topicId: string,
    question: string,
    answer: string
  ) => {
    setCurriculum((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              sections: [
                ...topic.sections,
                { id: Date.now().toString(), question, answer },
              ],
            }
          : topic
      )
    );
  };

  const handleEditQuestion = (
    topicId: string,
    sectionId: string,
    newQuestion: string,
    newAnswer: string
  ) => {
    setCurriculum((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              sections: topic.sections.map((s) =>
                s.id === sectionId
                  ? { ...s, question: newQuestion, answer: newAnswer }
                  : s
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

  // 👇 handle save
  const handleSave = () => {
    console.log("Saved Curriculum:", curriculum);
    // TODO: call API to save curriculum
    // Example:
    // await fetch('/api/curriculum', { method: 'POST', body: JSON.stringify(curriculum) });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">FAQ</h2>
        <AddTopicDialog onSubmit={handleAddTopic} trigger={
            <Button className="flex items-center gap-2.5">
              <FiPlus />
              <span className="text-[14px] font-bold">Add Topic</span>
            </Button>
          }/>
      </div>

      {/* Topics */}
      {curriculum.map((topic) => {
        const isExpanded = expandedTopics.includes(topic.id);

        return (
          <div  key={topic.id}  className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
            {/* Topic title */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => toggleExpand(topic.id)}
              >
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <span className="text-[16px] font-semibold text-foreground">  {topic.title}</span>
              </div>

              <div className="flex gap-2 items-center">
                {/* Delete Topic */}
                <Trash size={18} className="text-destructive cursor-pointer" onClick={() => handleDeleteTopic(topic.id)} />
                {/* Edit Topic */}
                <Dialog>
                  <DialogTrigger asChild>
                    <SquarePen  size={18}  className="text-primary-hover cursor-pointer"/>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg">
                    <form  onSubmit={(e) => {    e.preventDefault();    const target = e.target as typeof e.target & {      title: { value: string };    };
                        handleEditTopic(topic.id, target.title.value);
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Edit Topic</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3">
                        <Label htmlFor="title">Topic Title</Label>
                        <Input  id="title"  defaultValue={topic.title}  placeholder="Enter topic title"/>
                      </div>
                      <DialogFooter className="mt-6">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Expand Icon */}
                <FaChevronDown onClick={() => toggleExpand(topic.id)} className={`transition-transform duration-200 ${   isExpanded ? "rotate-180" : "rotate-0" }`} />
              </div>
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {topic.sections.map((section) => (
                  <div  key={section.id}  className="flex flex-col gap-1 p-2.5 bg-background rounded-[4px]">
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold text-foreground">
                        {section.question}
                      </span>
                    </div>
                    <div className="ml-7 text-[14px] text-muted-foreground">
                      {section.answer}
                    </div>
                    <div className="flex gap-2 mt-1 items-center ml-7">
                      {/* Delete Section */}
                      <Trash size={18} className="text-destructive cursor-pointer" onClick={() =>   handleDeleteSection(topic.id, section.id) }  />

                      {/* Edit Section */}
                      <AddQuestionDialog
                        initialQuestion={section.question}
                        initialAnswer={section.answer}
                        submitText="Update Question"
                        triggerAsButton={false}
                        onUpdateQuestion={(q, a) =>
                          handleEditQuestion(topic.id, section.id, q, a)
                        }
                      />
                    </div>
                  </div>
                ))}

                {/* Add Question */}
                <AddQuestionDialog  onAddQuestion={(q, a) =>    handleAddQuestion(topic.id, q, a)  }  submitText="Add Question"  triggerAsButton={true}/>
              </div>
            )}
          </div>
        );
      })}
       <div className="flex justify-end mt-6">
              <Button onClick={handleSave} className="bg-primary text-white">
                Save FAQ
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-6 w-full ">
            <LearningOutcomesAdmin/>
            <CourseRequirementsAdmin/>
            </div>
    </div>
  );
}
