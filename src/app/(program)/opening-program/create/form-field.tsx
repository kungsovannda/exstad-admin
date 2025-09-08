"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1),
  telegram: z.string(),
  programType: z.string(),
  generation: z.number(),        // was string
  price: z.number(),             // was string
  scholarship: z.number(),       // was string
  discountPrice: z.number(),
  subtitle: z.string(),
  description: z.string(),
  poster: z.array(z.instanceof(File)),
  thumbnail: z.array(z.instanceof(File)),
});

export default function OpeningProgramInformation() {
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
    price: 0,
    scholarship: 0,
    discountPrice: 0,
    generation: 0,
    title: "",
    telegram: "",
    programType: "",
    subtitle: "",
    description: "",
    poster: [],
    thumbnail: [],
  },
    });
  
    function onSubmit(values: z.infer<typeof formSchema>) {
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
  
    const [previewsPoster, setPreviewsPoster] = useState<string[]>([]);
    const [previewsThumbnail, setPreviewsThumbnail] = useState<string[]>([]);


    const { watch, setValue } = form;
    const price = (watch("price") || 0);
    const scholarship = (watch("scholarship") || 0);

    useEffect(() => {
  const discount = price - (price * scholarship) / 100;
  setValue("discountPrice", isNaN(discount) ? 0 : discount);
}, [price, scholarship, setValue]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid w-full items-center">

        {/* Row 1: Title & Telegram */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Program Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Opening Program Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram Group Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Telegram Group Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* Row 2: Program Type & Generation */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="programType"
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
          <FormField
            control={form.control}
            name="generation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Generation</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Price & Scholarship */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
  control={form.control}
  name="price"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Price ($)</FormLabel>
      <FormControl>
        <Input type="number" placeholder="0" {...field} {...{ valueAsNumber: true }} />
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
        <Input type="number" placeholder="0" {...field} {...{ valueAsNumber: true }} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="discountPrice"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Discount Price ($)</FormLabel>
      <FormControl>
        <Input type="number" disabled {...field} value={field.value ?? 0} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


        </div>

        {/* Row 4: Subtitle & Description */}
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter subtitle" className="resize-none" {...field} />
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
                  <Textarea placeholder="Enter description" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



             {/* Row 6: Previews */}
          {previewsPoster.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {previewsPoster.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  width={100}
                  height={100}
                  alt={`Poster ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
          {previewsThumbnail.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {previewsThumbnail.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  width={100}
                  height={100}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}

        {/* Row 5: Poster & Thumbnail */}
          <FormField
            control={form.control}
            name="poster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poster</FormLabel>
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
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
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

     

        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
