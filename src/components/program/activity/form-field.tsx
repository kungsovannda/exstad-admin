"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Form Schema ---
const formSchema = z.object({
  name_1672220896: z.string().min(1),
  name_5632581777: z.string(),
  name_6061101953: z.string(),
  name_8345114127: z.string(),
  images: z.array(z.file()),
});

export default function ActivityFormModal() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
      setOpen(false); // Close modal on submit
      form.reset(); // Reset form
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const [previewsImage, setPreviewsImage] = useState<string[]>([]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Activity</Button>
      </DialogTrigger>

      <DialogContent className="w-fit max-w-sm sm:max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 grid gap-4 w-full items-center mt-4" >

                 <FormField
                  control={form.control}
                  name="name_1672220896"
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
                 <FormField
                  control={form.control}
                  name="name_6061101953"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Title</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Sub Title"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name_8345114127"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Full Description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Upload Image</FormLabel>
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
                                setPreviewsImage(filePreviews);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
               {previewsImage.length > 0 && (
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  {previewsImage.map((src, idx) => (
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
           

                  
            <Button type="submit" className="w-fit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
