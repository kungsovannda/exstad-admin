"use client";

import React, { useEffect } from "react";
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

// -----------------
// Validation schema
// -----------------
const timelineSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z
    .date()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Date is required",
    }),
});

type TimelineFormValues = z.infer<typeof timelineSchema>;

interface SimpleTimelineFormProps {
  trigger?: React.ReactNode;
  onSubmit: (data: TimelineFormValues) => void;
  initialData?: Partial<TimelineFormValues>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SimpleTimelineForm({
  trigger,
  onSubmit,
  initialData,
  open,
  onOpenChange,
}: SimpleTimelineFormProps) {
  if (typeof open === "undefined" || typeof onOpenChange !== "function") {
    throw new Error(
      "SimpleTimelineForm must be used as a controlled component. Pass `open` and `onOpenChange`."
    );
  }

  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      title: "",
      date: undefined,
      ...initialData,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, reset, clearErrors, getValues, trigger: triggerValidation, control } = form;

  useEffect(() => {
    if (open) {
      reset({
        title: initialData?.title || "",
        date: initialData?.date || undefined,
      });
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const onSubmitForm = (data: TimelineFormValues) => {
    onSubmit(data);
    toast.success(initialData ? `Timeline "${data.title}" updated!` : `Timeline "${data.title}" saved!`);
    onOpenChange(false);
    reset();
  };

  const handleFieldChange = (
    fieldName: keyof TimelineFormValues,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    clearErrors(fieldName);
    onChange(e);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
          onPointerDown={(e) => e.stopPropagation()} // ✅ Prevent drag when clicking inside modal
        onInteractOutside={(event) => {
          event.preventDefault();
          const values = getValues();
          if (!values.title || !values.date) {
            triggerValidation();
            toast.error("Please fill all required fields before leaving the modal.");
          }
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          const values = getValues();
          if (!values.title || !values.date) {
            triggerValidation();
            toast.error("Please fill all required fields before leaving the modal.");
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

            {/* Date */}
            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between text-left">
                        <span>{field.value ? format(field.value, "PPP") : "Select date"}</span>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
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
                <Button variant="outline" className="bg-red-500 hover:bg-red-400 hover:text-white text-white">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">{initialData ? "Save Changes" : "Add Timeline"}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
