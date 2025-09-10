"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ColorPicker from "react-best-gradient-color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

// Improved schema with meaningful field names
const programFormSchema = z.object({
  title: z.string().min(1),
  type: z.string(),
  level: z.string(),
  visibility: z.string(),
  price: z.string().min(1),
  scholarship: z.string().min(1),
  subtitle: z.string(),
  description: z.string(),
  posterImages: z.array(z.any()), // file inputs
  thumbnailImages: z.array(z.any()), // file inputs
  themeColor: z.string(),
});

export default function ProgramForm() {
  const form = useForm<z.infer<typeof programFormSchema>>({
    resolver: zodResolver(programFormSchema),
  });

  const [previewsPoster, setPreviewsPoster] = useState<string[]>([]);
  const [previewsThumbnail, setPreviewsThumbnail] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [tempColor, setTempColor] = useState(
    "linear-gradient(90deg, rgba(96,165,250,1) 0%, rgba(168,85,247,1) 100%)"
  );
  const [showDialog, setShowDialog] = useState(false);

  const handleSelectClick = () => {
    if (inputValue) setTempColor(inputValue);
    setShowDialog(true);
  };

  const handleChoose = () => {
    setInputValue(tempColor);
    setShowDialog(false);
  };

  const handleCancel = () => setShowDialog(false);

  function onSubmit(values: z.infer<typeof programFormSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full"
      >
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Short Course">Short Course</SelectItem>
                  <SelectItem value="Scholarship">Scholarship</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Color Picker */}
        <div>
          <Label htmlFor="color-input" className="text-sm font-semibold mb-2"> Theme Color  </Label>
          <div className="space-y-4 rounded-lg border p-4">
           <div className="flex gap-2 items-start">
            <div className="relative flex-1">
                  <Textarea
                    id="color-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="No color selected..."
                    rows={2}
                    className="font-mono min-h-0  text-sm pr-12 resize-none"
                  />
                  {inputValue && (
                    <div className="absolute right-3 top-2 h-6 w-6 rounded border shadow-sm" style={{ background: inputValue }} />
                  )}
                </div>
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button onClick={handleSelectClick}>Select</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Choose Color</DialogTitle>
                    <DialogDescription>Pick your desired color or gradient</DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 justify-center items-center overflow-y-auto py-4 space-y-4">
                    <div className=" flex justify-center items-center rounded-lg overflow-hidden">
                      <ColorPicker className={"bg-transparent"} width={460} value={tempColor} onChange={setTempColor} />
                    </div>
                    <Label>Preview</Label>
                    <div
                      className="w-full h-16 rounded-md border shadow-sm"
                      style={{ background: tempColor }}
                    />
                  </div>
                  <DialogFooter className="flex gap-2 ">
                    <Button variant="outline" onClick={handleCancel}> Cancel</Button>
                    <Button onClick={handleChoose}>Choose</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {inputValue && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div
                  className="w-full h-14 rounded-md border shadow-sm"
                  style={{ background: inputValue }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Program Level & Visibility */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input type="number" placeholder="0" {...field} />
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
                  <Input type="number" placeholder="0" {...field} />
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

        {/* Poster Images */}
        <FormField
          control={form.control}
          name="posterImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    field.onChange(files);
                    setPreviewsPoster(files.map((f) => URL.createObjectURL(f)));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thumbnail Images */}
        <FormField
          control={form.control}
          name="thumbnailImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    field.onChange(files);
                    setPreviewsThumbnail(files.map((f) => URL.createObjectURL(f)));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Previews */}
        <div className="grid grid-cols-2 gap-4">
          {previewsPoster.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {previewsPoster.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  width={100}
                  height={100}
                  alt={`Poster Preview ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
          {previewsThumbnail.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {previewsThumbnail.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  width={100} 
                  height={100}
                  alt={`Thumbnail Preview ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
