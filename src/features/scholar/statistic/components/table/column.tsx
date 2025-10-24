"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Scholar } from "@/types/scholar";
import { formatTitle } from "@/utils/formatTitle";
import { ColumnDef } from "@tanstack/react-table";
import ScholarCellAction from "./cell-action";
import { Option } from "@/types/data-table";
import { UserProfileCell } from "@/features/enrollment/components/table/user-profile-cell";
import { Badge } from "@/components/ui/badge";

export const ScholarColumns = (
  provinceOptions: Option[],
  universityOptions: Option[],
  addressOptions: Option[]
): ColumnDef<Scholar>[] => {
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
      accessorKey: "englishName",
      header: "Profile",
      enableColumnFilter: true,
      meta: {
        label: "English Name",
        placeholder: "Enter name",
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
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.khmerName}>
          {row.original.khmerName}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      enableColumnFilter: true,
      meta: {
        label: "Gender",
        variant: "select",
        options: [
          { label: "Male", value: "MALE" },
          { label: "Female", value: "FEMALE" },
          { label: "Other", value: "OTHER" },
        ],
      },
      cell: ({ row }) => formatTitle(row.original.gender),
    },
    {
      accessorKey: "dob",
      header: "Date of Birth",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const date = new Date(row.original.dob);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableColumnFilter: true,
      meta: {
        label: "Status",
        variant: "select",
        options: [
          { label: "Active", value: "ACTIVE" },
          { label: "Graduated", value: "GRADUATED" },
          { label: "Suspended", value: "SUSPENDED" },
          { label: "Dropped", value: "DROPPED" },
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

        const key = status?.toUpperCase() as keyof typeof statusColors;
        const color = statusColors[key] ?? {
          bg: "bg-gray-100",
          text: "text-gray-800",
        };

        return (
          <span
            className={`inline-flex items-center rounded-sm px-2 py-1 text-sm ${color.bg} ${color.text}`}
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
      filterFn: "includesString",
      meta: {
        label: "University",
        variant: "select",
        options: universityOptions,
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
      filterFn: "includesString",
      meta: {
        label: "Province",
        variant: "select",
        options: provinceOptions,
      },
      cell: ({ row }) => <span>{row.original.province}</span>,
    },
    {
      accessorKey: "currentAddress",
      header: "Address",
      enableColumnFilter: true,
      meta: {
        label: "Address",
        placeholder: "Search address...",
        variant: "multiSelect",
        options: addressOptions,
      },
      cell: ({ row }) => (
        <div
          className="max-w-[200px] truncate"
          title={row.original.currentAddress}
        >
          {row.original.currentAddress}
        </div>
      ),
    },
    {
      accessorKey: "isAbroad",
      header: "Abroad",
      enableColumnFilter: true,
      meta: {
        label: "Abroad",
        variant: "boolean",
      },
      cell: ({ row }) => (
        <Badge variant={row.original.isAbroad ? "default" : "secondary"}>
          {row.original.isAbroad ? "Abroad" : "Local"}
        </Badge>
      ),
    },
    {
      accessorKey: "isEmployed",
      header: "Employment",
      enableColumnFilter: true,
      meta: {
        label: "Employment",
        variant: "boolean",
      },
      cell: ({ row }) => (
        <Badge variant={row.original.isEmployed ? "default" : "secondary"}>
          {row.original.isEmployed ? "Employed" : "Unemployed"}
        </Badge>
      ),
    },

    {
      accessorKey: "completedCourses",
      header: "Courses",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.completedCourses.length || "0"}
        </span>
      ),
    },
    {
      accessorKey: "isPublic",
      header: "Visibility",
      enableColumnFilter: true,
      meta: {
        label: "Visibility",
        variant: "boolean",
      },
      cell: ({ row }) => (
        <Badge variant={row.original.isPublic ? "default" : "secondary"}>
          {row.original.isPublic ? "Public" : "Private"}
        </Badge>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => <ScholarCellAction data={row.original} />,
    },
  ];
};
