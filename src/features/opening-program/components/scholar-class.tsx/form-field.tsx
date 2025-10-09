"use client";

import { useEffect } from "react";
import { useGetAllScholarsQuery } from "@/features/scholar/scholarApi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CommandEmpty } from "cmdk";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";

// ✅ Zod Schema: only UUID required for backend
const ScholarClassFormSchema = z.object({
  scholarUuid: z.string().uuid({ message: "Scholar is required" }),
  scholarName: z.string().optional(), // just for toast/UI
  isPaid: z.boolean().optional(),
  isReminded: z.boolean().optional(),
});

export type ScholarClassFormValue = z.infer<typeof ScholarClassFormSchema>;

type Props = {
  triggerNode?: React.ReactNode; // renamed to avoid TS duplicate
  open?: boolean;
  onOpenChange?: (val: boolean) => void;
  initialData?: ScholarClassFormValue;
  existingScholars: string[]; // UUIDs of scholars already in class
  onSubmitScholarClass: (data: ScholarClassFormValue) => void;
};

export default function ScholarClassForm({
  initialData,
  onSubmitScholarClass,
  triggerNode,
  open,
  onOpenChange,
  existingScholars = [],
}: Props) {
  const { data: scholars = [], isLoading } = useGetAllScholarsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const form = useForm<ScholarClassFormValue>({
    resolver: zodResolver(ScholarClassFormSchema),
    defaultValues: {
      scholarUuid: initialData?.scholarUuid || "",
      scholarName: initialData?.scholarName || "",
      isPaid: initialData?.isPaid || false,
      isReminded: initialData?.isReminded || false,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, reset, clearErrors, setValue } = form;

  useEffect(() => {
    if (open) {
      reset({ ...initialData });
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const onSubmitForm = async (data: ScholarClassFormValue) => {
    // Prevent adding duplicate scholars
    if (!initialData && existingScholars.includes(data.scholarUuid)) {
      toast.error("This scholar is already added to the class.");
      return;
    }

    try {
      await onSubmitScholarClass?.(data);
      toast.success(
        initialData
          ? `Scholar ${data.scholarName} updated successfully!`
          : `Scholar ${data.scholarName} added to class successfully!`
      );
      onOpenChange?.(false);
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save scholar class: ${message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerNode && <DialogTrigger asChild>{triggerNode}</DialogTrigger>}
      <DialogContent
        className="max-w-md"
        onInteractOutside={(event) => {
          event.preventDefault();
          const values = form.getValues();
          const hasEmpty = Object.values(values).some(
            (v) => v === "" || v === undefined || v === null
          );
          if (hasEmpty) {
            form.trigger();
            toast.error("Please fill all required fields before leaving.");
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Scholar" : "Add New Scholar"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <FormField
              control={form.control}
              name="scholarUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scholar Username</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      const selected = scholars.find((s) => s.uuid === val);
                      field.onChange(val);
                      setValue("scholarName", selected?.username || "");
                    }}
                    value={field.value}
                    disabled={!!initialData || isLoading} // disable on edit or loading
                  >
                    <FormControl>
                      <SelectTrigger className="h-11" disabled={isLoading}>
                        <SelectValue placeholder="Choose a scholar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-80">
                      <Command>
                        <CommandInput
                          placeholder="Search scholar..."
                          className="h-9"
                        />
                        <CommandList>
                          <ScrollArea className="h-72">
                            <CommandEmpty>No scholar found.</CommandEmpty>
                            <CommandGroup>
                              {scholars.map((s) => {
                                const isDisabled =
                                  !initialData && existingScholars.includes(s.uuid);
                                return (
                                  <CommandItem
                                    key={s.uuid}
                                    value={s.uuid}
                                    disabled={isDisabled}
                                    onSelect={() => {
                                      field.onChange(s.uuid);
                                      setValue("scholarName", s.username);
                                    }}
                                  >
                                    <SelectItem value={s.uuid}>{s.username}</SelectItem>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </ScrollArea>
                        </CommandList>
                      </Command>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* isPaid checkbox */}
            <FormField
              control={form.control}
              name="isPaid"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel>Paid</FormLabel>
                </FormItem>
              )}
            />

            {/* isReminded checkbox */}
            <FormField
              control={form.control}
              name="isReminded"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel>Reminded</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary text-white cursor-pointer">
                {initialData ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
