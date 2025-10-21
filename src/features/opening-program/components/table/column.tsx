import { ColumnDef } from "@tanstack/react-table";
import { openingProgramType } from "@/types/opening-program";
import { OpeningActionsCell } from "./opening-action-cell";
import { buildUniqueOptions } from "@/components/utils/buildUniqueOptions";
import { Checkbox } from "@/components/ui/checkbox";
import { Option } from "@/types/data-table";

export const openingProgramColumns = (
  openingPrograms: openingProgramType[]
): ColumnDef<openingProgramType>[] => {
  const programTypeOptions = buildUniqueOptions(
    openingPrograms,
    (op) => op.programType
  );
  const generationOptions = buildUniqueOptions(
    openingPrograms,
    (gen) => gen.generation
  );
  // const visibilitOptions = buildUniqueOptions(
  //   openingPrograms,
  //   (vs) => vs.visibility
  // );
  const statusOptions = buildUniqueOptions(
    openingPrograms,
    (st) => st.status,
  )
  return [
    // { accessorKey: "uuid", header: "ID" },
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
      accessorKey: "title",
      header: "Opening Program Name",
      enableColumnFilter: true,
      meta: {
        variant: "text",
        placeholder: "Enter title...",
        label: "Program Title",
      },
    },

      // {
      //   accessorKey: "programType",
      //   header: "Program Type",
      //   enableColumnFilter: true,
      //   meta: {
      //     variant: "select",
      //     placeholder: "Filter Program type",
      //     label: "Program Type",
      //     options: programTypeOptions,
      //   },
      // },

    {
      accessorKey: "generation",
      header: "Generation",
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        // Compare as numbers
        return row.getValue<number>(columnId) === Number(filterValue);
      },
      meta: {
        variant: "select",
        placeholder: "Filter Generation",
        label: "Generation",
        options: generationOptions,
      },
    },
        {
      accessorKey:"duration",
      header:"Duration",
    },
    {
      accessorKey:"price",
      header:"Fee",
      cell: ({ getValue }) => `$${getValue<number>()?.toFixed(2)}`
    },  
      {
        accessorKey: "totalSlot",
        header: "Total Slots",
        
      },

    //   {
    //     accessorKey: "visibility",
    //     header: "Visibility",
    //     enableColumnFilter:true,
    //     meta:{
    //       variant:"select",
    //       placeholder:"Select visibility...",
    //       label:"Visibility",
    //       options:visibilitOptions,
    //     },
    //     cell: ({ row }) => {
    //       const visibility = row.original.visibility;
    //       const bgClass =
    //         visibility === "public"
    //           ? "bg-[#E6F4EA] text-[#1E7D34]"
    //           : "bg-[#FDECEC] text-[#B32121]";
    //       return (
    //           <span className={`${bgClass} inline-flex items-center rounded-sm px-2 py-1 text-sm`}>{formatTitle(visibility)}</span>
    //       );
    //     },
    //   },
    {
      accessorKey: "status",
      header: "Status",
      enableColumnFilter:true,
      meta:{
        variant: "select",
        placeholder: "Filter Status",
        label: "Status",
        options: statusOptions,
      },
      cell: ({ row }) => {
        const status = row.original.status; // 👈 directly from backend
        if (!status) return "N/A";
            const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        const bgClass =
          status === "CLOSED"
            ? "bg-[#FDECEC] text-[#B32121]"
            : status === "ACHIEVED"
            ? "bg-yellow-400 text-white"
            : "bg-[#E6F4EA] text-[#1E7D34]"; // Active
        return (
          <span
            className={`${bgClass} inline-flex items-center rounded-sm px-2 py-1 text-sm`}
          >
        {formattedStatus}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <OpeningActionsCell openingprogram={row.original} />,
    },  
  ];
};

// Build unique program type options from all openingprogram items
// const programTypeOptions = Array.from(
//   new Set(programData.flatMap((item) => item.openingprogram.map((p) => p.programType)))
// ).map((type) => ({ label: type, value: type }));

// const generationOptions = Array.from(
//   new Set(programData.flatMap((item) => item.openingprogram.map((g) => g.generation)))
// ).map((types) => ({label:types,value:types}));
