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
const topicSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type TopicFormValues = z.infer<typeof topicSchema>;

type AddTopicFaqProps = {
  initialTitle?: string;
  onSubmit: (title: string) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddTopicFaq({
  initialTitle = "",
  onSubmit,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: AddTopicFaqProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled =
    typeof controlledOpen === "boolean" && typeof onOpenChange === "function";
  const open = isControlled ? controlledOpen : localOpen;
  const setOpen = isControlled ? onOpenChange! : setLocalOpen;

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: { title: initialTitle },
  });

  const { handleSubmit, reset, clearErrors, getValues, trigger: triggerValidation } = form;

  // Reset form when dialog opens or initialTitle changes
  useEffect(() => {
    if (open) {
      reset({ title: initialTitle });
      clearErrors();
    }
  }, [initialTitle, open, reset, clearErrors]);

  const handleSubmitForm = (values: TopicFormValues) => {
    try {
      onSubmit(values.title);
      toast.success(
        initialTitle
          ? `Topic "${values.title}" updated successfully!`
          : `Topic "${values.title}" added successfully!`
      );
      setOpen(false);
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit topic. Please try again.");
    }
  };

  const handleFieldChange = (fieldName: keyof TopicFormValues, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => 
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
          if (values.title.trim() === "") {
            triggerValidation("title");
            toast.error("Please fill the topic title before leaving the modal.");
          }
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          const values = getValues();
          if (values.title.trim() === "") {
            triggerValidation("title");
            toast.error("Please fill the topic title before leaving the modal.");
          }
        }}
      >
        <DialogHeader className="mb-6">
          <DialogTitle>{initialTitle ? "Edit Topic" : "Add Topic"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter topic title..."
                      onChange={handleFieldChange("title", field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="bg-red-500 hover:bg-red-400 hover:text-white text-white">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">{initialTitle ? "Save Changes" : "Add Topic"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
