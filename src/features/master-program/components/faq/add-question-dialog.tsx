"use client";
import React, { useEffect } from "react";
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

interface AddQuestionDialogProps {
  programUuid: string;
  faqIndex?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddQuestion?: (question: string, answer: string) => void;
  onUpdateQuestion?: (question: string, answer: string) => void;
  initialQuestion?: string;
  initialAnswer?: string;
  submitText?: string;
  trigger?: React.ReactNode;
  onSubmit: (data: QuestionFormValues) => void;
  initialData?: Partial<QuestionFormValues>;


};

export function AddQuestionDialog({
  initialData,
  onSubmit,
  open,
  onOpenChange,
  initialQuestion = "",
  initialAnswer = "",
  submitText = "Add Question",
  trigger,
  
}: AddQuestionDialogProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: { question: initialQuestion, answer: initialAnswer },
  });

  const { handleSubmit, reset, clearErrors, trigger: triggerValidation } = form;

  // Reset form when modal opens or initial values change
  useEffect(() => {
    if (open) {
      reset({ question: initialQuestion, answer: initialAnswer });
      clearErrors();
    }
  }, [initialQuestion, initialAnswer, open, reset, clearErrors]);

  const handleSubmitForm =async (data: QuestionFormValues) => {
    try {
      await onSubmit?.(data);
      // if (onUpdateQuestion) {
      //   onUpdateQuestion(data.question, data.answer);
      //   toast.success("Question updated successfully!");
      // } else if (onAddQuestion) {
      //   onAddQuestion(data.question, data.answer);
      //   toast.success("Question added successfully!");
      // }
      toast.success(
              initialData
                ? `Section "${data.question}" updated!`
                : `Section "${data.question}" created!`
            );
      onOpenChange?.(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        onInteractOutside={(event) => {
                  event.preventDefault(); // prevent closing if invalid
                  const values = form.getValues();
                  const hasEmpty = Object.values(values).some(
                    (v) => v === "" || v === undefined || v === null
                  );
                  if (hasEmpty) {
                    form.trigger(); // trigger validation
                    toast.error(
                      "Please fill all required fields before leaving the modal."
                    );
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
                  className="bg-red-500 hover:bg-red-400 hover:text-white text-white cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit">{submitText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
