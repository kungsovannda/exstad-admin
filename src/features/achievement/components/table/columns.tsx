import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Achievement } from "@/types/achievement";
import { Option } from "@/types/data-table";
import { formatTitle } from "@/utils/formatTitle";
import { ColumnDef } from "@tanstack/react-table";
import AchievementCellAction from "./cell-action";

export const achievementColumns = (
  programOptions: Option[]
): ColumnDef<Achievement>[] => {
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
      accessorKey: "icon",
      header: "ICON",
      cell: ({ row }) => {
        const icon = row.original.icon;
        return (
          <div className="flex border-1 border-primary/10 rounded-sm justify-center items-center aspect-square h-16">
            <Avatar className="h-11 w-11">
              <AvatarImage
                className="rounded-lg object-cover"
                src={icon || "/placeholder.svg"}
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
        options: programOptions,
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
};
