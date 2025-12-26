"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
import ColorPicker from "react-best-gradient-color-picker";
import { generateSlug } from "@/services/generate-slug";
import {
  useCreateDocumentMutation,
  useCreateLogoMutation,
} from "@/features/document/documentApi";
import { LogoUploadField } from "@/features/master-program/components/LogoUrl";
import type { FieldErrors, Resolver } from "react-hook-form";
import { toast } from "sonner";
import generateFilename from "@/services/generate-filename";
import { ThumbnailUploadField } from "@/features/master-program/components/ThumbnailUrl";

export const MasterProgramFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  programType: z
    .union([z.enum(["SHORT_COURSE", "SCHOLARSHIP"]), z.undefined()])
    .refine((val) => val !== undefined, { message: "Status is required" }),
  programLevel: z
    .union([z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]), z.undefined()])
    .refine((val) => val !== undefined, { message: "Status is required" }),
  visibility: z
    .union([z.enum(["PUBLIC", "PRIVATE"]), z.undefined()])
    .refine((val) => val !== undefined, { message: "Status is required" }),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  logoUrl: z.string().min(1, { message: "Logo is required" }),
  thumbnailUrl: z.string().min(1, { message: "Thumbnail is required" }),
  bgColor: z.string().min(1, { message: "Theme color is required" }),
  slug: z
    .string()
    .max(100, { message: "Slug must not exceed 100 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase alphanumeric with hyphens",
    }),
});

export type MasterProgramFormValues = z.infer<typeof MasterProgramFormSchema>;

interface ExtendedFormReturn extends UseFormReturn<MasterProgramFormValues> {
  _logoFile?: File;
 _thumbnailFile?:File;
}

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
  const resolver: Resolver<MasterProgramFormValues> = zodResolver(
    MasterProgramFormSchema
  ) as unknown as Resolver<MasterProgramFormValues>;

  const form = useForm<MasterProgramFormValues>({
    resolver,
    defaultValues: initialValues || {
      title: "",
      programType: undefined as "SHORT_COURSE" | "SCHOLARSHIP" | undefined,
      programLevel: undefined as
        | "BASIC"
        | "INTERMEDIATE"
        | "ADVANCED"
        | undefined,
      visibility: undefined as "PUBLIC" | "PRIVATE" | undefined,
      subtitle: "",
      description: "",
      logoUrl: "",
      thumbnailUrl:"",
      bgColor: "",
      slug: "",
    },
  }) as ExtendedFormReturn;
  const [createDocument] = useCreateDocumentMutation();
  const [inputValue, setInputValue] = useState(form.getValues("bgColor"));
  const [bgColor, setbgColor] = useState(form.getValues("bgColor"));
  const [showDialog, setShowDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
      if (initialValues.bgColor) {
        setInputValue(initialValues.bgColor);
        setbgColor(initialValues.bgColor);
      }
      // Mark slug as edited if it exists in initialValues
      if (initialValues.slug) {
        setIsSlugEdited(true);
      }
    }
  }, [initialValues, form]);

  // ✅ Auto-generate slug when title changes (only if slug not manually changed)
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === "title" && values.title && !isSlugEdited) {
        form.setValue("slug", generateSlug(values.title), {
          shouldDirty: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isSlugEdited]);
  const handleChooseColor = () => {
    setInputValue(bgColor);
    form.setValue("bgColor", bgColor);
    setShowDialog(false);
  };

  const handleFormSubmit = async (data: MasterProgramFormValues) => {
    setIsUploading(true);
    try {
      const programSlug = data.slug;
      if (!programSlug) {
        form.setError("root", {
          message: "Slug is required",
        });
        setIsUploading(false);
        return;
      }

      if (data.logoUrl.startsWith("blob:") && form._logoFile) {
        const logoRes = await createDocument({
          file: form._logoFile,
          programSlug:"null",
          gen:0,
          documentType:"logo",
          filename:  generateFilename({
                        type: "logo",
                        program: programSlug,
                        generation: String(""),
                      }),
        }).unwrap();
        data.logoUrl = logoRes.uri;
      }
 if (data.thumbnailUrl.startsWith("blob:") && form._thumbnailFile) {
  const thumbnailRes = await createDocument({
    file: form._thumbnailFile,
    programSlug: "null",
    gen: 0,
    documentType: "thumbnail",
    filename: generateFilename({
      type: "thumbnail",
      program: programSlug,
      generation: String(""),
    }),
  }).unwrap();
  data.thumbnailUrl = thumbnailRes.uri;
}

      await onSubmit(data);
    } catch (error) {
      console.error("Upload failed:", error);
      form.setError("root", { message: "Failed to upload files" });
    } finally {
      setIsUploading(false);
    }
  };
  const handleInvalid = (errors: FieldErrors<MasterProgramFormValues>) => {
    const firstErrorField = Object.keys(
      errors
    )[0] as keyof MasterProgramFormValues;
    const fieldError = errors[firstErrorField];
    if (fieldError && "message" in fieldError && fieldError.message) {
      toast.error(fieldError.message as string);
    }
  };

  return (
    <Form {...form}>
      {/* should be handleFormSubmit waiting for api */}
      <form
        onSubmit={form.handleSubmit(handleFormSubmit, handleInvalid)}
        className="space-y-6 w-full"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-destructive">*</span>
              </FormLabel>
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
                    <SelectValue placeholder="Select Program Type" />
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
                    <DialogDescription>
                      Pick your desired color or gradient
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    <ColorPicker
                      width={460}
                      value={bgColor}
                      onChange={setbgColor}
                    />
                    <Label>Preview</Label>
                    <div
                      className="w-full h-16 rounded-md border shadow-sm"
                      style={{ background: bgColor }}
                    />
                  </div>
                  <DialogFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleChooseColor}>Choose</Button>
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
            name="programLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Level</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
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

        {/* Logo */}
        <FormField
          control={form.control}
          name="logoUrl"
          render={() => {
            const slug = form.watch("slug");
            return (
              <FormItem>
                <FormLabel>Logo *</FormLabel>
                <FormControl>
                  <div className="space-y-4 mt-2">
                    <LogoUploadField form={form} masterProgram={{ slug }} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
       <FormField
  control={form.control}
  name="thumbnailUrl"
  render={() => {
    const slug = form.watch("slug");
    return (
      <FormItem>
        <FormLabel>Cover   *</FormLabel>
        <FormControl>
          <div className="space-y-4 mt-2">
            <ThumbnailUploadField
              form={form}
              masterProgram={{ slug }}
            />
          </div>
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
