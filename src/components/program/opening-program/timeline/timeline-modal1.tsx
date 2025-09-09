'use client';

import React from "react";
import { useForm,FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";

// 1️⃣ Validation schema
const timelineSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date(),
});

type TimelineFormValues = z.infer<typeof timelineSchema>;

// 2️⃣ Props for modal
interface SimpleTimelineFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: { title?: string; date?: Date };
}

export default function SimpleTimelineForm({ open, onOpenChange, initialData }: SimpleTimelineFormProps) {
  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      title: initialData?.title || "",
      date: initialData?.date || undefined,
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: TimelineFormValues) => {
    console.log("Form Data:", data);
    toast.success(`Timeline "${data.title}" saved!`);
    onOpenChange?.(false);
  };

 return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild><span /></DialogTrigger>
      <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Timeline</DialogTitle>
        </DialogHeader>

        {/* ✅ Wrap the form with FormProvider */}
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Timeline Title" {...field} />
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
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="bg-red-500 hover:bg-red-400 hover:text-white text-white">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary text-white w-fit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
