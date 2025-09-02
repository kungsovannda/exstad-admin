export type openingProgramType = {
    id: number;
    title: string;
    generation:number;
    description: string;
    image: string;
    shortcourseimage:string;
    qrimage: string;
    activities: ActivityDataType[];
    timeline: timeline[];
    classes:Classes[];

}

export type ActivityType = {
    id:number;
    title:string;
    description:string;
    image:string;
}
export type ActivityDataType = {
    id:number;
    title:string;
    activityType:ActivityType[];
}

export type timeline = {
  id: number;
  date: string;
  title: string;
};


export type Classes = {
    id:number;
    title:string;
    shift:string;
    isWeekend:boolean;
    totalSlots:number;
}

// export type RoadmapType = {

// }