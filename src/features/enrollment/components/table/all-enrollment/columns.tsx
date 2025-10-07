import { Enrollment } from "@/types/enrollment/index";
import { ColumnDef } from "@tanstack/react-table";
import EnrollmentCellAction from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { UserProfileCell } from "../user-profile-cell";
import { Badge } from "@/components/ui/badge";

export const enrollmentColumns: ColumnDef<Enrollment>[] = [
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
  {
    accessorKey: "englishName",
    header: "Profile",
    enableColumnFilter: true,
    meta: {
      label: "English Name",
      placeholder: "Enter title",
      variant: "text",
    },
    cell: ({ row }) => (
      <UserProfileCell
        avatar={row.original.avatar}
        name={row.original.englishName}
        title={row.original.email}
      />
    ),
  },
  {
    accessorKey: "khmerName",
    header: "Khmer Name",
  },
  {
    accessorKey: "currentAddress",
    header: "Current Address",
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
    accessorKey: "isPaid",
    header: "Payment Status",
    cell: ({ row }) => {
      const paid = row.original.isPaid;
      return (
        <span
          className={`inline-flex items-center rounded-sm px-2 py-1 text-sm ${
            paid ? "bg-[#E6F4EA] text-[#1E7D34]" : "bg-[#FFF4E5]text-[#B25E00]"
          }`}
        >
          {paid ? "Paid" : "Unpaid"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <EnrollmentCellAction data={row.original} />,
  },
];
