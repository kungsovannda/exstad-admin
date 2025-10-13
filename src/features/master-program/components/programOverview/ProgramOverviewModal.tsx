"use client";

import React, { useEffect } from "react";
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
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// -----------------
// Validation schema
// -----------------
const programOverviewSchema = z.object({
title: z.string().min(1, "Title is required"),
description: z.string().min(1, "Description is required"),
});

export type ProgramOverviewFormValue = z.infer<typeof programOverviewSchema>;

interface ProgramOverviewFormModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: ProgramOverviewFormValue;
  onSubmitProgramOverview?: (data: ProgramOverviewFormValue) => Promise<void> | void;
}

export default function ProgramOverviewFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmitProgramOverview,
  trigger,
}: ProgramOverviewFormModalProps) {
  const form = useForm<ProgramOverviewFormValue>({
    resolver: zodResolver(programOverviewSchema),
    defaultValues: initialData || { title: "", description: "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, reset, clearErrors } = form;

  useEffect(() => {
    if (open) {
      reset(initialData || { title: "", description: "" });
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const onSubmit = async (data: ProgramOverviewFormValue) => {
    try {
      await  onSubmitProgramOverview?.(data);
      toast.success(
        initialData
          ? `Program Overview "${data.title}" updated!`
          : `Program Overview "${data.title}" created!`
      );
      onOpenChange?.(false);
      reset();
    }catch (err : unknown) {
          const message = err instanceof Error ? err.message : String(err);
          toast.error(`Failed to save: ${message || err}`);

    }
  };

  const handleFieldChange =
    (
      fieldName: keyof ProgramOverviewFormValue,
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
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger> }

      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        onInteractOutside={(event) => {
          event.preventDefault();
          const values = form.getValues();
          const hasEmpty = Object.values(values).some(
            (v) => v === "" || v === undefined || v === null
          );

          if (hasEmpty) {
            form.trigger();
            toast.error("Please fill all required fields before leaving.");
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Program Overview" : "Add Program Overview"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
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
            {/* Label */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Title"
                      {...field}
                      onChange={handleFieldChange("title", field.onChange)}
                    />
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
                    <Textarea
                      placeholder="Enter description"
                      {...field}
                      onChange={handleFieldChange("description", field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="bg-red-500 hover:bg-red-400 hover:text-white text-white cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary text-white w-fit cursor-pointer">
                {initialData ? "Update Program Overview" : "Save Program Overview"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
