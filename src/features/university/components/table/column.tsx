import { University } from "@/types/university";
import { ColumnDef } from "@tanstack/react-table";
import UniversityCellAction from "./cell-action";

export const universityColumns: ColumnDef<University>[] = [
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
    accessorKey: "scholars",
    header: "Scholars",
    enableSorting: true,
  },
  {
    accessorKey: "shortName",
    header: "Short Name",
  },
  {
    header: "Action",
    cell: ({ row }) => <UniversityCellAction data={row.original} />,
  },
];
