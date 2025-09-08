// import { CertificateType } from "@/types/certificate";
import { Scholar } from "@/types/scholar";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import ScholarCellAction from "./cell-action";



export  const scholarColumn: ColumnDef<Scholar>[] = [
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
    header: "English Name"
  },
  {
    accessorKey: "khmerName",
    header: "Khmer Name", 
  },
  {
    accessorKey: "status",
    header: "Program Name",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ScholarCellAction data={row.original} />,
  },
];
