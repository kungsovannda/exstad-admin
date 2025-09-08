"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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

const topicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Title is required"),
});
type TopicFormValues = z.infer<typeof topicSchema>;

interface AddTopicDialogProps {
  trigger?: React.ReactNode;
  onSubmit: (data: { title: string; subtitle?: string }) => void;
  initialData?: Partial<TopicFormValues>;
  // optional controlled props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddTopicDialog({
  trigger,
  onSubmit,
  initialData,
  open,
  onOpenChange,
}: AddTopicDialogProps) {
  const isControlled = typeof open !== "undefined" && typeof onOpenChange === "function";
  const [localOpen, setLocalOpen] = useState(false);

  const dialogOpen = isControlled ? open! : localOpen;
  const setDialogOpen = (val: boolean) => {
    if (isControlled) onOpenChange!(val);
    else setLocalOpen(val);
  };

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      ...initialData,
    },
  });

  useEffect(() => {
    // reset form when opening or when initialData changes
    form.reset({
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
    });
  }, [initialData, dialogOpen]); // eslint-disable-line

  const handleSubmit = (values: TopicFormValues) => {
    try {
      onSubmit(values);
      toast.success(initialData ? "Topic updated!" : "Topic added!");
      setDialogOpen(false);
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit topic");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Topic" : "Add Topic"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter topic title..." />
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
                    <Input {...field} placeholder="Enter topic subtitle..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{initialData ? "Save Changes" : "Add Topic"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
