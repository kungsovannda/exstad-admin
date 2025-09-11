"use client";

import React, { useEffect, useState } from "react";
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
import { DialogClose } from "@radix-ui/react-dialog";

// -----------------
// Validation schema
// -----------------
const formSchema = z.object({
  className: z.string().min(1, "Class name is required"),
  telegram: z.string().url("Must be a valid URL"),
  classCode: z.string().min(1, "Class code is required"),
  room: z.string().min(1, "Room is required"),
  shift: z.string().min(1, "Shift is required"),
  instructor: z.string().min(1, "Instructor is required"),
  start: z.date(),
  end: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClassModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Partial<FormValues>;
}

export default function ClassModal({
  open: controlledOpen,
  onOpenChange,
  initialData,
}: ClassModalProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled =
    typeof controlledOpen === "boolean" && typeof onOpenChange === "function";
  const open = isControlled ? controlledOpen! : localOpen;
  const setOpen = isControlled ? onOpenChange! : setLocalOpen;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          start: initialData.start ? new Date(initialData.start) : new Date(),
          end: initialData.end ? new Date(initialData.end) : new Date(),
        }
      : {
          className: "",
          telegram: "",
          classCode: "",
          room: "",
          shift: "",
          instructor: "",
          start: new Date(),
          end: new Date(),
        },
  });

  const {
    handleSubmit,
    reset,
    clearErrors,
    getValues,
    trigger: triggerValidation,
  } = form;

  useEffect(() => {
    if (open) {
      reset({
        ...initialData,
        start: initialData?.start ? new Date(initialData.start) : new Date(),
        end: initialData?.end ? new Date(initialData.end) : new Date(),
      });
      clearErrors();
    }
  }, [open, initialData, reset, clearErrors]);

  const handleFieldChange =
    <T extends keyof FormValues>(
      fieldName: T,
      onChange: (value: FormValues[T]) => void
    ) =>
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      clearErrors(fieldName);
      if (typeof e === "string") {
        // For Radix Select
        onChange(e as FormValues[T]);
      } else {
        // For standard input elements
        onChange(e.target.value as FormValues[T]);
      }
    };

  const onSubmitForm = (values: FormValues) => {
    try {
      if (initialData) {
        console.log("Updating class:", values);
        toast.success(`Class "${values.className}" updated successfully!`);
      } else {
        console.log("Creating class:", values);
        toast.success(`Class "${values.className}" created successfully!`);
      }
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
        onInteractOutside={(e) => {
          e.preventDefault();
          const values = getValues();
          const hasEmpty = Object.values(values).some(
            (v) => v === "" || v === null || v === undefined
          );
          if (hasEmpty) triggerValidation();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          const values = getValues();
          const hasEmpty = Object.values(values).some(
            (v) => v === "" || v === null || v === undefined
          );
          if (hasEmpty) triggerValidation();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Class" : "Add New Class"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="space-y-6 mt-4"
          >
            {/* Row 1: Class Name & Telegram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Class Name"
                        onChange={handleFieldChange(
                          "className",
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
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram Group Link</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Telegram Link"
                        onChange={handleFieldChange("telegram", field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      onValueChange={(val) =>
                        handleFieldChange("room", field.onChange)(val)
                      }
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                      </FormControl>
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
                      onValueChange={(val) =>
                        handleFieldChange("shift", field.onChange)(val)
                      }
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        handleFieldChange("instructor", field.onChange)(val)
                      }
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an instructor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Kim Chansokpheng">
                          Kim Chansokpheng
                        </SelectItem>
                        <SelectItem value="Chan Chhaya">Chan Chhaya</SelectItem>
                        <SelectItem value="Eung Lyzhia">Eung Lyzhia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: Start & End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="1"
                        value={field.value.toTimeString().slice(0, 8)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const [h, m, s] = e.target.value
                            .split(":")
                            .map(Number);
                          const newDate1 = new Date(field.value);
                          newDate1.setHours(h, m, s);
                          field.onChange(newDate1); // Pass Date to RHF
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="1"
                        value={field.value.toTimeString().slice(0, 8)}
                        onChange={(e) => {
                          const [h, m, s] = e.target.value
                            .split(":")
                            .map(Number);
                          const newDate = new Date(field.value);
                          newDate.setHours(h, m, s);
                          field.onChange(newDate); // Pass Date to RHF
                        }}
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
                  className="bg-red-500 hover:bg-red-400 hover:text-white text-white"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary text-white">
                {initialData ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// 'use client';

// import React from "react";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { ChevronDownIcon } from "lucide-react"
// import { Calendar } from "@/components/ui/calendar"
// import { Label } from "@/components/ui/label"
// import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover"
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// const formSchema = z.object({
//   name_3717067953: z.string().min(1),
//   name_7973345501: z.string().min(1),
//   name_2547433202: z.string().min(1),
//   name_7031132415: z.string(),
//   name_3250412614: z.string(),
//   name_9138373335: z.string()
// });

// export default function ClassModal1() {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       console.log(values);
//       toast(
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(values, null, 2)}</code>
//         </pre>
//       );
//     } catch (error) {
//       console.error("Form submission error", error);
//       toast.error("Failed to submit the form. Please try again.");
//     }
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="default">Add Class</Button>
//       </DialogTrigger>

//       <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>Add New Class</DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Class Name */}
//               <FormField
//                 control={form.control}
//                 name="name_3717067953"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Class Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter Class Name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Telegram Group Link */}
//               <FormField
//                 control={form.control}
//                 name="name_7973345501"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Telegram Group Link</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter Telegram Group Link" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Class Code */}
//               <FormField
//                 control={form.control}
//                 name="name_2547433202"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Class Code</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter Class Code" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Room */}
//               <FormField
//                 control={form.control}
//                 name="name_7031132415"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Room</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a room" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Blockchain">Blockchain</SelectItem>
//                         <SelectItem value="DevOps">DevOps</SelectItem>
//                         <SelectItem value="Fullstack">Fullstack</SelectItem>
//                         <SelectItem value="Mobile">Mobile</SelectItem>
//                         <SelectItem value="Data Analytics">Data Analytics</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Shift */}
//               <FormField
//                 control={form.control}
//                 name="name_3250412614"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Shift</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a shift" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Morning">Morning</SelectItem>
//                         <SelectItem value="Afternoon">Afternoon</SelectItem>
//                         <SelectItem value="Evening">Evening</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )} />
//               {/* Instructor Name */}
//               <FormField
//                 control={form.control}
//                 name="name_9138373335"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Instructor Name</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select an instructor" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Kim Chansokpheng">Kim Chansokpheng</SelectItem>
//                         <SelectItem value="Chan Chhaya">Chan Chhaya</SelectItem>
//                         <SelectItem value="Eung Lyzhia">Eung Lyzhia</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}  />
//            </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex flex-col gap-3">
//                       <Label htmlFor="time-picker" className="px-1">Started Time </Label>
//                       <Input
//                         type="time"
//                         id="time-picker"
//                         step="1"
//                         defaultValue="10:30:00"
//                         className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
//                       />
//                     </div>
//                     <div className="flex flex-col gap-3">
//                       <Label htmlFor="time-picker" className="px-1">Ended Time </Label>
//                       <Input
//                         type="time"
//                         id="time-picker"
//                         step="1"
//                         defaultValue="10:30:00"
//                         className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
//                       />
//                     </div>

//                 </div>

//             <div className="flex justify-end mt-4">
//               <Button type="submit" className="bg-primary text-white">
//                 Save
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
