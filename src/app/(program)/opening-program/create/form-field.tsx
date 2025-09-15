"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import type { Resolver } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

// ------------------- SCHEMA -------------------
export const openingProgramformSchema = z.object({
  programUuid: z.string(),
  title: z.string().min(1),
  telegramGroup: z.string(),
  programType: z.string(),
  generation: z.preprocess((val) => Number(val), z.number()),
  originalFee: z.preprocess((val) => Number(val), z.number()),
  scholarship: z.preprocess((val) => Number(val), z.number()),
  price: z.preprocess((val) => Number(val), z.number()),
  totalSlot: z.preprocess((val) => Number(val), z.number()),
  duration: z.string(),
  curriculumPdfUri: z.string().optional(),
  thumbnail: z.string(),
});

export type OpeningProgramFormValue = z.infer<typeof openingProgramformSchema>;

type Props = {
  initialValues?: OpeningProgramFormValue;
  onSubmit: (data: OpeningProgramFormValue) => void;
  submitLabel?: string;
};

// ------------------- COMPONENT -------------------
export default function OpeningProgramForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
}: Props) {
  const [previewsThumbnail, setPreviewsThumbnail] = useState<string[]>([]);
  const resolver: Resolver<OpeningProgramFormValue> = zodResolver(
    openingProgramformSchema
  ) as unknown as Resolver<OpeningProgramFormValue>;

  // ------------------- FORM -------------------
  const form = useForm<OpeningProgramFormValue>({
    resolver, // <--- FIX TS ERROR
    defaultValues: initialValues || {
      programUuid: "04ce0f27-7c57-4a03-bfbe-93ba369a69a8",
      originalFee: 0,
      scholarship: 0,
      price: 0,
      generation: 0,
      title: "sambath",
      telegramGroup: "",
      programType: "",
      totalSlot: 0,
      duration: "",
      curriculumPdfUri: "",
      thumbnail: "",
    },
  });

  const { watch, setValue } = form;
  const price = watch("price") || 0;
  const scholarship = watch("scholarship") || 0;

  // ------------------- AUTO DISCOUNT -------------------
  useEffect(() => {
    const discount = price - (price * scholarship) / 100;
    setValue("price", isNaN(discount) ? 0 : discount);
  }, [price, scholarship, setValue]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 grid w-full items-center"
      >
                {/* Program Type */}
        <FormField
          control={form.control}
          name="programType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short Course">Short Course</SelectItem>
                  <SelectItem value="Scholarship">Scholarship</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Select onValueChange={setProgramType} value={programType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Program Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Scholarship">Scholarship</SelectItem>
            <SelectItem value="Short Course">Short Course</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger>
            <SelectValue placeholder="Select Master Program" />
          </SelectTrigger>
          <SelectContent>
            {masterPrograms
              .filter((p) => p.programType === programType)
              .map((program) => (
                <SelectItem key={program.uuid} value={program.uuid}>
                  {program.title} ({program.duration}, Slots:{" "}
                  {program.totalSlot})
                </SelectItem>
              ))}
          </SelectContent>
        </Select> */}

        {/* Program UUID */}
        <FormField
          control={form.control}
          name="programUuid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program UUID</FormLabel>
              <FormControl>
                <Input placeholder="Enter program UUID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter program title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Telegram */}
        <FormField
          control={form.control}
          name="telegramGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram Group Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter Telegram link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Generation & Total Slot */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="generation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Generation</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)} // keep string while typing
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Slot</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price, Scholarship, Discount */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="originalFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
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
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled
                    {...field}
                    value={field.value ?? 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 3 months" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thumbnail */}
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

        <Button type="submit" className="w-fit">
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
