import { buildUniqueOptions } from "@/components/utils/buildUniqueOptions";
import { ScholarClassType } from "@/types/opening-program";
import { ColumnDef } from "@tanstack/react-table";
import ScholarClassActionsCell from "./scholar-class-cell";
import UpdatePaidScholarClassAction from "./update-paid-action";
import UpdateRemindScholarAction from "./update-remind-action";
import { Checkbox } from "@/components/ui/checkbox";

export const ScholarClassColumns = (
  scholarClasses: ScholarClassType[],
  actions?: {
    onEdit?: (sc: ScholarClassType) => void;
    onDelete?: (sc: ScholarClassType) => void;
    openingProgramUuid?: string; 
  }
): ColumnDef<ScholarClassType>[] => {
  const roomOptions = buildUniqueOptions(scholarClasses, (sc) => sc.room);
  const paymentStatusOptions = [
    { label: "Paid", value: "Paid" },
    { label: "Unpaid", value: "Unpaid" },
  ];
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
      accessorKey: "scholar.englishName",
      header: "Scholar Name",
      enableColumnFilter: true,
      meta: {
        variant: "text",
        placeholder: "Search scholar...",
        label: "Scholar Name",
      },
    },
    {
      accessorKey: "room",
      header: "Room",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        placeholder: "Select room...",
        label: "Room",
        options: roomOptions,
      },
    },
    {
      accessorKey: "isPaid",
      header: "Payment Status",
      enableColumnFilter: true,
      filterFn: "equalsString",
      meta: {
        variant: "select",
        placeholder: "Select payment status...",
        label: "Payment Status",
        options: paymentStatusOptions,
      },
      cell: ({ row }) => (
        <UpdatePaidScholarClassAction scholar={row.original} />
      ),
    },
    {
      accessorKey: "isReminded",
      header: "Is Reminded",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        placeholder: "Select reminder status...",
        label: "Reminded",
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      cell: ({ row }) => <UpdateRemindScholarAction scholar={row.original} />,

      filterFn: (row, columnId, filterValue) => {
        return (row.getValue(columnId) ? "Yes" : "No") === filterValue;
      },
    },
    {
      accessorKey: "completedCourses",
      header: "Completed Course",
      cell: ({ row }) => {
        const programUuid = actions?.openingProgramUuid; 
        const scholar = row.original.scholar;
        const isCompleted =
          typeof programUuid === "string" &&
          !!scholar?.completedCourses?.includes(programUuid);
        return (
          <div className="flex items-center gap-2">
            <Checkbox checked={isCompleted} disabled />
            <span>{isCompleted ? "Completed" : "Not Completed"}</span>
          </div>
        );
      },
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row, table }) => (
        <ScholarClassActionsCell
          scholarClass={row.original}
          existingScholars={table
            .getRowModel()
            .rows.filter((r) => r.original.scholar && r.original.scholar.uuid)
            .map((r) => r.original.scholar.uuid)}
          onEdit={actions?.onEdit}
          onDelete={actions?.onDelete}
        />
      ),
    },
  ];
};
