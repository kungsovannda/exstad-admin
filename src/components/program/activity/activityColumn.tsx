"use client";

import { ActivityType } from "@/types/openingProgramType";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const activityColumns: ColumnDef<ActivityType>[] = [
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
          src={url} 
          alt="Activity" 
          className="h-12 w-12 object-cover rounded-md" 
        />
      ) : (
        <span className="text-gray-400">No image</span>
      );
    }
  },
];
