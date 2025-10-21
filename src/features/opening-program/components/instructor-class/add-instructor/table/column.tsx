import { Checkbox } from "@/components/ui/checkbox";
import { UserProfileCell } from "@/features/enrollment/components/table/user-profile-cell";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import InstructorClassActionsCell from "./cell-action";

export const addInstructorClassColumns = (
  handleAddInstructor: (instructor: User) => void,
  isAdding: boolean,
  instructorClass: { instructorUuid: string }[] = [] 

): ColumnDef<User>[] => [
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
        avatar={row.original.avatar ?? ""}
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
      const isAlreadyAdded = instructorClass.some(
        (ic) => ic.instructorUuid === row.original.uuid
      );

      return (
        <InstructorClassActionsCell
          data={row.original}
          onAddInstructors={handleAddInstructor}
          isLoading={isAdding}
          isAlreadyAdded={isAlreadyAdded} 
        />
      );
    },
  }
];
