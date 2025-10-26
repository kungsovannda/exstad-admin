"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import {
  ActivityUploadField,
  ActivityFormWithFile,
} from "@/features/opening-program/components/activity/ActivityUploadFile";
import { TechnologyFormWithFile, TechnologyUploadField } from "./TechnologyUploadFile";

// ----------------- Validation schema -----------------
const formSchema = z.object({
  title: z.string().min(1, "Technology title is required"),
  description: z.string().min(1, "Technology description is required"),
  image: z.string().min(1, "Technology image is required"),
});

export type TechnologyFormValues = z.infer<typeof formSchema>;

// ----------------- Props -----------------
interface TechnologyFormModalProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<TechnologyFormValues> & { imageUrl?: string };
  trigger?: React.ReactNode;
  onSubmitTechnology?: (
    data: TechnologyFormValues,
    file?: File
  ) => Promise<void> | void;
  masterProgram: { uuid: string; slug: string };
  openingProgram: { uuid: string; generation: number };
}

// ----------------- Component -----------------
export default function TechnologyFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmitTechnology,
  trigger,
  masterProgram,
  openingProgram,
}: TechnologyFormModalProps) {
  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: initialData || { title: "", description: "", image: "" },
  });

  const { reset, handleSubmit, clearErrors } = form;

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ title: "", description: "", image: "" });
    }
  }, [initialData, reset]);

  // ----------------- Submit handler -----------------
  const onSubmit = async (data: TechnologyFormValues) => {
    try {
      const file = (form as TechnologyFormWithFile)._technologyFile;
      await onSubmitTechnology?.(data, file);
      toast.success(
        initialData
          ? `Technology "${data.title}" updated successfully!`
          : `Technology "${data.title}" created successfully!`
      );
      handleClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit the technology: ${message}`);
    }
  };

  // ----------------- Close handler -----------------
  const handleClose = () => {
    onOpenChange(false);
    (form as TechnologyFormWithFile)._technologyFile = undefined;
    reset();
    clearErrors();
  };

  // ----------------- Render -----------------
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="w-full max-w-3xl"
        onInteractOutside={(event) => {
          event.preventDefault(); // prevent closing by clicking outside
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Technology" : "Add New Technology"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technology Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Technology Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Image *</FormLabel>
                  <FormControl>
                    <TechnologyUploadField
                      form={form}
                      masterProgram={{
                        slug: masterProgram.slug,
                        uuid: masterProgram.uuid,
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end mt-4 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary text-white">
                {initialData ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
