"use client";

import React, { useEffect} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
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
import { toast } from "sonner";

// -----------------
// Validation schema
// -----------------
const topicSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type TopicFormValues = z.infer<typeof topicSchema>;

type AddTopicFaqProps = {
  programUuid:string;
  initialData?:Partial<TopicFormValues>;
  faqIndex?:number;
  onSubmit: (data: TopicFormValues) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddTopicFaq({
  onSubmit,
  trigger,
  open,
  onOpenChange,
  initialData,
}: AddTopicFaqProps) {
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: { title:  "", ...initialData },
    mode:"onSubmit",
    reValidateMode:"onSubmit",
  });
  const { handleSubmit, reset, clearErrors, getValues, trigger: triggerValidation } = form;

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      reset({ title: initialData?.title || ""});
      clearErrors();
    }
  }, [initialData, open, reset, clearErrors]);

  const onSubmitForm = async (data: TopicFormValues) => {
    try {
      await onSubmit?.(data);
      toast.success(
        initialData
          ? `Topic "${data.title}" updated successfully!`
          : `Topic "${data.title}" added successfully!`
      );
      onOpenChange?.(false);
      reset();
    } catch (err :unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit topic: ${message || err}`);
    }
  };

  const handleFieldChange = (fieldName: keyof TopicFormValues, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearErrors(fieldName);
      onChange(e);
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        onInteractOutside={(event) => {
          event.preventDefault();
          const values = getValues();
          if (values.title.trim() === "") {
            triggerValidation("title");
            toast.error("Please fill the topic title before leaving the modal.");
          }
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          const values = getValues();
          if (values.title.trim() === "") {
            triggerValidation("title");
            toast.error("Please fill the topic title before leaving the modal.");
          }
        }}
      >
        <DialogHeader className="mb-6">
          <DialogTitle>{initialData ? "Edit Topic" : "Add Topic"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4"
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter topic title..."
                      onChange={handleFieldChange("title", field.onChange)}
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
              <Button className="cursor-pointer" type="submit">{initialData ? "Save Changes" : "Add Topic"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
