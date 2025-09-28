import { ColumnDef } from "@tanstack/react-table";
import { MasterProgramType } from "@/types/program";
import { ArrowUpDown } from "lucide-react";
import { MasterActionsCell } from "./action-cell";
import { buildUniqueOptions } from "@/components/program/utils/buildUniqueOptions";

//   const allMasterPrograms = programData;
//   const visibilitOptions = buildUniqueOptions(allMasterPrograms,mp => mp.visibility )
//   const programTypeOptions = buildUniqueOptions(allMasterPrograms,mp=> mp.programType)

// type Option = { label: string; value: string };

// // Build unique level options
// const getProgramLevel = (): Option[] => {
//   const levels = programData.map((p) => ({
//     value: p.programLevel,
//     label: p.programLevel,
//   }));

//   // Remove duplicates by value
//   const uniqueLevels = Array.from(
//     new Map(levels.map((item) => [item.value, item])).values()
//   );

//   return uniqueLevels;
// };

// export const masterProgramColumns: ColumnDef<programType>[] = [
//   {
//     id: "title",
//     accessorKey: "title",
//     enableColumnFilter: true,
//     meta: {
//       variant: "text",
//       placeholder: "Enter title...",
//       label: "Program Title"
//     },
//     header: ({ column }) => (
//       <span
//         className="flex items-center cursor-pointer"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Title <ArrowUpDown className="ml-2 h-3 w-3" />
//       </span>
//     ),
//   },
//   {
//     accessorKey: "programType",
//     header: "Type" ,
//         enableColumnFilter: true,

//      meta: {
//       variant: "select",
//       placeholder: "Filter program type",
//       label:"Program Type",
//       options:programTypeOptions,
//    },
//   },
//   {
//     accessorKey: "programLevel",
//     header: "Level",
//     enableColumnFilter: true,
//     meta: {
//       variant: "select",
//       placeholder: "Filter level",
//       label:"Program Level",
//       options: getProgramLevel()
//    },
//   },
//   {
//     accessorKey: "slug",
//     header: "Slug",
//   },
//    {
//     accessorKey: "description",
//     header: "Description",
//   },
//   // { accessorKey: "price", header: "Price" },

//   // {
//   //   accessorKey: "visibility",
//   //   header: "Visibility",
//   //   enableColumnFilter:true,
//   //   meta:{
//   //     variant:"select",
//   //     placeholder:"Filter visibility",
//   //     label:"Visibility",
//   //     options:visibilitOptions,
//   //   },
//   //   cell: ({ row }) => {
//   //     const visibility = row.original.visibility;
//   //     const bgClass =
//   //       visibility === "public" ? "bg-[#E6F4EA] text-[#1E7D34]"  :  "bg-[#FDECEC] text-[#B32121]";
//   //     return (
//   //       <span className={`${bgClass} inline-flex items-center rounded-sm px-2 py-1 text-sm`}>
//   //         {formatTitle(visibility)}
//   //       </span>

//   //     );
//   //   },
//   // },

// //   {
// //   accessorKey: "status",
// //   header: "Status",

// //   cell: ({ row }) => {
// //     const status = row.original.status
// //     const bgClass =
// //       status === "active"
// //         ? "bg-[#E6F4EA] text-[#1E7D34]"
// //         : status === "draft"
// //         ? "bg-[#FDECEC] text-[#B32121]"
// //         : "bg-gray-500 text-white" // default for archived/others

// //     return (

// //         <span className={`${bgClass} inline-flex items-center rounded-sm px-2 py-1 text-sm`}>{formatTitle(status)}</span>
// //     )
// //   },
// // },

//   // { accessorKey: "duration", header: "Duration" },
// //   {
// //   accessorKey: "scholarship",
// //   header: "Scholarship (%)",
// //   cell: ({ row }) => {
// //     const value = row.original.scholarship;
// //     return <span>{value}%</span>;
// //   },
// // },

//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => <MasterActionsCell program={row.original} />,
//   },
// ];

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
    // Capitalize first letter
    return programType.charAt(0).toUpperCase() + programType.slice(1).toLowerCase();
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
    {
      accessorKey: "slug",
      header: "Slug",
    },
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
        const bgClass =
          visibility === "public"
            ? "bg-[#E6F4EA] text-[#1E7D34]"
            : "bg-[#FDECEC] text-[#B32121]";
        return (
          <span
            className={`${bgClass} inline-flex items-center rounded-sm px-2 py-1 text-sm`}
          >
            {visibility}
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
