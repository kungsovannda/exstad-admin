  import { Button } from "@/components/ui/button";
  import { Scholar } from "@/types/scholar";
  import { Checkbox } from "@/components/ui/checkbox";
  import { UserProfileCell } from "@/features/enrollment/components/table/user-profile-cell";
  import { ColumnDef } from "@tanstack/react-table";

  export const addScholarClassCulumns = (
    onAddScholar: (scholarUuid: string) => void,
    scholarsClass: { scholarUuid: string }[]

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
      header: "Profile",
      enableColumnFilter:true,
      meta:{
        variant:"text",
        placeholder:"Search by name",
        label:"Search"
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
      id: "actions",
      header: "Actions",
      
      cell: ({ row }) => {
        const isAlreadyAdded = scholarsClass.some(
          (s) => s.scholarUuid === row.original.uuid
        );

        return (
          <Button
            variant="outline"
            disabled={isAlreadyAdded}
            onClick={() => !isAlreadyAdded && onAddScholar(row.original.uuid)}
          >
            {isAlreadyAdded ? "Added" : "Add"}
          </Button>
        );
      },
    },
  ];
