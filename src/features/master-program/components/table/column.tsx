import { ColumnDef } from "@tanstack/react-table";
import { MasterProgramType } from "@/types/program";
import { ArrowUpDown } from "lucide-react";
import { MasterActionsCell } from "./action-cell";
import { buildUniqueOptions } from "@/components/utils/buildUniqueOptions";
import { Checkbox } from "@/components/ui/checkbox";

export const masterProgramColumns = (
  programs: MasterProgramType[]
): ColumnDef<MasterProgramType>[] => {
  const visibilityOptions = buildUniqueOptions(programs, (mp) => mp.visibility);
  const programTypeOptions = buildUniqueOptions(
    programs,
    (mp) => mp.programType
  );
  const programLevelOptions = buildUniqueOptions(
    programs,
    (mp) => mp.programLevel
  );

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
      id: "title",
      accessorKey: "title",
      enableColumnFilter: true,
      meta: {
        variant: "text",
        placeholder: "Enter title...",
        label: "Program Title",
      },
      header: ({ column }) => (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title <ArrowUpDown className="ml-2 h-3 w-3" />
        </span>
      ),
    },
    {
      accessorKey: "programType",
      header: "Program Type",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        placeholder: "Filter program type",
        label: "Program Type",
        options: programTypeOptions,
      },
      cell: ({ getValue }) => {
        const programType = getValue<string>();

        if (!programType) return "-";

        // Convert "Short_course" -> "Short Course"
        const formatted = programType
          .split("_")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        return formatted;
      },
    },
    {
      accessorKey: "programLevel",
      header: "Level",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        placeholder: "Filter level",
        label: "Program Level",
        options: programLevelOptions,
      },
      cell: ({ getValue }) => {
        const level = getValue<string>();
        // Capitalize first letter
        return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const desc = row.original.description || "";
        const maxLength = 80;
        const shortDesc =
          desc.length > maxLength ? desc.substring(0, maxLength) + "..." : desc;
        return (
          <span title={desc} className="block max-w-xs truncate">
            {shortDesc}
          </span>
        );
      },
    },
    // {
    //   accessorKey: "slug",
    //   header: "Slug",
    // },
    //  {
    //   accessorKey: "status",
    //   header: "Status",
    //   enableColumnFilter:true,
    //   meta:{
    //     variant: "select",
    //     placeholder: "Filter Status",
    //     label: "Status",
    //     options: statusOptions,
    //   },
    //   cell: ({ row }) => {
    //     const status = row.original.status; // 👈 directly from backend
    //     if (!status) return "N/A";
    //         const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    //     const bgClass =
    //       status === "CLOSED"
    //         ? "bg-[#FDECEC] text-[#B32121]"
    //         : status === "ACHIEVED"
    //         ? "bg-yellow-400 text-white"
    //         : "bg-[#E6F4EA] text-[#1E7D34]"; // Active

    //     return (
    //       <span
    //         className={`${bgClass} inline-flex items-center rounded-sm px-2 py-1 text-sm`}
    //       >
    //     {formattedStatus}
    //       </span>
    //     );
    //   },
    // },
    {
      accessorKey: "visibility",
      header: "Visibility",
      enableColumnFilter: true,
      meta: {
        variant: "select",
        placeholder: "Filter visibility",
        label: "Visibility",
        options: visibilityOptions,
      },
      cell: ({ row }) => {
        const visibility = row.original.visibility;
        const formattedVisibility = visibility
          ? visibility.charAt(0).toUpperCase() +
            visibility.slice(1).toLowerCase()
          : "Unknown";

        const bgClass =
          visibility === "PUBLIC"
            ? "bg-[#E6F4EA] text-[#1E7D34]"
            : visibility === "PRIVATE"
            ? "bg-[#FDECEC] text-[#B32121]"
            : "bg-gray-100 text-gray-500"; // fallback style for null/undefined

        return (
          <span
            className={`${bgClass} inline-flex items-center rounded-sm px-2 py-1 text-sm`}
          >
            {formattedVisibility}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <MasterActionsCell program={row.original} />,
    },
  ];
};
