'use client';

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";

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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<HighlightFormValues>({
    resolver: zodResolver(highlightSchema),
    defaultValues: initialData || { label: "", value: "", desc: "" },
  });

  // Reset form only when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      reset(initialData || { label: "", value: "", desc: "" });
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: HighlightFormValues) => {
    console.log("Submitted Highlight:", data);
    toast.success(`Highlight "${data.label}" saved!`);
    onSubmitHighlight?.(data);
    onOpenChange?.(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button>{initialData ? "Edit Highlight" : "Add Highlight"}</Button>}
      </DialogTrigger>

      <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Highlight" : "Add Highlight"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Label */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Label</label>
            <input {...register("label")} type="text" placeholder="Enter label" className={`border rounded-md p-2 ${errors.label ? "border-red-500" : ""}`} />
            {errors.label && <span className="text-red-500 text-sm mt-1">{errors.label.message}</span>}
          </div>

          {/* Value */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Value</label>
            <input {...register("value")} type="text" placeholder="Enter value" className={`border rounded-md p-2 ${errors.value ? "border-red-500" : ""}`} />
            {errors.value && <span className="text-red-500 text-sm mt-1">{errors.value.message}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Description</label>
            <textarea {...register("desc")} placeholder="Enter description" className={`border rounded-md p-2 resize-none ${errors.desc ? "border-red-500" : ""}`} />
            {errors.desc && <span className="text-red-500 text-sm mt-1">{errors.desc.message}</span>}
          </div>

         <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="bg-red-500 hover:bg-red-400 hover:text-white text-white ">Cancel</Button>
              </DialogClose>
            <Button type="submit" className="bg-primary text-white w-fit">
              Save Highlight
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
