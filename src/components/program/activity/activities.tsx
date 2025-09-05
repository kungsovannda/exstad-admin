"use client";
import { programData } from "@/data/programData";
import { activityColumns } from "./activityColumn";

import ActivityDataTable from "./data-table";
import ActivityFormModal from "./form-field";
// Flatten all activities
const allActivities = programData.flatMap(program =>
  program.openingprogram?.flatMap(op =>
    op.activities.flatMap(activityData =>
      activityData.activityType.map(act => ({
        id: act.id,
        activityGroup: activityData.title,
        subtitle: act.subtitle,
        description: act.description,
        image: act.image,
      }))
    )
  ) || []
);

export default function ActivityPage() {
  return (
    <div className=" space-y-6">
      <div className="flex justify-between items-center gap-10">
      <h1 className="text-3xl font-semibold">Activities</h1>
            <ActivityFormModal  />
          </div>
     <ActivityDataTable data={allActivities} columns={activityColumns} />
    </div>
  );
}
