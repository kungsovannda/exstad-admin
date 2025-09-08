"use client";

import { ActivityType } from "@/types/opening-program";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ActivityActionsCell } from "./activity-action-cell";
import { ClassActionsCell } from "../class/class-action-cell";
import { FlattenedActivity } from "./activities";

export const activityColumns: ColumnDef<FlattenedActivity>[] = [
  {
    accessorKey: "activityGroup",
    header: "Activity Group",
  },
  {
    accessorKey: "subtitle",
    header: "Subtitle",
  },
  { 
    accessorKey: "description", 
    header: "Description",
    cell: ({ getValue }) => {
      const text = getValue<string>();
      return text.length > 40 ? text.slice(0, 40) + "..." : text;
    }
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
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActivityActionsCell ActivityData={row.original} />
    ),
  },
];
