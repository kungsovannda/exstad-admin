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

// Zod schema for validation
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
  const isControlled = typeof controlledOpen === "boolean" && typeof onOpenChange === "function";
  const open = isControlled ? controlledOpen : localOpen;
  const setOpen = isControlled ? onOpenChange! : setLocalOpen;

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: { title: initialTitle },
  });

  // Reset form when dialog opens or initialTitle changes
  useEffect(() => {
    form.reset({ title: initialTitle });
  }, [initialTitle, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values: TopicFormValues) => {
    try {
      onSubmit(values.title);
      toast.success(initialTitle ? `Topic "${values.title}" updated successfully!` : `Topic "${values.title}" added successfully!`);
      setOpen(false);
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit topic. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl">
        <DialogHeader className="mb-6">
          <DialogTitle>{initialTitle ? "Edit Topic" : "Add Topic"}</DialogTitle>
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

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="bg-red-500 hover:bg-red-400 hover:text-white text-white ">Cancel</Button>
              </DialogClose>
              <Button type="submit">{initialTitle ? "Save Changes" : "Add Topic"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
