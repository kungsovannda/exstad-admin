"use client";

import { useState} from "react";
import { Button } from "@/components/ui/button";
import SimpleTimelineForm from "./timeline-modal1";
import TimelineTable from "@/features/opening-program/components/table/timeline/timeline-table";
export default function TimelinePage() {
  // const [timelineData, setTimelineData] = useState(initialTimeline);
  // const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  // optional: memoized filtered data if needed

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Timeline</h1>
        <div>
          <Button onClick={() => setOpen(true)}>Create Timeline</Button>
          <SimpleTimelineForm
            open={open}
            onOpenChange={setOpen}
            onSubmit={(data) => {
              console.log("Timeline submitted:", data);
              // Here you can add to state or call your API
              setOpen(false);
            }}
          />
        </div>
      </div>
      <TimelineTable />
    </div>
  );
}
