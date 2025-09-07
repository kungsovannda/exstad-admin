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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
const formSchema = z.object({
  name_7739092615: z.string().min(1),
  name_8873194306: z.string(),
  name_1244948578: z.string(),
  name_2421160691: z.string(),
  name_1700059112: z.string().min(1),
  name_4353016075: z.string().min(1),
  name_8292263289: z.string(),
  name_1653586343: z.string(),
  images: z.array(z.file()),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid w-full items-center">
        <div className="grid grid-cols-2 gap-4">
          <div >
            <FormField
              control={form.control}
              name="name_7739092615"
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
          </div>

          <div >
            <FormField
              control={form.control}
              name="name_8873194306"
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div >
            <FormField
              control={form.control}
              name="name_1244948578"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program level" />
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
          </div>

          <div >
            <FormField
              control={form.control}
              name="name_2421160691"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a visibility" />
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div >
            <FormField
              control={form.control}
              name="name_1700059112"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input placeholder="0" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div >
            <FormField
              control={form.control}
              name="name_4353016075"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scholarship (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="0" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div >
            <FormField
              control={form.control}
              name="name_8292263289"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub title</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter subtitle" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div >
            <FormField
              control={form.control}
              name="name_1653586343"
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
          </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
          <div >
           <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Poster</FormLabel>
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
                                setPreviewsPoster(filePreviews);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
            </div>
            <div >
           <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Thumbmail</FormLabel>
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
                                setPreviewsThumbnail(filePreviews);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
            </div>
            </div>
                    <div className="grid grid-cols-2 gap-4">
                    {previewsPoster.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {previewsPoster.map((src, idx) => (
                      <Image
                        width={100}
                        height={100}
                        key={idx}
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
                    {previewsThumbnail.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {previewsThumbnail.map((src, idx) => (
                      <Image
                        width={100}
                        height={100}
                        key={idx}
                        src={src}
                        alt={`Preview ${idx + 1}`}
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
