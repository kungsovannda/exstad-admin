"use client";

import { ColumnDef } from "@tanstack/react-table";
import { openingProgramType } from "@/types/opening-program";
import { OpeningActionsCell } from "@/components/program/opening-program/action-cell";

export const openingProgramColumns: ColumnDef<openingProgramType>[] = [
  {accessorKey: "id", header: "ID",  },
  {accessorKey: "title",header: "Program Name"},
  {accessorKey: "programType",header: "Program Type", },
  {accessorKey: "generation",header: "Generation", },

  {id: "totalSlots",header: "Total Slots",cell: ({ row }) =>  row.original.classes.reduce((sum, cls) => sum + cls.totalSlots, 0),},
   { accessorKey: "visibility", header: "Visibility",
    cell: ({ row }) => {
      const visibility = row.original.visibility;
      const bgClass =
        visibility === "public" ? "bg-[#1E7D34] text-white" : "bg-[#B32121] text-white";
      return (
         <div className={`${bgClass} rounded-[8px] flex items-center justify-center w-[70px] h-[30px] `}>
        <span className={` px-2 py-1   text-sm`}>
          {visibility}
        </span>
     </div>
      ); 
    },
  },
  {
  id: "status",
  header: "Status",
  cell: ({ row }) => {
    const today = new Date();
    const firstDate = new Date(row.original.timeline[0].date);
    const lastDate = new Date(row.original.timeline[row.original.timeline.length - 1].date);

    let status = "";
    if (today < firstDate) status = "Upcoming";
    else if (today > lastDate) status = "Active";
    else status = "Ongoing";

    // Set background color based on status
    const bgClass =
      status === "Upcoming"
        ? "bg-blue-500 text-white"
        : status === "Ongoing"
        ? "bg-yellow-400 text-white"
        : "bg-[#1E7D34] text-white"; // Active

    return (
      <div
        className={`${bgClass} rounded-[8px] flex items-center justify-center w-[80px] h-[30px]`}
      >
        <span className="text-sm px-2 py-1">{status}</span>
      </div>
    );
  },
},
  {id: "actions",header: "Actions",cell: ({ row }) => <OpeningActionsCell openingprogram={row.original} />,},
];
