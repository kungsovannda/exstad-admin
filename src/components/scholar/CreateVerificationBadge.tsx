import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
const schema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(2).max(100),
  badgeImage: z.file(),
});

export function CreateVerificationBadge({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      badgeImage: undefined,
    },
  });
  const [previews, setPreviews] = useState<string[]>([]);
  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) form.reset();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new badge</DialogTitle>
          <DialogDescription>
            Fill information below and click create when youre done
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-badge-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English name</FormLabel>
                  <FormControl>
                    <Input placeholder="Pre-University" {...field} />
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
                  <FormLabel>Khmer name</FormLabel>
                  <FormControl>
                    <Input placeholder="The beginning of journey" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="badgeImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        field.onChange(files);

                        const filePreviews = files.map((file) =>
                          URL.createObjectURL(file)
                        );
                        setPreviews(filePreviews);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {previews.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previews.map((src, idx) => (
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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="create-badge-form" type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
