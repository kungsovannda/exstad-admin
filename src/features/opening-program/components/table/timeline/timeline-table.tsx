"use client";

import { TimelineColumns } from "./timelineColumn";
import { DefaultTableDnd } from "@/components/table/default-table-dnd";
import { TimelineRow } from "./timelineColumn";
import { useState, useMemo } from "react";

// Sample timeline data
const initialTimeline = [
  {
    id: 1,
    title: "Application Period",
    startDate: new Date("2024-08-01"),
    endDate: new Date("2024-08-12"),
  },
  {
    id: 2,
    title: "Orientation",
    startDate: new Date("2024-08-20"),
    endDate: new Date("2024-08-20"),
  },
  {
    id: 3,
    title: "Preliminary Learning",
    startDate: new Date("2024-08-13"),
    endDate: new Date("2024-08-19"),
  },
  { id: 4, title: "Writing Test", startDate: new Date("2024-08-25") },
  {
    id: 5,
    title: "Course Training",
    startDate: new Date("2024-08-27"),
    endDate: new Date("2024-09-10"),
  },
  { id: 6, title: "Interview Test", startDate: new Date("2024-09-12") },
  {
    id: 7,
    title: "Final Project",
    startDate: new Date("2024-09-15"),
    endDate: new Date("2024-09-17"),
  },
  { id: 8, title: "Final Result", startDate: new Date("2024-09-18") },
  { id: 9, title: "Closing Day", startDate: new Date("2024-09-20") },
  { id: 10, title: "Program Completion", startDate: new Date("2024-09-21") },
];

export default function TimelineTable() {
  const [timelineData, setTimelineData] = useState<TimelineRow[]>(initialTimeline);


  const handleDateChange = (
    rowId: number,
    field: "startDate" | "endDate",
    date: Date
  ) => {
    setTimelineData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: date } : row))
    );
  };

  const handleDelete = (rowId: number) => {
    setTimelineData((prev) => prev.filter((row) => row.id !== rowId));
  };
  const filteredData = useMemo(() => timelineData, [timelineData]);

  return (
    <div>
      {/* Call TimelineColumns as a function */}
      <DefaultTableDnd
        columns={TimelineColumns(handleDateChange, handleDelete)}
        data={filteredData}
        getRowId={(row) => String(row.id)} // <-- make sure it's a string
          onReorder={(newData) => setTimelineData(newData)} // 🔑 parent owns state

      />
    </div>
  );
}
