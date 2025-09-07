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

const sectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

interface AddSectionDialogProps {
  trigger?: React.ReactNode;
  onSubmit: (data: SectionFormValues) => void;
  initialData?: Partial<SectionFormValues>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddSectionDialog({
  trigger,
  onSubmit,
  initialData,
  open,
  onOpenChange,
}: AddSectionDialogProps) {
  const isControlled = typeof open !== "undefined" && typeof onOpenChange === "function";
  const [localOpen, setLocalOpen] = useState(false);

  const dialogOpen = isControlled ? open! : localOpen;
  const setDialogOpen = (val: boolean) => {
    if (isControlled) onOpenChange!(val);
    else setLocalOpen(val);
  };

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      ...initialData,
    },
  });

  useEffect(() => {
    form.reset({
      title: initialData?.title || "",
    });
  }, [initialData, dialogOpen]); // reset when dialog opens or initialData changes

  const handleSubmit = (values: SectionFormValues) => {
    try {
      onSubmit(values);
      toast.success(initialData ? "Section updated!" : "Section added!");
      setDialogOpen(false);
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit section");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Section" : "Add Section"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter section title..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{initialData ? "Save Changes" : "Add Section"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
