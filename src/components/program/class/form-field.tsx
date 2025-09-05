// "use client"
// import {
//   useState
// } from "react"
// import {
//   toast
// } from "sonner"
// import {
//   useForm
// } from "react-hook-form"
// import {
//   zodResolver
// } from "@hookform/resolvers/zod"
// import {
//   z
// } from "zod"
// import {
//   cn
// } from "@/lib/utils"
// import {
//   Button
// } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import {
//   Input
// } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select"
// import {
//   format
// } from "date-fns"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from "@/components/ui/popover"
// import {
//   Calendar
// } from "@/components/ui/calendar"
// import {
//   Calendar as CalendarIcon
// } from "lucide-react"

// const formSchema = z.object({
//   name_3717067953: z.string().min(1),
//   name_7973345501: z.string().min(1),
//   name_2547433202: z.string().min(1),
//   name_7031132415: z.string(),
//   name_3250412614: z.string(),
//   name_9138373335: z.string(),
//   name_8528783584: z.coerce.date(),
//   name_3917342201: z.coerce.date()
// });

// export default function MyForm() {

//   const form = useForm < z.infer < typeof formSchema >> ({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       "name_8528783584": new Date(),
//       "name_3917342201": new Date()
//     },
//   })

//   function onSubmit(values: z.infer < typeof formSchema > ) {
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
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        
//         <div className="grid grid-cols-12 gap-4">
          
//           <div className="col-span-6">
            
//         <FormField
//           control={form.control}
//           name="name_3717067953"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input 
//                 placeholder="shadcn"
                
//                 type=""
//                 {...field} />
//               </FormControl>
//               <FormDescription>This is your public display name.</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//           </div>
          
//           <div className="col-span-6">
            
//         <FormField
//           control={form.control}
//           name="name_7973345501"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input 
//                 placeholder="shadcn"
                
//                 type=""
//                 {...field} />
//               </FormControl>
//               <FormDescription>This is your public display name.</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//           </div>
          
//         </div>
        
//         <div className="grid grid-cols-12 gap-4">
          
//           <div className="col-span-6">
            
//         <FormField
//           control={form.control}
//           name="name_2547433202"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input 
//                 placeholder="shadcn"
                
//                 type=""
//                 {...field} />
//               </FormControl>
//               <FormDescription>This is your public display name.</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//           </div>
          
//           <div className="col-span-6">
            
//         <FormField
//           control={form.control}
//           name="name_7031132415"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a verified email to display" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="m@example.com">m@example.com</SelectItem>
//                   <SelectItem value="m@google.com">m@google.com</SelectItem>
//                   <SelectItem value="m@support.com">m@support.com</SelectItem>
//                 </SelectContent>
//               </Select>
//                 <FormDescription>You can manage email addresses in your email settings.</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//           </div>
          
//         </div>
        
//         <div className="grid grid-cols-12 gap-4">
          
//           <div className="col-span-6">
            
//         <FormField
//           control={form.control}
//           name="name_3250412614"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a verified email to display" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="m@example.com">m@example.com</SelectItem>
//                   <SelectItem value="m@google.com">m@google.com</SelectItem>
//                   <SelectItem value="m@support.com">m@support.com</SelectItem>
//                 </SelectContent>
//               </Select>
//                 <FormDescription>You can manage email addresses in your email settings.</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//           </div>
          
//           <div className="col-span-6">
            
//         <FormField
//           control={form.control}
//           name="name_9138373335"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a verified email to display" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="m@example.com">m@example.com</SelectItem>
//                   <SelectItem value="m@google.com">m@google.com</SelectItem>
//                   <SelectItem value="m@support.com">m@support.com</SelectItem>
//                 </SelectContent>
//               </Select>
//                 <FormDescription>You can manage email addresses in your email settings.</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//           </div>
          
//         </div>
        
//         <div className="grid grid-cols-12 gap-4">
          
//           <div className="col-span-6">
            
//       <FormField
//       control={form.control}
//       name="name_8528783584"
//       render={({ field }) => (
//         <FormItem className="flex flex-col">
//           <FormLabel>Date of birth</FormLabel>
//           <Popover>
//             <PopoverTrigger asChild>
//               <FormControl>
//                 <Button
//                   variant={"outline"}
//                   className={cn(
//                     "w-[240px] pl-3 text-left font-normal",
//                     !field.value && "text-muted-foreground"
//                   )}
//                 >
//                   {field.value ? (
//                     format(field.value, "PPP")
//                   ) : (
//                     <span>Pick a date</span>
//                   )}
//                   <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                 </Button>
//               </FormControl>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar
//                 mode="single"
//                 selected={field.value}
//                 onSelect={field.onChange}
//                 initialFocus
//               />
//             </PopoverContent>
//           </Popover>
//        <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//           </div>
          
//           <div className="col-span-6">
            
//       <FormField
//       control={form.control}
//       name="name_3917342201"
//       render={({ field }) => (
//         <FormItem className="flex flex-col">
//           <FormLabel>Date of birth</FormLabel>
//           <Popover>
//             <PopoverTrigger asChild>
//               <FormControl>
//                 <Button
//                   variant={"outline"}
//                   className={cn(
//                     "w-[240px] pl-3 text-left font-normal",
//                     !field.value && "text-muted-foreground"
//                   )}
//                 >
//                   {field.value ? (
//                     format(field.value, "PPP")
//                   ) : (
//                     <span>Pick a date</span>
//                   )}
//                   <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                 </Button>
//               </FormControl>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar
//                 mode="single"
//                 selected={field.value}
//                 onSelect={field.onChange}
//                 initialFocus
//               />
//             </PopoverContent>
//           </Popover>
//        <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//           </div>
          
//         </div>
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   )
// }