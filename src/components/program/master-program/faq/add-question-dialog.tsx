"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// -----------------
// Validation schema
// -----------------
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
  const isControlled =
    typeof controlledOpen === "boolean" && typeof onOpenChange === "function";
  const open = isControlled ? controlledOpen : localOpen;
  const setOpen = isControlled ? onOpenChange! : setLocalOpen;

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: { question: initialQuestion, answer: initialAnswer },
  });

  const { handleSubmit, reset, clearErrors, getValues, trigger: triggerValidation } = form;

  // Reset form when modal opens or initial values change
  useEffect(() => {
    if (open) {
      reset({ question: initialQuestion, answer: initialAnswer });
      clearErrors();
    }
  }, [initialQuestion, initialAnswer, open, reset, clearErrors]);

  const handleSubmitForm = (values: QuestionFormValues) => {
    try {
      if (onUpdateQuestion) {
        onUpdateQuestion(values.question, values.answer);
        toast.success("Question updated successfully!");
      } else if (onAddQuestion) {
        onAddQuestion(values.question, values.answer);
        toast.success("Question added successfully!");
      }
      setOpen(false);
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit question. Please try again.");
    }
  };

  const handleFieldChange =
    (fieldName: keyof QuestionFormValues, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearErrors(fieldName);
      onChange(e);
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!open && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        onInteractOutside={(event) => {
          event.preventDefault();
          const values = getValues();
          const hasEmpty = Object.values(values).some((v) => !v?.trim());
          if (hasEmpty) {
            triggerValidation();
            toast.error("Please fill all required fields before leaving the modal.");
          }
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          const values = getValues();
          const hasEmpty = Object.values(values).some((v) => !v?.trim());
          if (hasEmpty) {
            triggerValidation();
            toast.error("Please fill all required fields before leaving the modal.");
          }
        }}
      >
        <DialogHeader className="mb-6">
          <DialogTitle>{submitText}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter question..."
                      onChange={handleFieldChange("question", field.onChange)}
                    />
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
                    <Input
                      {...field}
                      placeholder="Enter answer..."
                      onChange={handleFieldChange("answer", field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="bg-red-500 hover:bg-red-400 hover:text-white text-white"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">{submitText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
