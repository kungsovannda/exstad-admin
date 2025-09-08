'use client';

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";
// 1️⃣ Validation
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
  const { control, handleSubmit, register, reset } = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      title: initialData?.title || "",
      date: initialData?.date,
    },
  });

  const onSubmit = (data: TimelineFormValues) => {
    console.log("Form Data:", data);
    toast.success(`Timeline "${data.title}" saved!`);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* Optional: a hidden trigger if you want to control externally */}
        <span />
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Timeline</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Title</label>
            <input
              {...register("title")}
              type="text"
              placeholder="Enter title"
              className="border rounded-md p-2"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Date</label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left"
                    >
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
          </div>

          <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="bg-red-500 hover:bg-red-400 hover:text-white text-white ">Cancel</Button>
              </DialogClose>
            <Button type="submit" className="bg-primary text-white w-fit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
