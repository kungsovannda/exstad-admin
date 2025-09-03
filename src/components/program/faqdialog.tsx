"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiPlus } from "react-icons/fi";
import { SquarePen } from "lucide-react";

type AddQuestionDialogProps = {
  onAddQuestion?: (question: string, answer: string) => void;
  onUpdateQuestion?: (question: string, answer: string) => void;
  initialQuestion?: string;
  initialAnswer?: string;
  submitText?: string;
  triggerAsButton?: boolean; // If true, show button trigger; else icon trigger
};

export function AddQuestionDialog({
  onAddQuestion,
  onUpdateQuestion,
  initialQuestion = "",
  initialAnswer = "",
  submitText = "Add Question",
  triggerAsButton = true,
}: AddQuestionDialogProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);

  useEffect(() => {
    setQuestion(initialQuestion);
    setAnswer(initialAnswer);
  }, [initialQuestion, initialAnswer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    if (onAddQuestion) onAddQuestion(question, answer);
    if (onUpdateQuestion) onUpdateQuestion(question, answer);

    setQuestion("");
    setAnswer("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerAsButton ? (
          <Button variant="default" className="flex items-center w-fit mt-2 gap-2.5">
            <FiPlus className="text-[18px]" />
            <span className="text-[14px] font-bold">{submitText}</span>
          </Button>
        ) : (
          <SquarePen
            className="cursor-pointer text-primary-hover"
            size={18}
          />
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle>{submitText}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="question-text">Question</Label>
              <Input
                id="question-text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question..."
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="answer-text">Answer</Label>
              <Input
                id="answer-text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter answer..."
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{submitText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
