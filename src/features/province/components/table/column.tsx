import { Province } from "@/types/province";
import { ColumnDef } from "@tanstack/react-table";
import ProvinceCellAction from "./cell-action";

export const provinceColumns: ColumnDef<Province>[] = [
  {
    accessorKey: "englishName",
    header: "English Name",
    enableColumnFilter: true,
    meta: {
      label: "English Name",
      placeholder: "Enter title",
      variant: "text",
    },
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
    header: "Action",
    cell: ({ row }) => <ProvinceCellAction data={row.original} />,
  },
];
