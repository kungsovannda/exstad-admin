"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import UserCellAction from "./cell-action";

export const userColumns: ColumnDef<User>[] = [
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
    accessorKey: "username",
    header: "Username",
  },

  {
    accessorKey: "englishName",
    header: "English Name",
    enableColumnFilter: true,
    filterFn: "includesString",
    meta: {
      label: "English Name",
      placeholder: "Search names...",
      variant: "text",
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    enableColumnFilter: true,
    meta: {
      label: "Gender",
      variant: "multiSelect",
      options: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" },
      ],
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    enableColumnFilter: true,
  },
  {
    accessorKey: "role",
    header: "Role",
    enableColumnFilter: true,
    meta: {
      label: "Role",
      variant: "select",
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Instructor I", value: "INSTRUCTOR1" },
        { label: "Instructor II", value: "INSTRUCTOR2" },
      ],
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <UserCellAction data={row.original} />,
  },
];
