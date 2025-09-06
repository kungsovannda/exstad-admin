import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { University } from "@/types/university";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const columns = ({
  onView,
  onDelete,
}: {
  onView: (u: University) => void;
  onDelete: (u: University) => void;
}): ColumnDef<University>[] => [
  {
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          English Name <ArrowUpDown className="ml-2 h-3 w-3" />
        </span>
      );
    },
    accessorKey: "englishName",
    size: 650,
  },
  {
    accessorKey: "shortName",
    header: "Short Name",
    size: 350,
  },
  {
    accessorKey: "khmerName",
    header: "Khmer Name",
    size: 600,
  },
  {
    accessorKey: "audit.createdBy",
    header: "Created By",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const university = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(university)}>
              View & Update
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(university)}
              className="text-red-600"
            >
              Delete university
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
