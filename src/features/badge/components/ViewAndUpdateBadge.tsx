import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateBadgeMutation } from "@/features/badge/badgeApi";
import { useCreateDocumentMutation } from "@/features/document/documentApi";
import { Badge, UpdateBadge } from "@/types/badge";
import { dateFormatter } from "@/utils/dateFormatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(2).max(100),
  badgeImage: z.instanceof(File).optional(),
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
  const [files, setFiles] = useState<File[] | null>(null);
  const [updateBadge] = useUpdateBadgeMutation();
  const [createDocument] = useCreateDocumentMutation();

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const payload: UpdateBadge = {
        ...values,
        badgeImage: undefined,
      };

      if (files) {
        toast.loading("Uploading...");
        const document = await createDocument({
          file: files[0],
          documentType: "badge",
          gen: 0,
          programSlug: "null",
        }).unwrap();
        payload.badgeImage = document.uri;
        toast.dismiss();
      }

      toast.promise(updateBadge({ uuid: badge.uuid, body: payload }).unwrap(), {
        loading: "Updating...",
        success: () => {
          return "Badge updated successfully!";
        },
        error: (error) => {
          return `Failed to update badge: ${error.message}`;
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
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
              name="badgeImage"
              render={() => (
                <FormItem>
                  <FormLabel>Badge Image</FormLabel>
                  <FormControl className="border-1 p-5">
                    <div className=" h-fit w-full flex justify-center items-center  ">
                      <Avatar className="relative h-48 w-48">
                        <AvatarImage
                          className="rounded-full h-full object-cover"
                          src={
                            files && files[0]
                              ? URL.createObjectURL(files[0])
                              : badge.badgeImage || "/placeholder.svg"
                          }
                          alt={badge.title}
                        />
                        <AvatarFallback className="rounded-full text-3xl">
                          {badge.title
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                        <label
                          htmlFor="fileInput"
                          className="absolute bottom-2 left-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg border-2 border-background"
                        >
                          <Pencil className="h-4 w-4 text-primary-foreground" />
                        </label>
                      </Avatar>

                      <input
                        id="fileInput"
                        type="file"
                        accept="image/svg+xml,image/png,image/jpeg,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFiles([file]);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="The beginning of journey" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
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
