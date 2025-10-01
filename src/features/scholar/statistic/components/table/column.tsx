"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Scholar } from "@/types/scholar";
import { ColumnDef } from "@tanstack/react-table";
import ScholarCellAction from "./cell-action";
import { formatTitle } from "@/utils/formatTitle";
import { Option } from "@/types/data-table";

export const scholarColumns = (
  provinceOptions: Option[]
): ColumnDef<Scholar>[] => [
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
    header: "English Name",
    enableColumnFilter: true,
    filterFn: "includesString",
    meta: {
      label: "English Name",
      placeholder: "Search names...",
      variant: "text",
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.original.englishName}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Active", value: "Active" },
        { label: "Graduated", value: "Graduated" },
        { label: "Suspended", value: "Suspended" },
        { label: "Dropped", value: "Dropped" },
      ],
    },
    cell: ({ row }) => {
      const status = row.original.status;

      const statusColors = {
        ACTIVE: { bg: "bg-[#E6F4EA]", text: "text-[#1E7D34]" },
        GRADUATED: { bg: "bg-[#E8F0FE]", text: "text-[#1A4DB3]" },
        SUSPENDED: { bg: "bg-[#FFF4E5]", text: "text-[#B25E00]" },
        DROPPED: { bg: "bg-[#FDECEC]", text: "text-[#B32121]" },
      } as const;

      const key = status as unknown as keyof typeof statusColors;

      return (
        <span
          className={`inline-flex items-center rounded-sm px-2 py-1 text-sm ${statusColors[key].bg} ${statusColors[key].text}`}
        >
          {formatTitle(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "university",
    header: "University",
    enableColumnFilter: true,
    meta: {
      label: "University",
      placeholder: "Search universities...",
      variant: "text",
    },
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.university}>
        {row.original.university}
      </div>
    ),
  },
  {
    accessorKey: "province",
    header: "Province",
    enableColumnFilter: true,
    meta: {
      label: "Province",
      variant: "select",
      options: provinceOptions,
    },
    cell: ({ row }) => <span>{row.original.province}</span>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <ScholarCellAction data={row.original} />,
  },
];
