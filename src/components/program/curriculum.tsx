"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
// import CurriculumPopup from "./curriculum-popup"; // adjust path
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // ShadeCN Dialog
import { Button } from "@/components/ui/button"; // ShadeCN Button
import { DialogDemo } from "./curriculum-popup";
export default function CurriculumAdmin() {
  const [curriculum, setCurriculum] = useState([
    {
      id: 1,
      title: "Basic and fundamental programming concept",
      sections: [
        {
          id: 1,
          title: "Cloud Platform Overview",
          descriptions: ["Intro to cloud", "Services overview"],
        },
      ],
    },
  ]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Curriculum</h2>

        <DialogDemo/>
      </div>

      {/* Topics */}
      {curriculum.map((topic) => (
        <div key={topic.id} className="flex flex-col gap-2.5 bg-background-white-smoke rounded-[10px] p-4">
          {/* Topic title */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <FiPlus className="bg-black rounded-full text-white text-[18px]" />
              <span className="text-[16px] font-semibold text-foreground">{topic.title}</span>
            </div>
            <FaChevronDown />
          </div>

          {/* Sections */}
          {topic.sections.map((section) => (
            <div key={section.id} className="flex p-2.5 justify-between bg-background rounded-[4px]">
              <div className="flex items-center gap-2.5">
                <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                <span className="text-[14px] font-semibold text-foreground">{section.title}</span>
              </div>
              <div className="flex gap-2 items-center">
                <MdDeleteOutline className="text-secondary text-[18px]" />
                <FaRegEdit className="text-primary-hover" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
