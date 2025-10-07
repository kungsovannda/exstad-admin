import { Achievement } from "@/types/achievement";
import { ColumnDef } from "@tanstack/react-table";
import AchievementCellAction from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { formatTitle } from "@/utils/formatTitle";
import { Badge } from "@/components/ui/badge";

export const achievementColumns: ColumnDef<Achievement>[] = [
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
    accessorKey: "icon",
    header: "ICON",
    cell: ({ row }) => {
      const icon = row.original.icon;
      return (
        <div className="flex border-1 border-primary/10 rounded-sm justify-center items-center aspect-square h-16">
          <Image
            src={icon}
            alt="Achievement Icon"
            width={44}
            height={44}
            unoptimized
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Achievement",
    enableColumnFilter: true,
    meta: {
      label: "Achievement Title",
      placeholder: "Enter title",
      variant: "text",
    },
  },
  {
    accessorKey: "tag",
    header: "TAG",
  },
  {
    accessorKey: "program",
    header: "Program",
    enableColumnFilter: true,
    meta: {
      variant: "select",
      label: "Filter Program",
      placeholder: "Filter Program",
      options: [
        {
          label: "Full Stack Development",
          value: "Full Stack Web Development",
        },
        { label: "Pre University", value: "Pre University" },
        { label: "Foundation", value: "Foundation" },
        { label: "IT Expert", value: "IT Expert" },
        { label: "IT Professional", value: "IT Professional" },
      ],
    },
  },
  {
    accessorKey: "achievementType",
    header: "Type",
    enableColumnFilter: true,
    meta: {
      variant: "select",
      label: "Achievement Type",
      options: [
        { label: "Mini Project", value: "MINI_PROJECT" },
        {
          label: "Final Project",
          value: "FINAL_PROJECT",
        },
      ],
    },
    cell: ({ row }) => {
      const type = row.original.achievementType;
      return <Badge>{formatTitle(type)}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <AchievementCellAction data={row.original} />,
  },
];
