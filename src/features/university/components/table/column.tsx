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
    accessorKey: "shortName",
    header: "Short Name",
    enableColumnFilter: true,
    meta: {
      label: "Shortname",
      placeholder: "Filter short name",
      variant: "text",
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.shortName;
      const b = rowB.original.shortName;

      if (a === "ISTAD") return -1;
      if (b === "ISTAD") return 1;

      return a.localeCompare(b);
    },
  },
  {
    header: "Action",
    cell: ({ row }) => <UniversityCellAction data={row.original} />,
  },
];
