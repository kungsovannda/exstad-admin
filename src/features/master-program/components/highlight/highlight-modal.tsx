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
const highlightSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  desc: z.string().min(1, "Description is required"),
});

export type HighlightFormValues = z.infer<typeof highlightSchema>;

interface HighlightsFormModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: HighlightFormValues;
  onSubmitHighlight?: (data: HighlightFormValues) => Promise<void> | void;
}

export default function HighlightsFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmitHighlight,
  trigger,
}: HighlightsFormModalProps) {
  const form = useForm<HighlightFormValues>({
    resolver: zodResolver(highlightSchema),
    defaultValues: initialData || { label: "", value: "", desc: "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, reset, clearErrors } = form;

  useEffect(() => {
    if (open) {
      reset(initialData || { label: "", value: "", desc: "" });
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const onSubmit = async (data: HighlightFormValues) => {
    try {
      await onSubmitHighlight?.(data);
      toast.success(
        initialData
          ? `Highlight "${data.label}" updated!`
          : `Highlight "${data.label}" created!`
      );
      onOpenChange?.(false);
      reset();
    } catch (err : unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save: ${message || err}`);
    }
  };

  const handleFieldChange =
    (
      fieldName: keyof HighlightFormValues,
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
            {initialData ? "Edit Highlight" : "Add Highlight"}
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
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter label"
                      {...field}
                      onChange={handleFieldChange("label", field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter value"
                      {...field}
                      onChange={handleFieldChange("value", field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      {...field}
                      onChange={handleFieldChange("desc", field.onChange)}
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
                {initialData ? "Update Highlight" : "Save Highlight"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
