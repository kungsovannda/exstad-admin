"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SerializedEditorState } from "lexical";
import { initialValue } from "@/app/editor-00/page";

// -----------------
// Validation schema
// -----------------
const timelineSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
});

export type TimelineFormValues = z.infer<typeof timelineSchema>;

interface TimelineFormModalProps {
  trigger?: React.ReactNode;
  initialData?: Partial<TimelineFormValues>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmitTimeline: (data: TimelineFormValues) => Promise<void> | void;
}

export default function TimelineFormModal({
  trigger,
  onSubmitTimeline,
  initialData,
  open,
  onOpenChange,
}: TimelineFormModalProps) {
  if (typeof open === "undefined" || typeof onOpenChange !== "function") {
    throw new Error(
      "TimelineFormModal must be used as a controlled component. Pass `open` and `onOpenChange`."
    );
  }

  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);

  // -----------------
  // UseForm with onChange validation
  // -----------------
  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineSchema),
    defaultValues: initialData || { title: "", startDate: "", endDate: "" },
    mode: "onSubmit", // <-- validate while typing/selecting
    reValidateMode: "onSubmit",
  });

  const {
    handleSubmit,
    reset,
    clearErrors,
    trigger: validateForm,
    control,
  } = form;

useEffect(() => {
  if (!open) return; // only reset when modal opens
  reset({
    title: initialData?.title || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
  });
  clearErrors();
}, [open]); 


  // -----------------
  // Submit handler
  // -----------------
  const onSubmitForm = async (data: TimelineFormValues) => {
    try {
      await onSubmitTimeline?.(data);
      toast.success(
        initialData
          ? `Timeline "${data.title}" updated!`
          : `Timeline "${data.title}" saved!`
      );
      onOpenChange(false);
      reset();
      setEditorState(initialValue);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit the timeline: ${message || err}`);
    }
  };

  // -----------------
  // Field change helpers
  // -----------------
  const handleFieldChange =
    (
      fieldName: keyof TimelineFormValues,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    ) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      clearErrors(fieldName);
      onChange(event);
    };

  const handleDateChange =
    (fieldName: keyof TimelineFormValues, onChange: (value: string) => void) =>
    (date: Date | undefined) => {
      clearErrors(fieldName);
      onChange(date?.toISOString().split("T")[0] || "");
    };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

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
          <DialogTitle>{initialData ? "Edit Timeline" : "Add Timeline"}</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {/* Title */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter timeline title..."
                      onChange={handleFieldChange("title", field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between text-left">
                        <span>
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "Select start date"}
                        </span>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={handleDateChange("startDate", field.onChange)}
                        captionLayout="dropdown"
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between text-left">
                        <span>
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "Select end date"}
                        </span>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={handleDateChange("endDate", field.onChange)}
                        captionLayout="dropdown"
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
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
              <Button className="cursor-pointer" type="submit">{initialData ? "Save Changes" : "Add Timeline"}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
