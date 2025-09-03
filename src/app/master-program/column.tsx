import { ColumnDef } from "@tanstack/react-table";
import { programType } from "@/types/programs";
import { ArrowUpDown } from "lucide-react";
import { MasterActionsCell } from "@/components/program/master-program/action-cell";

export const columns: ColumnDef<programType>[] = [
  {
    id: "title",
    accessorKey: "title",
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
  { accessorKey: "level", header: "Level" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "duration", header: "Duration" },
  { accessorKey: "scholarship", header: "Scholarship (%)" },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <MasterActionsCell program={row.original} />,
  },
];
