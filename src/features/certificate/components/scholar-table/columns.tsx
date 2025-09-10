// import { CertificateType } from "@/types/certificate";

import { Checkbox } from "@/components/ui/checkbox";
import { ScholarWithProgram } from "@/types/certificate";
import { ColumnDef } from "@tanstack/react-table";

export const scholarColumn: ColumnDef<ScholarWithProgram>[] = [
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
    size: 30,
  },
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "englishName",
    header: "English Name",
    cell: ({ row }) => {
      return <div className="h-8 flex justify-start items-center">{row.getValue("englishName")}</div>;
    }
  },
  {
    accessorKey: "khmerName",
    header: "Khmer Name",
  },
  {
    accessorKey: "title",
    header: "Program Name",
  },
];
