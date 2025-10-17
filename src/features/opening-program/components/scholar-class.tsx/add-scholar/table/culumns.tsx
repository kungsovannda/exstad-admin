import { Checkbox } from "@/components/ui/checkbox";
import { UserProfileCell } from "@/features/enrollment/components/table/user-profile-cell";
import { Scholar } from "@/types/scholar";
import { ColumnDef } from "@tanstack/react-table";
import ScholarClassActionsCell from "./cell-action";

export const addScholarClassColumns = (
  handleAddScholar: (scholar: Scholar) => void,
  isAdding: boolean,
  scholarsClass: { scholarUuid: string }[] = [] 

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
    size: 50,
  },
  {
    accessorKey: "englishName",
    header: "Profile",
      enableColumnFilter:true,
      meta:{
        variant:"text",
        placeholder:"Search by name",
        label:"Search"
      },
    size: 500,
    cell: ({ row }) => (
      <UserProfileCell
        avatar={row.original.avatar}
        name={row.original.englishName}
        title={row.original.email}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    size: 100,
    cell: ({ row }) => {
      const isAlreadyAdded = scholarsClass.some(
        (sc) => sc.scholarUuid === row.original.uuid
      );

      return (
        <ScholarClassActionsCell
          data={row.original}
          onAddScholar={handleAddScholar}
          isLoading={isAdding}
          isAlreadyAdded={isAlreadyAdded} 
        />
      );
    },
  }
]
};
