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
}

export default function AddTopicDialog({
  programUuid,
  reqIndex,
  trigger,
  onSubmit,
  initialData,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddTopicDialogProps) {
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: { title: "", subtitle: "", ...initialData },
  });

  const { handleSubmit, reset, clearErrors } = form;

  useEffect(() => {
    if (controlledOpen) {
      reset({ title: initialData?.title || "", subtitle: initialData?.subtitle || "" });
      clearErrors();
    }
  }, [controlledOpen, initialData, reset, clearErrors]);

  const onSubmitForm = (data: TopicFormValues) => {
    onSubmit(data);
    // toast.success(initialData ? "Requirement updated!" : "Requirement added!");
    controlledOnOpenChange?.(false);
    reset();
  };

  return (
    <Dialog open={controlledOpen} onOpenChange={controlledOnOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Requirement" : "Add Requirement"}</DialogTitle>
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
                    <Input {...field} placeholder="Enter requirement title..." />
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
                    <Input {...field} placeholder="Enter subtitle..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{initialData ? "Save Changes" : "Add Requirement"}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
