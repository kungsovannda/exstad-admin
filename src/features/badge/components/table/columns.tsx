"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/types/badge";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import VerificationCellAction from "./cell-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const verificationColumns: ColumnDef<Badge>[] = [
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
    accessorKey: "badgeImage",
    header: "IMAGE",
    cell: ({ row }) => {
      return (
        <div className="flex border-1 border-primary/10 rounded-sm justify-center items-center aspect-square h-16">
          <Avatar className="h-11 w-11">
            <AvatarImage
              className="rounded-lg object-cover"
              src={row.original.badgeImage || "/placeholder.svg"}
              alt={row.original.title}
            />
            <AvatarFallback>
              {row.original.title
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Badge",
    enableColumnFilter: true,
    filterFn: "includesString",
    meta: {
      label: "Badge Title",
      placeholder: "Search titles...",
      variant: "text",
    },
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <VerificationCellAction data={row.original} />,
  },
];
