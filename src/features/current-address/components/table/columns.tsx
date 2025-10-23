import { CurrentAddress } from "@/types/current-address";
import { ColumnDef } from "@tanstack/react-table";
import CurrentAddressCellAction from "./cell-action";
import { Option } from "@/types/data-table";

export const currentAddressColumn = (
  provinceOptions: Option[]
): ColumnDef<CurrentAddress>[] => {
  return [
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
      accessorKey: "province",
      header: "Province",
      enableColumnFilter: true,
      meta: {
        variant: "multiSelect",
        label: "Province",
        options: provinceOptions,
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <CurrentAddressCellAction data={row.original} />,
    },
  ];
};
