"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ActivityActionsCell } from "./activity-action-cell";
import { ActivityType } from "@/types/opening-program";
import { Checkbox } from "@/components/ui/checkbox";

export const ActivityColumns = (
  activities: ActivityType[],
  action?: { onEdit?: (a: ActivityType) => void; onDelete?: (a: ActivityType) => void }
): ColumnDef<ActivityType>[] => {
  return [
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
      id: "order",
      header: "#",
      cell: ({ row, table }) => table.getRowModel().rows.indexOf(row) + 1,
      size: 50,
    },
    { 
      accessorKey: "title", 
      header: "Title" ,
      enableColumnFilter:true,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => {
        const text = getValue<string>();
        return text.length > 40 ? text.slice(0, 40) + "..." : text;
      },
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ getValue }) => {
        const url = getValue<string>();
        return url ? (
          <Image
            unoptimized
            width={48}
            height={48}
            src={url}
            alt="Activity"
            className="h-12 w-12 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActivityActionsCell
          activities={row.original}
          onEdit={action?.onEdit}
          onDelete={action?.onDelete}
        />
      ),
    },
  ];
};
