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

      // If both are ISTAD, they're equal
      if (a === "ISTAD" && b === "ISTAD") return 0;

      // If 'a' is ISTAD, it should come before 'b' (return negative)
      if (a === "ISTAD") return -1;

      // If 'b' is ISTAD, it should come before 'a' (return positive)
      if (b === "ISTAD") return 1;

      // For all other cases, sort alphabetically
      return a.localeCompare(b);
    },
  },
  {
    header: "Action",
    cell: ({ row }) => <UniversityCellAction data={row.original} />,
  },
];
