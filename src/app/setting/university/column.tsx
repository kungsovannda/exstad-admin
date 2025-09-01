import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
type University = {
  uuid: string;
  englishName: string;
  khmerName: string;
  shortName: string;
  audit: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  };
};

export const columns: ColumnDef<University>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 40,
  },
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
];
