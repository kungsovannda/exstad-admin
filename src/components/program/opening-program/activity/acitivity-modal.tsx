"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
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
import { Editor } from "@/components/blocks/editor-00/editor";
import Image from "next/image";

// ---------------------------
// Zod Schema
// ---------------------------
const formSchema = z.object({
  title: z.string().min(1, "Activity title is required"),
  description: z.string().min(1, "Activity description is required"),
  image:z.string(),
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
  onSubmitActivity?: (data:ActivityFormValues) => Promise<void> | void;
}

// ---------------------------
// Component
// ---------------------------
export default function ActivityformModal({
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
    reValidateMode:"onSubmit",
    defaultValues: initialData || {
      title: "",
      description: "",
      image: "",
    },

  });

  // renamed trigger -> validateForm to avoid identifier conflicts
  const {reset,handleSubmit, setValue, trigger: validateForm, getValues, clearErrors, formState,} = form;

  // Preload image preview and description if editing
  useEffect(() => {
    if (initialData?.imageUrl) setPreviewsImage([initialData.imageUrl]);
    else setPreviewsImage([]);

    reset(
      initialData || { title: "", description: "", image: "" }
    );

    // Safely parse description
    if (initialData?.description) {
      try {
        const parsed = JSON.parse(initialData.description);
        setEditorState(parsed);
      } 
        catch (err : unknown) {
              const message = err instanceof Error ? err.message : String(err);
              toast.error(`Failed to save: ${message || err}`);
        // If parsing fails, create a simple editor state with plain text
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
      onOpenChange?.(false);
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit the activity: ${message || err}`);
    }
  };

  // ---------------------------
  // Handle file input changes
  // ---------------------------
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files ?? []);
  //   setValue("image", files, { shouldValidate: true });
  //   const filePreviews = files.map((file) => URL.createObjectURL(file));
  //   setPreviewsImage(filePreviews);
  // };

    // const handleFieldChange =
    //   (
    //     fieldName: keyof ActivityFormValues,
    //     onChange: (
    //       event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    //     ) => void
    //   ) =>
    //   (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     clearErrors(fieldName);
    //     onChange(event);
    //   };

  // ---------------------------
  // Close handler (Cancel & X should use this)
  // ---------------------------
  const handleClose = () => {
    onOpenChange(false);
    reset();
    setEditorState(initialValue);
    setPreviewsImage([]);
    clearErrors();
  };

  // ---------------------------
  // Outside-click validator
  // only runs when clicking outside (blocks closing if invalid)
  // ---------------------------
  const handleOutsideClick = (event?: Event) => {
    // prevent default closing by Radix/your Dialog component
    event?.preventDefault?.();

    const values = getValues();
    const hasEmpty = Object.values(values).some(
      (v) =>
        v === "" ||
        v === undefined ||
        v === null ||
        (Array.isArray(v) && v.length === 0)
    );

    if (hasEmpty || !formState.isValid) {
      validateForm(); // show validation messages
      toast.error("Please fill all required fields before leaving the modal.");
      // don't close
    } else {
      // manually close (since we prevented default close above)
      onOpenChange(false);
      reset();
      setEditorState(initialValue);
      setPreviewsImage([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        onInteractOutside={handleOutsideClick} // ONLY outside click triggers validation
        // Notice: no onEscapeKeyDown here — Escape will close normally (like Cancel/X)
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
              <Editor
                editorSerializedState={editorState}
                onSerializedChange={(value) => {
                  setEditorState(value);
                  setValue("description", JSON.stringify(value), {
                    shouldValidate: true,
                  });
                }}
              />
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Upload Images</FormLabel>
                  <FormControl>
                    <Input type="file" multiple 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) {
                        const url = URL.createObjectURL(file);
                        field.onChange(url);
                        setPreviewsImage([url]);
                      }
                    }} />
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
              {/* Cancel — closes immediately */}
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="bg-red-500 hover:bg-red-400 hover:text-white text-white"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </DialogClose>

              {/* Submit */}
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
