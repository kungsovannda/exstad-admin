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
import { Badge } from "@/types/badge";
import { dateFormatter } from "@/utils/dateFormatter";
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

export function ViewAndUpdateBadge({
  open,
  onOpenChange,
  badge,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: Badge;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: badge.title,
      description: badge.description,
      badgeImage: undefined,
    },
  });
  const [previews, setPreviews] = useState<string[]>([badge.badgeImage]);
  function onSubmit(values: z.infer<typeof schema>) {}

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
          <DialogTitle>View and update badge</DialogTitle>
          <DialogDescription>
            Fill information below and click create when youre done
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="update-badge-form"
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
          <div className="flex gap-2 flex-wrap">
            {previews.map((src, idx) => (
              <Image
                unoptimized
                width={100}
                height={100}
                key={idx}
                src={`http://localhost:3000${src}`}
                alt={`Preview ${idx + 1}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}
        <div>
          <div className="text-[12px] text-muted-foreground">
            Created by: {badge?.audit.createdBy} at{" "}
            {dateFormatter(badge?.audit.createdAt)}
          </div>
          <div className="text-[12px] text-muted-foreground">
            Updated by: {badge?.audit.updatedBy || "N/A"} at{" "}
            {dateFormatter(badge?.audit.updatedAt)}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="update-badge-form" type="submit">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
