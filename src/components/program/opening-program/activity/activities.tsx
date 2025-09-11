"use client";
import { Button } from "@/components/ui/button";
import ActivityModal from "./acitivity-modal";
import { useState } from "react";
import ActivityTable from "@/features/opening-program/components/table/activity/activity-table";

// Flatten all activities



// Assume programData: openingProgramType[]
// const allActivities: FlattenedActivity[] = programData.flatMap((program: openingProgramType) =>
//   program.activities?.flatMap((op) =>
//     op.activityType.flatMap((activityData: ActivityDataType) =>
//       activityData.activityType.map<FlattenedActivity>((act: ActivityType) => ({
//         id: act.id,
//         activityGroup: activityData.title,
//         subtitle: act.subtitle,
//         description: act.description,
//         image: act.image,
//       }))
//     )
//   ) || []
// );

export default function ActivityPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className=" space-y-6">
      <div className="flex justify-between items-center gap-10">
        <h1 className="text-lg font-bold">Activities</h1>
        <Button onClick={() => setOpen(true)}>Add Activity</Button>
        <ActivityModal open={open} onOpenChange={setOpen} />
      </div>
      <ActivityTable />
    </div>
  );
}
