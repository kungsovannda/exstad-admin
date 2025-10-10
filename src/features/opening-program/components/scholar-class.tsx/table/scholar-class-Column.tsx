import { buildUniqueOptions } from "@/components/program/utils/buildUniqueOptions";
import {
  ScholarClassType
} from "@/types/opening-program";
import { ColumnDef } from "@tanstack/react-table";
import ScholarClassActionsCell from "./scholar-class-cell";
import UpdatePaidScholarClassAction from "./update-paid-action";
import UpdateRemindScholarAction from "./update-remind-action";


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
  cell: ({ row }) => <UpdatePaidScholarClassAction scholar={row.original} />,
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
      id: "actions",
      header: "Actions",
      cell: ({ row, table }) => (
        <ScholarClassActionsCell
          scholarClass={row.original}
          existingScholars={table
            .getRowModel()
            .rows.map((r) => r.original.scholar.uuid)}
          onEdit={actions?.onEdit}
          onDelete={actions?.onDelete}
        />
      ),
    },
  ];
};
