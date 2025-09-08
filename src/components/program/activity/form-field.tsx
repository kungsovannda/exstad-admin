"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";

// --- Schema ---
const formSchema = z.object({
  title: z.string().min(1, "Activity title is required"),
  subtitle: z.string().min(1, "Activity title is required"),
  description: z.string().min(1, "Activity title is required"),
  images: z.array(z.any()).min(1, "Activity title is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<FormValues> & { imageUrl?: string };
}

export default function ActivityModal({
  open,
  onOpenChange,
  initialData,
}: ActivityModalProps) {
  const [previewsImage, setPreviewsImage] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      description: "",
      images: [],
    },
  });
  // If there's an existing image URL, show it in previews on open
  useEffect(() => {
    if (initialData?.imageUrl) {
      setPreviewsImage([initialData.imageUrl]);
    }
  }, [initialData?.imageUrl]);

  async function onSubmit(values: FormValues) {
    try {
      if (initialData) {
        console.log("Updating activity:", values);
        toast.success(`Activity "${values.title}" updated successfully!`);
      } else {
        console.log("Creating activity:", values);
        toast.success(`Activity "${values.title}" created successfully!`);
      }
      onOpenChange(false);
      form.reset();
      setPreviewsImage([]);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-fit ${
    initialData ? "max-w-sm" : "sm:max-w-3xl md:max-w-4xl"
  }`}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Activity" : "Add New Activity"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Activity Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtitle */}
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Title</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Sub Title"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Full Description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
  control={form.control}
  name="images"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Upload Image</FormLabel>
      <FormControl>
        <Input
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            field.onChange(files);

            const filePreviews = files.map((file) =>
              URL.createObjectURL(file)
            );
            setPreviewsImage(filePreviews);
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
{/* Show existing image */}
{initialData?.imageUrl && previewsImage.length === 0 && (
  <img
    src={initialData.imageUrl}
    alt="Current image"
    className="w-24 h-24 object-cover rounded border"
  />
)}

{/* Show new previews */}
{previewsImage.length > 0 && (
  <div className="flex gap-2 mt-2 flex-wrap">
    {previewsImage.map((src, idx) => (
      <img
        key={idx}
        src={src} // URL.createObjectURL(file)
        alt={`Preview ${idx + 1}`}
        className="w-24 h-24 object-cover rounded border"
      />
    ))}
  </div>
)}




            {/* Actions */}
            <div className="flex justify-end mt-4">
              <Button type="submit" className="bg-primary text-white">
                {initialData ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
