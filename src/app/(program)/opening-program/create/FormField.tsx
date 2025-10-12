"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
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
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { generateSlug } from "@/services/generate-slug";
import { ThumbnailUploadField } from "@/features/opening-program/ThumbnailUploadField";
import { PosterUploadField } from "../../../../features/opening-program/PosterUrl";
import { QrCodeUploadField } from "@/features/opening-program/QrCodeUrl";
import { useCreateDocumentMutation } from "@/features/document/documentApi";

// ------------------- SCHEMA -------------------
export const openingProgramformSchema = z.object({
  programUuid: z.string().min(1, { message: "Master Program is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  telegramGroup: z.string().min(1, { message: "Telegram Group is required" }),
  generation: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Generation is required" })
  ),
  originalFee: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Original fee is required" })
  ),
  scholarship: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Scholarship is required" })
  ),
  price: z.preprocess((val) => Number(val), z.number()),
  totalSlot: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Total Slot is required" })
  ),
  duration: z.string().min(1, { message: "Duration is required" }),
  deadline: z.string().min(1, { message: "Deadline is required" }),
  curriculumPdfUri: z.string().optional(),
  thumbnail: z.string().min(1, { message: "Thumbnail is required" }),
  posterUrl: z.string().min(1, { message: "Poster is required" }),
  slug: z
    .string()
    .max(100, { message: "Slug must not exceed 100 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase alphanumeric with hyphens",
    }),  status: z
    .union([z.enum(["OPEN", "CLOSED", "ACHIEVED", "PENDING"]), z.undefined()])
    .refine((val) => val !== undefined, { message: "Status is required" }),
  qrCodeUrl: z.string().min(1, { message: "Valid QR Code URL is required" }),
  activity: z.string().optional(),
});

export type OpeningProgramFormValue = z.infer<typeof openingProgramformSchema>;

// Extended form type with file storage
interface ExtendedFormReturn extends UseFormReturn<OpeningProgramFormValue> {
  _thumbnailFile?: File;
  _posterFile?: File;
  _qrCodeFile?: File;
}

type Props = {
  initialValues?: OpeningProgramFormValue;
  onSubmit: (data: OpeningProgramFormValue) => void;
  submitLabel?: string;
  onSlugEdited?: () => void;
};

// ------------------- COMPONENT -------------------
export default function OpeningProgramForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  onSlugEdited,
}: Props) {
  const { data: masterPrograms = [] } = useGetAllMasterProgramsQuery();
  const [createDocument] = useCreateDocumentMutation();
  const [previewsThumbnail, setPreviewsThumbnail] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedProgramType, setSelectedProgramType] = useState<
    string | undefined
  >(
    initialValues?.programUuid
      ? masterPrograms.find((p) => p.uuid === initialValues.programUuid)
          ?.programType
      : undefined
  );

  const resolver: Resolver<OpeningProgramFormValue> = zodResolver(
    openingProgramformSchema
  ) as unknown as Resolver<OpeningProgramFormValue>;

  const form = useForm<OpeningProgramFormValue>({
    resolver,
    defaultValues: initialValues || {
      programUuid: "",
      originalFee: 0,
      scholarship: 0,
      price: 0,
      generation: 0,
      title: "",
      telegramGroup: "",
      totalSlot: 0,
      duration: "",
      deadline: "",
      curriculumPdfUri: "",
      thumbnail: "",
      posterUrl: "",
      slug: "",
      status: undefined as
        | "OPEN"
        | "CLOSED"
        | "ACHIEVED"
        | "PENDING"
        | undefined,
      qrCodeUrl: "",
    },
  }) as ExtendedFormReturn;

  const { watch, setValue, reset } = form;
  const originalFee = watch("originalFee") || 0;
  const scholarship = watch("scholarship") || 0;
  const title = watch("title");

  // ------------------- FILTER MASTER PROGRAMS -------------------
  const filteredMasterPrograms = selectedProgramType
    ? masterPrograms.filter((p) => p.programType === selectedProgramType)
    : masterPrograms;

  // ------------------- AUTO DISCOUNT -------------------
  useEffect(() => {
    const discount = originalFee - (originalFee * scholarship) / 100;
    setValue("price", isNaN(discount) ? 0 : discount);
  }, [originalFee, scholarship, setValue]);

  const [isSlugEdited, setIsSlugEdited] = useState(false);
  // ------------------- AUTO SLUG (title + generation) -------------------
  const generation = watch("generation");

  useEffect(() => {
    if (!title || isSlugEdited) return;

    const baseSlug = generateSlug(title);
    const fullSlug = generation > 0 ? `${baseSlug}-${generation}` : baseSlug;
    setValue("slug", fullSlug);
  }, [title, generation, isSlugEdited, setValue]);

  // ------------------- RESET MASTER PROGRAM ON TYPE CHANGE -------------------
  // ✅ FIX: Reset form when initialValues change (this fixes your title reverting issue)
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  // ------------------- SYNC PROGRAM TYPE WHEN EDITING -------------------
  useEffect(() => {
    if (initialValues?.programUuid && masterPrograms.length > 0) {
      const selectedProgram = masterPrograms.find(
        (p) => p.uuid === initialValues.programUuid
      );
      if (selectedProgram) {
        setSelectedProgramType(selectedProgram.programType);
        form.setValue("programUuid", selectedProgram.uuid);
      }
    }
  }, [initialValues?.programUuid, masterPrograms, form]);

  // ------------------- HANDLE FORM SUBMISSION WITH FILE UPLOADS -------------------
  const handleFormSubmit = async (data: OpeningProgramFormValue) => {
    setIsUploading(true);

    try {
      const selectedProgram = masterPrograms.find(
        (p) => p.uuid === data.programUuid
      );
      const programSlug = selectedProgram?.slug;
      const generation = data.generation;

      if (!programSlug || !generation) {
        form.setError("root", {
          message: "Master Program and Generation are required",
        });
        setIsUploading(false);
        return;
      }

      // Upload thumbnail if it's a new file (blob URL)
      if (data.thumbnail.startsWith("blob:") && form._thumbnailFile) {
        const thumbnailRes = await createDocument({
          file: form._thumbnailFile,
          programSlug,
          gen: generation,
          documentType: "thumbnail",
          filename: "",
        }).unwrap();
        data.thumbnail = thumbnailRes.uri;
      }

      // Upload poster if it's a new file (blob URL)
      if (data.posterUrl.startsWith("blob:") && form._posterFile) {
        const posterRes = await createDocument({
          file: form._posterFile,
          programSlug,
          gen: generation,
          documentType: "poster",
          filename: "",
        }).unwrap();
        data.posterUrl = posterRes.uri;
      }

      // Upload QR code if it's a new file (blob URL)
      if (data.qrCodeUrl.startsWith("blob:") && form._qrCodeFile) {
        const qrRes = await createDocument({
          file: form._qrCodeFile,
          programSlug,
          gen: generation,
          documentType: "qr",
          filename: "",
        }).unwrap();
        data.qrCodeUrl = qrRes.uri;
      }

      // Now submit the form with uploaded URLs
      await onSubmit(data);
    } catch (error) {
      console.error("Upload failed:", error);
      form.setError("root", { message: "Failed to upload files" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8 grid w-full items-center"
      >
        {/* Program Type */}
        <FormItem>
          <FormLabel>Program Type</FormLabel>
          <Select
            onValueChange={setSelectedProgramType}
            value={selectedProgramType ?? ""}
            disabled={!!initialValues}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Program Type" />
            </SelectTrigger>
            <SelectContent>
              {masterPrograms.length > 0 ? (
                [...new Set(masterPrograms.map((p) => p.programType))].map(
                  (type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  )
                )
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Loading program types...
                </div>
              )}
            </SelectContent>
          </Select>
        </FormItem>

        {/* Master Program (filtered by programType) */}
        <FormField
          control={form.control}
          name="programUuid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Master Program</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!!initialValues}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Master Program" />
                </SelectTrigger>
                <SelectContent>
                  {filteredMasterPrograms.length > 0 ? (
                    filteredMasterPrograms.map((program) => (
                      <SelectItem key={program.uuid} value={program.uuid}>
                        {program.title}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No programs available
                    </div>
                  )}
                </SelectContent>
              </Select>
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
                    setIsSlugEdited(true); // mark slug as manually edited
                    if (onSlugEdited) onSlugEdited();
                  }}
                />
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

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="ACHIEVED">Achieved</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
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
                    onChange={(e) => field.onChange(e.target.value)}
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
                <Input placeholder="e.g. 6 months" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 18 AUG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Curriculum PDF */}
        <FormField
          control={form.control}
          name="curriculumPdfUri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curriculum PDF URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/curriculum.pdf"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thumbnail */}
        <FormField
          control={form.control}
          name="thumbnail"
          render={() => {
            const selectedProgram = masterPrograms.find(
              (p) => p.uuid === form.watch("programUuid")
            );
            const generation = form.watch("generation");

            return (
              <FormItem>
                <FormLabel>Thumbnail *</FormLabel>
                <FormControl>
                  <div className="space-y-4 mt-2">
                    <ThumbnailUploadField
                      form={form}
                      masterProgram={selectedProgram}
                      openingProgram={{ generation }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
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

        {/* Poster */}
        <FormField
          control={form.control}
          name="posterUrl"
          render={() => {
            const selectedProgram = masterPrograms.find(
              (p) => p.uuid === form.watch("programUuid")
            );
            const generation = form.watch("generation");

            return (
              <FormItem>
                <FormLabel>Poster *</FormLabel>
                <FormControl>
                  <div className="space-y-4 mt-2">
                    <PosterUploadField
                      form={form}
                      masterProgram={selectedProgram}
                      openingProgram={{ generation }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* QR Code Upload */}
        <FormField
          control={form.control}
          name="qrCodeUrl"
          render={() => {
            const selectedProgram = masterPrograms.find(
              (p) => p.uuid === form.watch("programUuid")
            );
            const generation = form.watch("generation");

            return (
              <FormItem>
                <FormLabel>QR Code *</FormLabel>
                <FormControl>
                  <QrCodeUploadField
                    form={form}
                    masterProgram={selectedProgram}
                    openingProgram={{ generation }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" className="w-fit" disabled={isUploading}>
          {isUploading ? "Uploading..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
