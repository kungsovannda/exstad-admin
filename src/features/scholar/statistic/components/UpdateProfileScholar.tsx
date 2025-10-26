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
import { useCreateDocumentMutation } from "@/features/document/documentApi";
import { Scholar, UpdateScholar } from "@/types/scholar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateScholarMutation } from "../../scholarApi";

const schema = z.object({
  avatar: z.instanceof(File).optional(),
});

export function UpdateProfileScholar({
  open,
  onOpenChange,
  scholar,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholar: Scholar | null;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: undefined,
    },
  });
  const [files, setFiles] = useState<File[] | null>(null);
  const [updateScholar] = useUpdateScholarMutation();
  const [createDocument] = useCreateDocumentMutation();

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!scholar) return;
    try {
      const payload: UpdateScholar = {
        avatar: undefined,
      };

      if (files) {
        toast.loading("Uploading...");
        const document = await createDocument({
          file: files[0],
          documentType: "avatar",
          gen: 0,
          programSlug: "null",
        }).unwrap();
        payload.avatar = document.uri;
        toast.dismiss();
      }

      toast.promise(
        updateScholar({ uuid: scholar?.uuid, body: payload }).unwrap(),
        {
          loading: "Updating...",
          success: () => {
            return "Scholar avatar updated successfully!";
          },
          error: (error) => {
            return `Failed to update scholar: ${error.message}`;
          },
        }
      );
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
      <DialogContent
        onLoad={() => {
          if (open && !files) {
            document.getElementById("fileInput")?.click();
          }
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Update avatar</DialogTitle>
          <DialogDescription>Choose the avatar to update</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="update-badge-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="avatar"
              render={() => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl className="border-1 p-5">
                    <div className=" h-fit w-full flex justify-center items-center  ">
                      <Avatar className="relative h-48 w-48">
                        <AvatarImage
                          className="rounded-full h-full object-cover"
                          src={
                            files && files[0]
                              ? URL.createObjectURL(files[0])
                              : scholar?.avatar || "/placeholder.svg"
                          }
                          alt={scholar?.englishName}
                        />
                        <AvatarFallback className="rounded-full text-3xl">
                          {scholar?.englishName
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
          </form>
        </Form>
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
