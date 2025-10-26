"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldErrors, Resolver } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { useGetNotScholarUsersQuery } from "@/features/user/userApi";

// ----------------- Validation schema -----------------
const formSchema = z.object({
  uuid: z.string().optional(), // optional for new class
  telegram: z
    .string()
    .min(1, { message: "Telegram Group link is required" })
    .url("Must be a valid URL"),
  classCode: z.string().min(1, { message: "Class code is required" }),
  room: z.string().min(1, { message: "Room is required" }),
  shift: z.enum(["MORNING", "AFTERNOON", "EVENING"]),
  totalSlot: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Total Slot is required" })
  ),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  isWeekend: z.boolean().optional(),
});

export type ClassFormValues = z.infer<typeof formSchema>;

// ----------------- Props -----------------
type ClassModalProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: ClassFormValues;
  onSubmitClass?: (data: ClassFormValues) => Promise<void> | void;
  submitLabel?: string;
};

// ----------------- Component -----------------
export default function ClassModal({
  trigger,
  open,
  onOpenChange,
  initialData,
  onSubmitClass,
}: ClassModalProps) {
  const resolver: Resolver<ClassFormValues> = zodResolver(
    formSchema
  ) as unknown as Resolver<ClassFormValues>;

  const form = useForm<ClassFormValues>({
    resolver,
    defaultValues: initialData
      ? {
          startTime: initialData.startTime ?? "",
          endTime: initialData.endTime ?? "",
          room: initialData.room ?? "",
          shift: undefined,
          totalSlot: initialData.totalSlot ?? 0,
          telegram: initialData.telegram ?? "",
          isWeekend: initialData.isWeekend ?? false,
          classCode: initialData.classCode ?? "",
          uuid: initialData.uuid ?? "",
        }
      : {
          uuid: "",
          telegram: "",
          classCode: "",
          room: "",
          shift: undefined,
          startTime: "",
          endTime: "",
          totalSlot: 0,
          isWeekend: false,
        },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const { data: instructors = [] } = useGetNotScholarUsersQuery();
  const { handleSubmit, reset, clearErrors } = form;

  useEffect(() => {
    if (open) {
      reset({ ...initialData });
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const onSubmitForm: (data: ClassFormValues) => Promise<void> = async (
    data
  ) => {
    try {
      await onSubmitClass?.(data);
      onOpenChange?.(false);

      reset();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const handleFieldChange =
    (
      fieldName: keyof ClassFormValues,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void
    ) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      clearErrors(fieldName);
      onChange(event);
    };

  const handleSelectChange =
    (fieldName: keyof ClassFormValues, onChange: (value: string) => void) =>
    (value: string) => {
      clearErrors(fieldName);
      onChange(value);
    };

    const handleInvalid = (errors: FieldErrors<ClassFormValues>) => {
      const firstErrorField = Object.keys(errors)[0] as keyof ClassFormValues;
      const fieldError = errors[firstErrorField];
      if (fieldError && "message" in fieldError && fieldError.message) {
        toast.error(fieldError.message as string);
      }
    };
    

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
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
            {initialData ? "Edit Class" : "Add New Class"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmitForm,handleInvalid)}
            className="space-y-6 mt-4"
          >
            {/* Row 2: Class Code & Room */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="classCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Class Code"
                        onChange={handleFieldChange(
                          "classCode",
                          field.onChange
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <Select
                      onValueChange={handleSelectChange("room", field.onChange)}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Blockchain">Blockchain</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="Fullstack">Fullstack</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="Data Analytics">
                          Data Analytics
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: Shift & Instructor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select
                      onValueChange={handleSelectChange(
                        "shift",
                        field.onChange
                      )}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MORNING">Morning</SelectItem>
                        <SelectItem value="AFTERNOON">Afternoon</SelectItem>
                        <SelectItem value="EVENING">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="totalSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Slots</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: Start & End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="1"
                        {...field}
                        onChange={handleFieldChange(
                          "startTime",
                          field.onChange
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="1"
                        {...field}
                        onChange={handleFieldChange("endTime", field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 5: Total Slots & Telegram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram Group Link</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Telegram Link"
                        value={field.value ?? ""}
                        onChange={handleFieldChange("telegram", field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                {/* Row 6: Is Weekend */}
            <FormField
              control={form.control}
              name="isWeekend"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormLabel>Is Weekend?</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value ?? false}
                      onChange={(e) => {
                        clearErrors("isWeekend");
                        field.onChange(e.target.checked);
                      }}
                      className="w-4 h-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

          

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
