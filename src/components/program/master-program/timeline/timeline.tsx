"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import TimelineDataTable from "./data-table"; // your data table for timeline
import SimpleTimelineForm from "./timeline-modal1";

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
  {
    id: 4,
    title: "Writing Test",
    startDate: new Date("2024-08-25"),
  },
  {
    id: 5,
    title: "Course Training",
    startDate: new Date("2024-08-27"),
    endDate: new Date("2024-09-10"),
  },
  {
    id: 6,
    title: "Interview Test",
    startDate: new Date("2024-09-12"),
  },
  {
    id: 7,
    title: "Final Project",
    startDate: new Date("2024-09-15"),
    endDate: new Date("2024-09-17"),
  },
  {
    id: 8,
    title: "Final Result",
    startDate: new Date("2024-09-18"),
  },
  {
    id: 9,
    title: "Closing Day",
    startDate: new Date("2024-09-20"),
  },
  {
    id: 10,
    title: "Program Completion",
    startDate: new Date("2024-09-21"),
  },
];

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState(initialTimeline);
  const handleDateChange = (rowId: number, field: 'startDate' | 'endDate', date: Date) => {
  setTimelineData((prev) =>
    prev.map((row) =>
      row.id === rowId ? { ...row, [field]: date } : row
    )
  );
};

  // const [timelineData, setTimelineData] = useState(initialTimeline);
  // const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  // optional: memoized filtered data if needed
  const filteredData = useMemo(() => timelineData, [timelineData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Timeline</h1>
        <div>
          <Button onClick={() => setOpen(true)}>Create Timeline</Button>
          <SimpleTimelineForm open={open} onOpenChange={setOpen} />
        </div>
      </div>

      {/* Timeline Table */}
      <TimelineDataTable 
  data={filteredData} 
  handleDateChange={handleDateChange} 
/>

    </div>
  );
}
