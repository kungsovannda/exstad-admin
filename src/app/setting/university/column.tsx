import { Checkbox } from "@/components/ui/checkbox";
import { dateFormatter } from "@/utils/dateFormatter";
import { ColumnDef } from "@tanstack/react-table";
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
    size: 100,
  },
  {
    accessorKey: "shortName",
    header: "Short Name",
    size: 300,
  },
  {
    accessorKey: "englishName",
    header: "English Name",
  },
  {
    accessorKey: "khmerName",
    header: "Khmer Name",
  },
  {
    accessorKey: "audit.createdBy",
    header: "Created By",
  },
  {
    id: "createdAt",
    accessorFn: (row) => row.audit?.createdAt,
    header: "Created At",
    cell: ({ row }) => {
      const raw: string = row.getValue("createdAt");
      const date = raw ? new Date(raw) : null;

      return <span>{date ? dateFormatter(date) : "N/A"}</span>;
    },
  },
];
