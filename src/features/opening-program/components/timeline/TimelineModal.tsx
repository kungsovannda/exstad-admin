"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
// -----------------
// Validation schema
// -----------------
const timelineSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z
    .date()
    .min(1, "Start Date is required")
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for comparison
        return date >= today;
      },
      {
        message: "Deadline must be today or a future date",
      }
    ),
  endDate: z
    .date()
    .min(1, "End Date is required")
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for comparison
        return date >= today;
      },
      {
        message: "Deadline must be today or a future date",
      }
    ),
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

  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineSchema),
    defaultValues: initialData || {
      title: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const { handleSubmit, reset, clearErrors, control } = form;
  const [openDate, setOpenDate] = useState(false); // ✅ control popover visibility

  useEffect(() => {
    if (!open) return;
    reset({
      title: initialData?.title || "",
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || new Date(),
    });
    clearErrors();
  }, [open]);

  // 🔹 Control popover visibility
  const [openPopover, setOpenPopover] = useState<{
    startDate: boolean;
    endDate: boolean;
  }>({ startDate: false, endDate: false });

  // 🔹 Submit handler
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit the timeline: ${message || err}`);
    }
  };

  // 🔹 Date change handler (closes popover after select)
  const handleDateChange =
    (fieldName: keyof TimelineFormValues, onChange: (value: string) => void) =>
    (date: Date | undefined) => {
      if (!date) return;
      const formatted = date.toISOString().split("T")[0];
      onChange(formatted);
      clearErrors(fieldName);

      // ✅ Auto-close popover
      setOpenPopover((prev) => ({ ...prev, [fieldName]: false }));
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
            (v) => !v || v === "" || v === undefined
          );
          if (hasEmpty) {
            form.trigger();
            toast.error("Please fill all required fields before leaving.");
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Timeline" : "Add Timeline"}
          </DialogTitle>
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
                      onChange={(e) => {
                        clearErrors("title");
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown"
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown"
                        onSelect={field.onChange}
                        initialFocus
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
              <Button className="cursor-pointer" type="submit">
                {initialData ? "Save Changes" : "Add Timeline"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
