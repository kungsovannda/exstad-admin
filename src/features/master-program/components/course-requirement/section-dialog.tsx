"use client";

import React, { useEffect} from "react";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const sectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

interface AddSectionDialogProps {
  programUuid: string;
  reqIndex?: number;
  outcomeIndex?: number;
  curriculumIndex?:number;
  trigger?: React.ReactNode;
  onSubmit: (data: SectionFormValues) => void;
  initialData?: Partial<SectionFormValues>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddSectionDialog({
  trigger,
  onSubmit,
  initialData,
  open,
  onOpenChange,
}: AddSectionDialogProps) {
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { title: "", ...initialData },
  });

  const { handleSubmit, reset, clearErrors, } = form;

  useEffect(() => {
    if (open) {
      reset({ title: initialData?.title || "" });
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const onSubmitForm = async (data: SectionFormValues) => {
    try {
      await onSubmit?.(data);
      toast.success(
        initialData
          ? `Section "${data.title}" updated!`
          : `Section "${data.title}" created!`
      );
      onOpenChange?.(false);
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save: ${message || err}`);
    }
  };

  const handleFieldChange =
    (
      fieldName: keyof SectionFormValues,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearErrors(fieldName);
      onChange(e);
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        onInteractOutside={(event) => {
          event.preventDefault(); // prevent closing if invalid
          const values = form.getValues();
          const hasEmpty = Object.values(values).some(
            (v) => v === "" || v === undefined || v === null
          );
          if (hasEmpty) {
            form.trigger(); // trigger validation
            toast.error(
              "Please fill all required fields before leaving the modal."
            );
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Section" : "Add Section"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter section title..."
                      onChange={handleFieldChange("title", field.onChange)}
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
                  className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit">
                {initialData ? "Save Changes" : "Add Section"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
