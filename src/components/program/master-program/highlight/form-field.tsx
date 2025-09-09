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

type HighlightFormValues = z.infer<typeof highlightSchema>;

interface HighlightsFormModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: HighlightFormValues;
  onSubmitHighlight?: (data: HighlightFormValues) => void;
  trigger?: React.ReactNode;
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

  // Reset form only when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      reset(initialData || { label: "", value: "", desc: "" });
      // Clear any existing errors when modal opens
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const onSubmit = (data: HighlightFormValues) => {
    console.log("Submitted Highlight:", data);
    toast.success(`Highlight "${data.label}" saved!`);
    onSubmitHighlight?.(data);
    onOpenChange?.(false);
    reset();
  };

  // Function to handle field changes and clear errors
  const handleFieldChange =
    (
      fieldName: keyof HighlightFormValues,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void
    ) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Clear the error for this specific field when user starts typing
      clearErrors(fieldName);
      onChange(event);
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>{initialData ? "Edit Highlight" : "Add Highlight"}</Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        onInteractOutside={(event) => {
          // Prevent Radix from closing automatically
          event.preventDefault();

          // Check if there are any empty required fields
          const values = form.getValues();
          const hasEmpty = Object.values(values).some(
            (v) => v === "" || v === undefined || v === null
          );

          if (hasEmpty) {
            form.trigger(); // show validation messages
            toast.error(
              "Please fill all required fields before leaving the modal."
            );
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
              // Press Enter to submit only if focused element is NOT a Textarea
              if (
                e.key === "Enter" &&
                (e.target as HTMLElement).tagName !== "TEXTAREA"
              ) {
                e.preventDefault(); // prevent default behavior
                handleSubmit(onSubmit)(); // manually trigger submit
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
                <Button
                  variant="outline"
                  className="bg-red-500 hover:bg-red-400 hover:text-white text-white"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary text-white w-fit">
                Save Highlight
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
