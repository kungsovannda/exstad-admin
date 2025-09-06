"use client";
import { programData } from "@/data/programData";
import { activityColumns } from "./activityColumn";

import ActivityDataTable from "./data-table";
import ActivityFormModal from "./form-field";
import { ActivityDataType,openingProgramType,ActivityType } from "@/types/opening-program";
import { programType } from "@/types/program";
import { Button } from "@/components/ui/button";
import ActivityModal from "./form-field";
import { useState } from "react";

// Flatten all activities

export type FlattenedActivity = {
  id: number;
  activityGroup: string;  // comes from ActivityDataType.title
  subtitle: string;
  description: string;
  image: string;
};

const rawActivities: FlattenedActivity[] = programData.flatMap(
  (program: programType) =>
    program.openingprogram?.flatMap(op =>
      op.activities.flatMap((activityData: ActivityDataType) =>
        activityData.activityType.map<FlattenedActivity>((act: ActivityType) => ({
          id: act.id,
          activityGroup: activityData.title,
          subtitle: act.subtitle,
          description: act.description,
          image: act.image,
        }))
      )
    ) || []
);

// Deduplicate by id + group
const allActivities: FlattenedActivity[] = Array.from(
  new Map(rawActivities.map(act => [`${act.id}-${act.activityGroup}`, act])).values()
);

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
      <h1 className="text-3xl font-semibold">Activities</h1>
             <Button onClick={() => setOpen(true)}>Add Activity</Button>
<ActivityModal open={open} onOpenChange={setOpen} />

          </div>
     <ActivityDataTable data={allActivities} columns={activityColumns} />
    </div>
  );
}
