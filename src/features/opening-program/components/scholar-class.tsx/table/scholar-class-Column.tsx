import { buildUniqueOptions } from "@/components/utils/buildUniqueOptions";
import { ScholarClassType } from "@/types/opening-program";
import { ColumnDef } from "@tanstack/react-table";
import ScholarClassActionsCell from "./scholar-class-cell";
import UpdatePaidScholarClassAction from "./update-paid-action";
import UpdateRemindScholarAction from "./update-remind-action";
import { Checkbox } from "@/components/ui/checkbox";
import UpdateCompleteScholarClassAction from "./update-complete-action";

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
      meta: {
        variant: "boolean",
        label: "Payment Status",
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
        variant: "boolean",
        label: "Reminded",
      },
      cell: ({ row }) => <UpdateRemindScholarAction scholar={row.original} />,
    },
    {
      accessorKey: "completedCourses",
      header: "Completed Course",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        placeholder: "Select complete course...",
        label: "Complete Course",
        options: [
          { label: "Completed", value: "Completed" },
          { label: "Not Completed", value: "Not Completed" },
        ],
      },
      cell: ({ row }) => {
        const scholar = row.original.scholar;
        const programUuid = actions?.openingProgramUuid;
        if (!programUuid) return null;

        return (
          <UpdateCompleteScholarClassAction
            scholar={scholar}
            openingProgramUuid={programUuid}
          />
        );
      },
      enableSorting: true,
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
