"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorPicker from "react-best-gradient-color-picker";
import Image from "next/image";

export const programFormSchema = z.object({
  title: z.string().min(1),
  programType: z.enum(["SHORT_COURSE", "SCHOLARSHIP"]),
  programLevel: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]),
  visibility: z.enum(["public", "private"]),
  price: z.string().min(1),
  scholarship: z.string().min(1),
  subtitle: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  posterUrl: z.string(),
  bgColor: z.string(),
});

export type MasterProgramFormValues = z.infer<typeof programFormSchema>;

type Props = {
  initialValues?: MasterProgramFormValues;
  onSubmit: (data: MasterProgramFormValues) => void;
  submitLabel?: string;
};

export default function MasterProgramForm({ initialValues, onSubmit, submitLabel = "Submit" }: Props) {
  const form = useForm<MasterProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: initialValues || {
      title: "",
      programType: "SHORT_COURSE",
      programLevel: "BASIC",
      visibility: "public",
      price: "0",
      scholarship: "0",
      subtitle: "",
      description: "",
      thumbnailUrl: "",
      posterUrl:"",
      bgColor: "linear-gradient(90deg, rgba(96,165,250,1) 0%, rgba(168,85,247,1) 100%)",
    },
  });

  const [previewsThumbnail, setPreviewsThumbnail] = useState<string[]>([]);
  const [previewsPoster, setPreviewsPoster] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(form.getValues("bgColor"));
  const [bgColor, setbgColor] = useState(form.getValues("bgColor"));
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (initialValues?.bgColor) {
      setbgColor(initialValues.bgColor);
      setInputValue(initialValues.bgColor);
    }
    if (initialValues?.thumbnailUrl) {
      setPreviewsThumbnail([initialValues.thumbnailUrl]);
    }
  }, [initialValues]);

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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your program title" {...field} />
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
          <Label htmlFor="color-input" className="text-sm font-semibold mb-2">Theme Color</Label>
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex gap-2 items-start">
              <Textarea
                id="color-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="No color selected..."
                rows={2}
                className="font-mono min-h-0 text-sm pr-12 resize-none"
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
                  <div className="flex-1 justify-center items-center overflow-y-auto py-4 space-y-4">
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
                      <SelectItem value="public">public</SelectItem>
                      <SelectItem value="private">private</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price & Scholarship */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="scholarship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scholarship (%)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                <Textarea {...field} />
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
                <Textarea {...field} />
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
              <Image
                key={idx}
                src={src}
                width={100}
                height={100}
                alt={`Thumbnail ${idx}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}

         <FormField
          control={form.control}
          name="posterUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>posterUrl</FormLabel>
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
        {previewsPoster.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previewsPoster.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                width={100}
                height={100}
                alt={`Poster ${idx}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
