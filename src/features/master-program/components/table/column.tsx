import { ColumnDef } from "@tanstack/react-table";
import { programType } from "@/types/program";
import { ArrowUpDown } from "lucide-react";
import { MasterActionsCell } from "@/components/program/master-program/action-cell";
import { programData } from "@/data/programData";

type Option = { label: string; value: string };

// Build unique level options
const getProgramLevel = (): Option[] => {
  const levels = programData.map((p) => ({
    value: p.level,
    label: p.level,
  }));

  // Remove duplicates by value
  const uniqueLevels = Array.from(
    new Map(levels.map((item) => [item.value, item])).values()
  );

  return uniqueLevels;
};

export const masterProgramColumns: ColumnDef<programType>[] = [
  {
    id: "title",
    accessorKey: "title",
    enableColumnFilter: true,
    meta: {
      variant: "text",
      placeholder: "Enter title...",
      label: "Program Title"
    },
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title <ArrowUpDown className="ml-2 h-3 w-3" />
      </span>
    ),
  },
  { accessorKey: "program_type", header: "Type" },
  { 
    accessorKey: "level", 
    header: "Level",
    enableColumnFilter: true,
    meta: {
      variant: "select",
      placeholder: "Filter level",
      label:"Program Level",
      options: getProgramLevel()
   },
  },
  { accessorKey: "price", header: "Price" },
  
  { accessorKey: "visibility", header: "Visibility",
    cell: ({ row }) => {
      const visibility = row.original.visibility;
      const bgClass =
        visibility === "public" ? "bg-[#E6F4EA] text-[#1E7D34]"  :  "bg-[#FDECEC] text-[#B32121]";
      return (
         <div className={`${bgClass} rounded-[8px] flex items-center justify-center w-[70px] h-[30px] `}>
        <span className={` px-2 py-1   text-sm`}>
          {visibility}
        </span>
     </div>
      ); 
    },
  },

  {
  accessorKey: "status",
  header: "Status",

  cell: ({ row }) => {
    const status = row.original.status
    const bgClass =
      status === "active"
        ? "bg-[#E6F4EA] text-[#1E7D34]"
        : status === "draft"
        ? "bg-[#FDECEC] text-[#B32121]"
        : "bg-gray-500 text-white" // default for archived/others

    return (
      <div
        className={`${bgClass} rounded-[8px] flex items-center justify-center w-[80px] h-[30px]`}
      >
        <span className="text-sm">{status}</span>
      </div>
    )
  },
},
  
  { accessorKey: "duration", header: "Duration" },
  {
  accessorKey: "scholarship",
  header: "Scholarship (%)",
  cell: ({ row }) => {
    const value = row.original.scholarship;
    return <span>{value}%</span>;
  },
},

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <MasterActionsCell program={row.original} />,
  },
  
];