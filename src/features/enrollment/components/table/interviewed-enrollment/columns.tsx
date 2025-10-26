import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Option } from "@/types/data-table";
import { Enrollment } from "@/types/enrollment/index";
import { ColumnDef } from "@tanstack/react-table";
import { UserProfileCell } from "../user-profile-cell";
import InterviewedEnrollmentCellAction from "./cell-action";

export const interviewedEnrollmentColumns = (
  currentAddressOptions: Option[]
): ColumnDef<Enrollment>[] => {
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
    },
    {
      accessorKey: "_class.classCode",
      header: "Class",
      enableColumnFilter: true,
      meta: {
        variant: "text",
        label: "Class",
        placeholder: "Filter by class",
      },
    },
    {
      accessorKey: "currentAddress",
      header: "Address",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        label: "Address",
        placeholder: "Filter Address",
        options: currentAddressOptions,
      },
    },
    {
      accessorKey: "university",
      header: "University",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-medium">
          ${row.original.amount.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "isScholar",
      header: "Scholar",
      enableColumnFilter: true,
      meta: {
        variant: "boolean",
        label: "Scholar",
      },
      filterFn: "equals",
      cell: ({ row }) =>
        row.original.isScholar ? (
          <Badge variant="secondary">Scholar</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      accessorKey: "isPassed",
      header: "Status",
      enableColumnFilter: true,
      meta: {
        variant: "boolean",
        label: "Passed",
      },
      filterFn: "equals",
      cell: ({ row }) =>
        row.original.isPassed ? (
          <Badge className="border-transparent bg-chart-1">Passed</Badge>
        ) : (
          <Badge variant="outline">Pending</Badge>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <InterviewedEnrollmentCellAction data={row.original} />
      ),
    },
  ];
};
