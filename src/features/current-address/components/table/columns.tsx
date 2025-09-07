import { CurrentAddress } from "@/types/current-address";
import { ColumnDef } from "@tanstack/react-table";
import CurrentAddressCellAction from "./cell-action";

export const currentAddressColumn: ColumnDef<CurrentAddress>[] = [
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
    accessorKey: "province",
    header: "Province",
    enableColumnFilter: true,
    meta: {
      variant: "select",
      label: "Filter",
      placeholder: "Filter Province",
      options: [
        { label: "Phnom Penh", value: "Phnom Penh" },
        { label: "Battambang", value: "Battambang" },
      ],
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CurrentAddressCellAction data={row.original} />,
  },
];
