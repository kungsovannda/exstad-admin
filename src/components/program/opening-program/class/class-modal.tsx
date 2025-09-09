// 'use client';

// import React from "react";
// import { FormField } from "@/components/program/form-field";
// import { Button } from "@/components/ui/button";
// import { FiPlus } from "react-icons/fi";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// type Field = {
//   id: string;
//   label: string;
//   type?: "text" | "email" | "select" | "textarea" | "number" | "date" | "file";
//   placeholder?: string;
//   options?: { value: string; label: string }[];
//   rows?: number;
// };

// export default function ClassModal() {
//   const fields: Field[] = [
//     { id: "name", label: "Class Name", type: "text", placeholder: "Enter your Class Name" },
//     { id: "telegram", label: "Telegram Group Link", type: "text", placeholder: "Enter your Telegram Group Link" },
//     { id: "classCode", label: "Class Code", type: "text", placeholder: "Enter your Class Code" }, 
//     { id: "room", label: "Room", type: "select",
//       options: [
//         { value: "Blockchain", label: "Blockchain" },
//         { value: "DevOps", label: "DevOps" },
//         { value: "Fullstack", label: "Fullstack" },
//         { value: "Mobile", label: "Mobile" },
//         { value: "Data Analytics", label: "Data Analytics" },
//       ],
//       placeholder: "Select a Room" },
//     { id: "shift", label: "Shift", type: "select",
//       options: [
//         { value: "Morning", label: "Morning" },
//         { value: "Afternoon", label: "Afternoon" },
//         { value: "Evening", label: "Evening" },
//       ],
//       placeholder: "Select a Shift" },
//     { id: "instructor", label: "Instructor Name", type: "select",
//       options: [
//         { value: "Kim Chansokpheng", label: "Kim Chansokpheng" },
//         { value: "Sreng Chipor", label: "Sreng Chipor" },
//         { value: "Chan Chhaya", label: "Chan Chhaya" },
//       ],
//       placeholder: "Select an Instructor" },
//     { id: "start", label: "Start Date", type: "date" },
//     { id: "end", label: "End Date", type: "date" },
//   ];

//   const handleSave = () => {
//     // TODO: API call to save class
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="default" className="flex items-center gap-2">
//           <FiPlus className="text-lg" />
//           Add Class
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>Add New Class</DialogTitle>
//         </DialogHeader>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//           {fields.map((field) => (
//             <FormField
//               key={field.id}
//               id={field.id}
//               label={field.label}
//               type={field.type}
//               placeholder={field.placeholder}
//               options={field.options}
//               rows={field.rows}
//             />
//           ))}
//         </div>

//         <div className="flex justify-end mt-6">
//           <Button onClick={handleSave} className="bg-primary text-white">
//             Save
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
