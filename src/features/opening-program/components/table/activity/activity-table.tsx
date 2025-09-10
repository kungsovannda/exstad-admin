"use client";
import { programData } from "@/data/programData";
import { activityColumns } from "./activityColumn";
import { ActivityDataType,ActivityType } from "@/types/opening-program";
import { programType } from "@/types/program";
import { DefaultTableModel } from "@/components/table/default-table-model";

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

export default function ActivityTable() {
  return (
    <div >

     <DefaultTableModel data={allActivities} columns={activityColumns}  totalItems={allActivities.length}/>
    </div>
  );
}
