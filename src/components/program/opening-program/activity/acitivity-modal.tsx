import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { ActivityUploadField } from "@/app/(program)/master-program/create/activity";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { useGetAllOpeningProgramsQuery } from "@/features/opening-program/openingProgramApi";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Activity title is required"),
  description: z.string().min(1, "Activity description is required"),
  image: z.string(),
});

export type ActivityFormValues = z.infer<typeof formSchema>;

interface ActivityFormModalProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ActivityFormValues> & { imageUrl?: string };
  trigger?: React.ReactNode;
  onSubmitActivity?: (data: ActivityFormValues) => Promise<void> | void;
}
export default function ActivityFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmitActivity,
  trigger,
}: ActivityFormModalProps) {
  const { data: masterPrograms = [] } = useGetAllMasterProgramsQuery();
  const { data: openingPrograms = [] } = useGetAllOpeningProgramsQuery();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: initialData || {
      title: "",
      description: "",
      image: "",
    },
  });

  const { reset, handleSubmit, clearErrors } = form;

  const selectedMasterProgram = masterPrograms.find(
    (program) => program.title === form.watch("title")
  );

  const selectedOpeningProgram = openingPrograms.find(
    (program) => program.title === form.watch("title")
  );

  console.log(selectedMasterProgram, selectedOpeningProgram); // Debug output

  const onSubmit = async (data: ActivityFormValues) => {
    try {
      await onSubmitActivity?.(data);
      toast.success(
        initialData
          ? `Activity "${data.title}" updated successfully!`
          : `Activity "${data.title}" created successfully!`
      );
      handleClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit the activity: ${message || err}`);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();

    clearErrors();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Activity" : "Add New Activity"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
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

            {/* Description */}
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

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Poster *</FormLabel>
                  <FormControl>
                    {selectedMasterProgram && selectedOpeningProgram && (
                      <ActivityUploadField
                        form={form}
                        masterProgram={selectedMasterProgram}
                        openingProgram={selectedOpeningProgram}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end mt-4 gap-2">
              <DialogClose asChild>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary text-white cursor-pointer"
              >
                {initialData ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
