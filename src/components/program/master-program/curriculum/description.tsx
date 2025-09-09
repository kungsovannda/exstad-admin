// "use client";

// import React, { useEffect } from "react";
// import { toast } from "sonner";
// import { useForm, FormProvider } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";

// const sectionSchema = z.object({
//   title: z.string().min(1, "Section title is required"),
// });

// type SectionFormValues = z.infer<typeof sectionSchema>;

// interface AddSectionDialogProps {
//   trigger?: React.ReactNode;
//   onSubmit: (data: SectionFormValues) => void;
//   initialData?: Partial<SectionFormValues>;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export default function AddSectionDialog({
//   trigger,
//   onSubmit,
//   initialData,
//   open,
//   onOpenChange,
// }: AddSectionDialogProps) {
//   const form = useForm<SectionFormValues>({
//     resolver: zodResolver(sectionSchema),
//     defaultValues: {
//       title: "",
//       ...initialData,
//     },
//     mode: "onSubmit",
//     reValidateMode: "onSubmit",
//   });

//   const { handleSubmit, reset, clearErrors, getValues, trigger: triggerValidation } = form;

//   // Reset when dialog opens or initialData changes
//   useEffect(() => {
//     if (open) {
//       reset({ title: initialData?.title || "" });
//       clearErrors();
//     }
//   }, [open, initialData, reset, clearErrors]);

//   // Form submit
//   const onSubmitForm = (data: SectionFormValues) => {
//     onSubmit(data);
//     toast.success(initialData ? "Section updated!" : "Section added!");
//     onOpenChange(false);
//     reset();
//   };

//   const handleFieldChange = (
//     fieldName: keyof SectionFormValues,
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   ) => (e: React.ChangeEvent<HTMLInputElement>) => {
//     clearErrors(fieldName);
//     onChange(e);
//   };

//   // ✅ Close immediately without validation (Cancel or X)
//   const handleClose = () => {
//     onOpenChange(false);
//     reset();
//     clearErrors();
//   };

//   // ✅ Validate only for outside click or Escape
//   const handlePreventClose = (event?: Event) => {
//     event?.preventDefault?.();

//     const values = getValues();
//     if (values.title.trim() === "") {
//       triggerValidation("title");
//       toast.error("Please fill the section title before leaving the modal.");
//       return false; // prevent closing
//     }

//     handleClose();
//     return true;
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(newOpen) => {
//         if (!newOpen) handlePreventClose(); // only validate on outside click/Escape
//       }}
//     >
//       {!open && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

//       <DialogContent
//         className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl"
//         onInteractOutside={handlePreventClose} // outside click
//         onEscapeKeyDown={handlePreventClose} // Escape key
//       >
//         <DialogHeader>
//           <DialogTitle>{initialData ? "Edit Section" : "Add Section"}</DialogTitle>
//         </DialogHeader>

//         <FormProvider {...form}>
//           <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Section Title</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder="Enter section title..."
//                       onChange={handleFieldChange("title", field.onChange)}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <DialogFooter className="flex justify-end gap-2">
//               <DialogClose asChild>
//                 <Button
//                   variant="outline"
//                   className="bg-red-500 hover:bg-red-400 text-white"
//                   onClick={handleClose} // Cancel button closes immediately
//                 >
//                   Cancel
//                 </Button>
//               </DialogClose>
//               <Button type="submit">{initialData ? "Save Changes" : "Add Section"}</Button>
//             </DialogFooter>
//           </form>
//         </FormProvider>
//       </DialogContent>
//     </Dialog>
//   );
// }
