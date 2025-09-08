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
    slug:string;
    programType: string; 
    visibility: "public" | "private";

}

export type ActivityType = {
    id:number;
    subtitle:string;
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
    instructor:string;
    startTime:Date;
    endTime:Date;
    isWeekend:boolean;
    totalSlots:number;
    room:string;
    classCode:string;
}

// export type RoadmapType = {

// }