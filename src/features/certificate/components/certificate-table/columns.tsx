// import { CertificateType } from "@/types/certificate";
import { Scholar } from "@/types/scholar";
import { ColumnDef } from "@tanstack/react-table";
import CertificateCellAction from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";



export  const certificateColumn: ColumnDef<Scholar>[] = [
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
    header: "Scholar Name"
  },
  {
    accessorKey: "khmerName",
    header: "Khmer Name", 
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CertificateCellAction data={row.original} />,
  },
];
