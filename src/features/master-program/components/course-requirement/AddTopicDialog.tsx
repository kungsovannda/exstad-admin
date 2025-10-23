"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
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

const topicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
});

type TopicFormValues = z.infer<typeof topicSchema>;

interface AddTopicDialogProps {
  programUuid: string;
  reqIndex?: number; // optional for creating new
  trigger?: React.ReactNode;
  onSubmit: (data: TopicFormValues) => void;
  initialData?: Partial<TopicFormValues>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  submitButtonText?: { add: string; edit: string };
  topicName?:string;
}

export default function AddTopicDialog({
  trigger,
  onSubmit,
  initialData,
  open,
  onOpenChange,
  submitButtonText,
  topicName,
}: AddTopicDialogProps) {
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: { title: "", subtitle: "", ...initialData },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, reset, clearErrors } = form;

  useEffect(() => {
    if (open) {
      reset({
        title: initialData?.title || "",
        subtitle: initialData?.subtitle || "",
      });
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const onSubmitForm = async (data: TopicFormValues) => {
    try {
      await onSubmit?.(data);
      onOpenChange?.(false);
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save: ${message || err}`);
    }
  };

  const handleFieldChange =
    (
      fieldName: keyof TopicFormValues,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void
    ) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      clearErrors(fieldName);
      onChange(event);
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

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
        <DialogHeader>
          <DialogTitle>
  {initialData
    ? `Edit ${topicName || "Item"}`
    : `Add ${topicName || "Item"}`}
</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="space-y-4"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (e.target as HTMLElement).tagName !== "TEXTAREA"
              ) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          >
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
                  className="bg-red-500 hover:bg-red-400 hover:text-white text-white cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer">
                {initialData
                  ? submitButtonText?.edit || "Save Changes"
                  : submitButtonText?.add || `Add ${topicName || "Item"}`}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
