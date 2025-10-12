"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ColorPicker from "react-best-gradient-color-picker";
import Image from "next/image";
import { generateSlug } from "@/services/generate-slug";

export const programFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  programType: z.enum(["SHORT_COURSE", "SCHOLARSHIP"]),
  programLevel: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  thumbnailUrl: z.string().min(1, { message: "Thumbnail is required" }),
  posterUrl: z.string().min(1, { message: "Poster is required" }),
  bgColor: z.string().min(1, { message: "Theme color is required" }),
  slug: z.string(),
});

export type MasterProgramFormValues = z.infer<typeof programFormSchema>;

type Props = {
  initialValues?: MasterProgramFormValues;
  onSubmit: (data: MasterProgramFormValues) => void;
  submitLabel?: string;
  onSlugEdited?: () => void; 

};

export default function MasterProgramForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  onSlugEdited,
}: Props) {
  const form = useForm<MasterProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      title: "",
      programType: "SHORT_COURSE",
      programLevel: "BASIC",
      visibility: "PUBLIC",
      subtitle: "",
      description: "",
      thumbnailUrl: "",
      posterUrl: "",
      bgColor: "linear-gradient(90deg, rgba(96,165,250,1) 0%, rgba(168,85,247,1) 100%)",
      slug: "",
    },
  });

  const [previewsThumbnail, setPreviewsThumbnail] = useState<string[]>([]);
  const [previewsPoster, setPreviewsPoster] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(form.getValues("bgColor"));
  const [bgColor, setbgColor] = useState(form.getValues("bgColor"));
  const [showDialog, setShowDialog] = useState(false);

  // ✅ Reset when editing existing data
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
      if (initialValues.thumbnailUrl) setPreviewsThumbnail([initialValues.thumbnailUrl]);
      if (initialValues.posterUrl) setPreviewsPoster([initialValues.posterUrl]);
      if (initialValues.bgColor) {
        setInputValue(initialValues.bgColor);
        setbgColor(initialValues.bgColor);
      }
    }
  }, [initialValues, form]);

  // ✅ Auto-generate slug when title changes (only if slug not manually changed)
  const [isSlugEdited, setIsSlugEdited] = useState(false);
useEffect(() => {
  const subscription = form.watch((values, { name }) => {
    if (name === "title" && values.title && !isSlugEdited) {
      form.setValue("slug", generateSlug(values.title), { shouldDirty: true });
    }
  });
  return () => subscription.unsubscribe();
}, [form, isSlugEdited]);
  const handleChooseColor = () => {
    setInputValue(bgColor);
    form.setValue("bgColor", bgColor);
    setShowDialog(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter your program title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
  control={form.control}
  name="slug"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Slug</FormLabel>
      <FormControl>
        <Input
          placeholder={generateSlug(form.watch("title") || "")}
          {...field}
          onChange={(e) => {
            field.onChange(e);        
            setIsSlugEdited(true);
            if (onSlugEdited) onSlugEdited();
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

        {/* Program Type */}
        <FormField
          control={form.control}
          name="programType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHORT_COURSE">SHORT_COURSE</SelectItem>
                    <SelectItem value="SCHOLARSHIP">SCHOLARSHIP</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color Picker */}
        <div>
          <Label className="text-sm font-semibold mb-2">Theme Color</Label>
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex gap-2 items-start">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={2}
                className="font-mono text-sm resize-none"
              />
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button>Select</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Choose Color</DialogTitle>
                    <DialogDescription>Pick your desired color or gradient</DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    <ColorPicker width={460} value={bgColor} onChange={setbgColor} />
                    <Label>Preview</Label>
                    <div className="w-full h-16 rounded-md border shadow-sm" style={{ background: bgColor }} />
                  </div>
                  <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                    <Button onClick={handleChooseColor}>Choose</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {inputValue && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="w-full h-14 rounded-md border shadow-sm" style={{ background: inputValue }} />
              </div>
            )}
          </div>
        </div>

        {/* Program Level & Visibility */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="programLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Level</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASIC">BASIC</SelectItem>
                      <SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem>
                      <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                      <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Subtitle & Description */}
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter subtitle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

        {/* Thumbnail */}
        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      field.onChange(url);
                      setPreviewsThumbnail([url]);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {previewsThumbnail.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previewsThumbnail.map((src, idx) => (
              <Image key={idx} src={src} width={100} height={100} alt="Thumbnail" className="w-24 h-24 object-cover rounded border" />
            ))}
          </div>
        )}

        {/* Poster */}
        <FormField
          control={form.control}
          name="posterUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      field.onChange(url);
                      setPreviewsPoster([url]);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {previewsPoster.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previewsPoster.map((src, idx) => (
              <Image key={idx} src={src} width={100} height={100} alt="Poster" className="w-24 h-24 object-cover rounded border" />
            ))}
          </div>
        )}

        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
