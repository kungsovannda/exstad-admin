"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";

// Zod schema
const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

type AddQuestionDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddQuestion?: (question: string, answer: string) => void;
  onUpdateQuestion?: (question: string, answer: string) => void;
  initialQuestion?: string;
  initialAnswer?: string;
  submitText?: string;
  trigger?: React.ReactNode;
};

export function AddQuestionDialog({
  open: controlledOpen,
  onOpenChange,
  onAddQuestion,
  onUpdateQuestion,
  initialQuestion = "",
  initialAnswer = "",
  submitText = "Add Question",
  trigger,
}: AddQuestionDialogProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled = typeof controlledOpen === "boolean" && typeof onOpenChange === "function";
  const open = isControlled ? controlledOpen : localOpen;
  const setOpen = isControlled ? onOpenChange! : setLocalOpen;

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: initialQuestion,
      answer: initialAnswer,
    },
  });

  // Reset form when dialog opens or initial values change
  useEffect(() => {
    form.reset({
      question: initialQuestion,
      answer: initialAnswer,
    });
  }, [initialQuestion, initialAnswer, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values: QuestionFormValues) => {
    try {
      if (onUpdateQuestion) {
        onUpdateQuestion(values.question, values.answer);
        toast.success("Question updated successfully!");
      } else if (onAddQuestion) {
        onAddQuestion(values.question, values.answer);
        toast.success("Question added successfully!");
      }

      setOpen(false);
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit question. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg">
        <DialogHeader className="mb-6">
          <DialogTitle>{submitText}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter question..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter answer..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{submitText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
