"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";

import { SerializedEditorState } from "lexical";
// import { Editor } from "@/components/blocks/editor-00/editor";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

// ---------------------------
// Zod Schema
// ---------------------------
const formSchema = z.object({
  title: z.string().min(1, "Activity title is required"),
  description: z.string().min(1, "Activity description is required"),
  image: z.string(),
});

export type ActivityFormValues = z.infer<typeof formSchema>;

// ---------------------------
// Initial Editor Value
// ---------------------------
const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

// ---------------------------
// Props
// ---------------------------
interface ActivityFormModalProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ActivityFormValues> & { imageUrl?: string };
  trigger?: React.ReactNode;
  onSubmitActivity?: (data: ActivityFormValues) => Promise<void> | void;
}

// ---------------------------
// Component
// ---------------------------
export default function ActivityFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmitActivity,
  trigger,
}: ActivityFormModalProps) {
  const [previewsImage, setPreviewsImage] = useState<string[]>([]);
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: initialData || {
      title: "",
      description: "",
      image: "",
    },
  });

  const { reset, handleSubmit, clearErrors } = form;

  // Preload image & editor if editing
  useEffect(() => {
    if (initialData?.imageUrl) setPreviewsImage([initialData.imageUrl]);
    else setPreviewsImage([]);

    reset(initialData || { title: "", description: "", image: "" });

    if (initialData?.description) {
      try {
        const parsed = JSON.parse(initialData.description);
        setEditorState(parsed);
      } catch {
        setEditorState({
          root: {
            children: [
              {
                children: [
                  {
                    text: initialData.description,
                    type: "text",
                    detail: 0,
                    format: 0,
                    style: "",
                    mode: "normal",
                    version: 1,
                  },
                ],
                type: "paragraph",
                direction: "ltr",
                indent: 0,
                format: "",
                version: 1,
              },
            ],
            type: "root",
            direction: "ltr",
            indent: 0,
            format: "",
            version: 1,
          },
        } as unknown as SerializedEditorState);
      }
    } else {
      setEditorState(initialValue);
    }
  }, [initialData, reset]);

  // ---------------------------
  // Submit handler
  // ---------------------------
  const onSubmit = async (data: ActivityFormValues) => {
    try {
      await onSubmitActivity?.(data);
      toast.success(
        initialData
          ? `Activity "${data.title}" updated successfully!`
          : `Activity "${data.title}" created successfully!`
      );
      handleClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit the activity: ${message || err}`);
    }
  };

  // ---------------------------
  // Close handler
  // ---------------------------
  const handleClose = () => {
    onOpenChange(false);
    reset();
    setEditorState(initialValue);
    setPreviewsImage([]);
    clearErrors();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        // 👇 Prevent closing via outside click or Escape key entirely
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Activity" : "Add New Activity"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
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

            {/* Description / Editor */}
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <Editor
                editorSerializedState={editorState}
                onSerializedChange={(value) => {
                  setEditorState(value);
                  setValue("description", JSON.stringify(value), { shouldValidate: true });
                }}
              /> */}
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          field.onChange(url);
                          setPreviewsImage([url]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Previews */}
            {previewsImage.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previewsImage.map((src, idx) => (
                  <Image
                    unoptimized
                    width={500}
                    height={500}
                    key={idx}
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end mt-4 gap-2">
              <DialogClose asChild>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary text-white cursor-pointer"
              >
                {initialData ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
