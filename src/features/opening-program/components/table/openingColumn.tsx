// import { ColumnDef } from "@tanstack/react-table";
// import { openingProgramType } from "@/types/opening-program";
// import { OpeningActionsCell } from "./opening-action-cell";
// import { programData } from "@/data/programData";
// import { buildUniqueOptions } from "@/components/program/utils/buildUniqueOptions";
// import { formatTitle } from "@/utils/formatTitle";

// const allOpeningPrograms = programData.flatMap(p=>p.openingprogram);

// const programTypeOptions = buildUniqueOptions(allOpeningPrograms, op =>op.programType)
// const generationOptions = buildUniqueOptions(allOpeningPrograms, gen => gen.generation)
// const visibilitOptions = buildUniqueOptions(allOpeningPrograms, vs=>vs.visibility)

// // Build unique program type options from all openingprogram items
// // const programTypeOptions = Array.from(
// //   new Set(programData.flatMap((item) => item.openingprogram.map((p) => p.programType)))
// // ).map((type) => ({ label: type, value: type }));

// // const generationOptions = Array.from(
// //   new Set(programData.flatMap((item) => item.openingprogram.map((g) => g.generation)))
// // ).map((types) => ({label:types,value:types}));

// export const openingProgramColumns: ColumnDef<openingProgramType>[] = [
//   { accessorKey: "id", header: "ID" },

//   {
//     accessorKey: "title",
//     header: "Program Name",
//     enableColumnFilter: true,
//     meta: {
//       variant: "text",
//       placeholder: "Enter title...",
//       label: "Program Title",
//     },
//   },

//   {
//     accessorKey: "programType",
//     header: "Program Type",
//     enableColumnFilter: true,
//     meta: {
//       variant: "select",
//       placeholder: "Filter Program type",
//       label: "Program Type",
//       options: programTypeOptions,
//     },
//   },

// {
//   accessorKey: "generation",
//   header: "Generation",
//   enableColumnFilter: true,
//   filterFn: (row, columnId, filterValue) => {
//     // Compare as numbers
//     return row.getValue<number>(columnId) === Number(filterValue);
//   },
//   meta: {
//     variant: "select",
//     placeholder: "Filter Generation",
//     label: "Generation",
//     options: generationOptions,
//   },
// }
// ,

//   {
//     id: "totalSlots",
//     header: "Total Slots",
//     cell: ({ row }) =>
//       row.original.classes.reduce((sum, cls) => sum + cls.totalSlots, 0),
//   },

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

//   {
//     id: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const timeline = row.original.timeline;
//       if (!timeline || timeline.length === 0) return "N/A";

//       const today = new Date();
//       const firstDate = new Date(timeline[0].date);
//       const lastDate = new Date(timeline[timeline.length - 1].date);

//       let status = "";
//       if (today < firstDate) status = "Upcoming";
//       else if (today > lastDate) status = "Active";
//       else status = "Ongoing";

//       const bgClass =
//         status === "Upcoming"
//           ? "bg-blue-500 text-white"
//           : status === "Ongoing"
//           ? "bg-yellow-400 text-white"
//           : "bg-[#E6F4EA] text-[#1E7D34]"; // Active

//       return (
//           <span className={`${bgClass} inline-flex items-center rounded-sm px-2 py-1 text-sm`}>{formatTitle(status)}</span>
//       );
//     },
//   },

//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => <OpeningActionsCell openingprogram={row.original} />,
//   },
// ];
