"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDocumentMutation } from "@/features/document/documentApi";
import { Achievement, UpdateAchievement } from "@/types/achievement";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateAchievementMutation } from "../achievementApi";
import { dateFormatter } from "@/utils/dateFormatter";

const formSchema = z.object({
  title: z.string().min(1),
  achievementType: z.string(),
  program: z.string().readonly(),
  tag: z.string().min(1),
  link: z.string().min(1),
  video: z.string().min(1),
  icon: z.instanceof(File).optional(),
  description: z.string(),
});

export default function ViewAndUpdateAchievement({
  open,
  onOpenChange,
  achievement,
}: {
  open: boolean;
  onOpenChange: (status: boolean) => void;
  achievement: Achievement;
}) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [updateAchievement] = useUpdateAchievementMutation();
  const [createDocument] = useCreateDocumentMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      achievementType: achievement.achievementType,
      description: achievement.description,
      link: achievement.link,
      tag: achievement.tag,
      title: achievement.title,
      video: achievement.video,
      program: achievement.program,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload: UpdateAchievement = {
        ...values,
        icon: undefined,
      };

      if (files) {
        toast.loading("Uploading...");
        const document = await createDocument({
          file: files[0],
          documentType: "achievement",
          gen: 0,
          programSlug: "null",
        }).unwrap();
        payload.icon = document.uri;
        toast.dismiss();
      }

      toast.promise(
        updateAchievement({ uuid: achievement.uuid, body: payload }).unwrap(),
        {
          loading: "Updating...",
          success: () => {
            return "Achievement updated successfully!";
          },
          error: (error) => {
            return `Failed to update achievement: ${error.message}`;
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
      <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Update Achievement</DialogTitle>
          <DialogDescription>
            Make changes to your achievement here. Click update when you are
            done
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="update-achievement-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left Column */}
            <div className="flex flex-col space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievement Title</FormLabel>
                    <FormControl>
                      <Input placeholder="EXSTAD" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="EXSTAD"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="achievementType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievement Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mini Project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MINI_PROJECT">
                          Mini Project
                        </SelectItem>
                        <SelectItem value="FINAL_PROJECT">
                          Final Project
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="TOP 1" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exstad.istad.co"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://youtube.com/23kksf"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-5">
              <FormField
                control={form.control}
                name="icon"
                render={() => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <div className="flex justify-center items-center p-5 border rounded-lg">
                        <div className="relative inline-block">
                          <Avatar className="h-48 w-48">
                            <AvatarImage
                              className="rounded-full object-cover"
                              src={
                                files && files[0]
                                  ? URL.createObjectURL(files[0])
                                  : achievement.icon || "/placeholder.svg"
                              }
                              alt={achievement.title}
                            />
                            <AvatarFallback className="rounded-full text-3xl">
                              {achievement.title
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <label
                            htmlFor="fileInput"
                            className="absolute bottom-2 left-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg border-2 border-background"
                          >
                            <Pencil className="h-4 w-4 text-primary-foreground" />
                          </label>

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
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>Description</FormLabel>
                    <FormControl className="flex-1">
                      <Textarea
                        placeholder="EXSTAD is the amazing project"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <div className="text-[12px] text-muted-foreground">
                  Created by: {achievement?.audit.createdBy} at{" "}
                  {dateFormatter(achievement?.audit.createdAt)}
                </div>
                <div className="text-[12px] text-muted-foreground">
                  Updated by: {achievement?.audit.updatedBy || "N/A"} at{" "}
                  {dateFormatter(achievement?.audit.updatedAt)}
                </div>
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="update-achievement-form" type="submit">
            Update Achievement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
