"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// -----------------
// Validation schema
// -----------------
const topicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
});

type TopicFormValues = z.infer<typeof topicSchema>;

interface AddTopicDialogProps {
  trigger?: React.ReactNode;
  onSubmit: (data: TopicFormValues) => void;
  initialData?: Partial<TopicFormValues>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddTopicDialog({
  trigger,
  onSubmit,
  initialData,
  open: controlledOpen,
  onOpenChange,
}: AddTopicDialogProps) {
  // Support both controlled and uncontrolled usage
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled =
    typeof controlledOpen === "boolean" && typeof onOpenChange === "function";

  const open = isControlled ? controlledOpen : localOpen;
  const setOpen = isControlled ? onOpenChange! : setLocalOpen;

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, reset, clearErrors } = form;

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      reset({
        title: initialData?.title || "",
        subtitle: initialData?.subtitle || "",
      });
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const onSubmitForm = (data: TopicFormValues) => {
    try {
      onSubmit(data);
      toast.success(initialData ? "Topic updated!" : "Topic added!");
      setOpen(false); // <-- close modal
      reset();        // <-- reset form
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit topic. Please try again.");
    }
  };

  const handleFieldChange =
    (
      fieldName: keyof TopicFormValues,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    ) =>
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
          event.preventDefault(); // prevent closing if invalid
          const values = form.getValues();
          const hasEmpty = Object.values(values).some(
            (v) => v === "" || v === undefined || v === null
          );
          if (hasEmpty) {
            form.trigger(); // trigger validation
            toast.error("Please fill all required fields before leaving the modal.");
          }
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          const values = form.getValues();
          const hasEmpty = Object.values(values).some(
            (v) => v === "" || v === undefined || v === null
          );
          if (hasEmpty) {
            form.trigger();
            toast.error("Please fill all required fields before leaving the modal.");
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Topic" : "Add Topic"}</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter title..."
                      onChange={handleFieldChange("title", field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter subtitle..."
                      onChange={handleFieldChange("subtitle", field.onChange)}
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
              <Button type="submit">
                {initialData ? "Save Changes" : "Add Topic"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
