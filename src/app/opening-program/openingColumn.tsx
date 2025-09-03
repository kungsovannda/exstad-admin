"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { openingProgramType } from "@/types/openingProgramType";

export const openingProgramColumns: ColumnDef<openingProgramType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Program Name",
  },
  {
    accessorKey: "generation",
    header: "Generation",
  },
  {
    id: "totalSlots",
    header: "Total Slots",
    cell: ({ row }) =>
      row.original.classes.reduce((sum, cls) => sum + cls.totalSlots, 0),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const today = new Date();
      const firstDate = new Date(row.original.timeline[0].date);
      const lastDate = new Date(
        row.original.timeline[row.original.timeline.length - 1].date
      );

      if (today < firstDate) return "Upcoming";
      if (today > lastDate) return "Completed";
      return "Ongoing";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ }) => (
      <Button size="sm" variant="outline">
        View
      </Button>
    ),
  },
];
