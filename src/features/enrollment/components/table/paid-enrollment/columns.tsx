import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Option } from "@/types/data-table";
import { Enrollment } from "@/types/enrollment/index";
import { ColumnDef } from "@tanstack/react-table";
import { UserProfileCell } from "../user-profile-cell";
import PaidEnrollmentCellAction from "./cell-action";

export const paidEnrollmentColumns = (
  currentAddressOptions: Option[],
  isShortCourse: boolean = false
): ColumnDef<Enrollment>[] => {
  const baseColumns: ColumnDef<Enrollment>[] = [
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
  ];

  // Only add Interview column if NOT short course
  if (!isShortCourse) {
    baseColumns.push({
      accessorKey: "isInterviewed",
      header: "Interview",
      enableColumnFilter: true,
      meta: {
        variant: "boolean",
        label: "Interviewed",
      },
      filterFn: "equals",
      cell: ({ row }) =>
        row.original.isInterviewed ? (
          <Badge className="border-transparent bg-primary">Interviewed</Badge>
        ) : (
          <Badge variant="outline">Pending</Badge>
        ),
    });
  }

  // Add actions column at the end
  baseColumns.push({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <PaidEnrollmentCellAction data={row.original} />,
  });

  return baseColumns;
};
