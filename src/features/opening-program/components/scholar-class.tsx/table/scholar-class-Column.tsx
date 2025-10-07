import { ScholarClassType } from "@/types/opening-program";
import ScholarClassActionsCell from "./scholar-class-cell";
import { buildUniqueOptions } from "@/components/program/utils/buildUniqueOptions";
import { ColumnDef } from "@tanstack/react-table";

// Utility to map boolean to string for filters
const mapPaidStatus = (isPaid: boolean) => (isPaid ? "Paid" : "Unpaid");

export const ScholarClassColumns = (
  scholarClasses: ScholarClassType[],
  actions?: {
    onEdit?: (sc: ScholarClassType) => void;
    onDelete?: (sc: ScholarClassType) => void;
  }
): ColumnDef<ScholarClassType>[] => {
  const roomOptions = buildUniqueOptions(scholarClasses, (sc) => sc.room);
  const paymentStatusOptions = [
    { label: "Paid", value: "Paid" },
    { label: "Unpaid", value: "Unpaid" },
  ];

  return [
    {
      accessorKey: "scholarName",
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
        variant: "select",
        placeholder: "Select payment status...",
        label: "Payment Status",
        options: paymentStatusOptions,
      },
      cell: ({ row }) => mapPaidStatus(row.original.isPaid),
      filterFn: (row, columnId, filterValue) => {
        // Convert row boolean to string
        return mapPaidStatus(row.getValue(columnId) as boolean) === filterValue;
      },
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
      cell: ({ row }) => (row.original.isReminded ? "Yes" : "No"),
      filterFn: (row, columnId, filterValue) => {
        return (row.getValue(columnId) ? "Yes" : "No") === filterValue;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row, table }) => (
        <ScholarClassActionsCell
          scholarClass={row.original}
          existingScholars={table.getRowModel().rows.map(
            (r) => r.original.scholarUuid
          )}
          onEdit={actions?.onEdit}
          onDelete={actions?.onDelete}
        />
      ),
    },
  ];
};
