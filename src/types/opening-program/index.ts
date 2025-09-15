export type openingProgramType = {
    programUuid:string;
    uuid:string;
    title: string;
    generation:number;  
    thumbnail:string;
    slug:string;
    originalFee:number;
    price:number;
    scholarship:number;
    duration:string;
    curriculumPdfUri:string;
    totalSlot: number;
    qrCodeUrl: string;
    // extra fields from backend
    telegramGroup: string;
    status: "OPEN" | "CLOSED" | "ARCHIVED";
    // image: string;
    // shortcourseimage:string; 
    // template?: string[];

    // optional fields (if backend adds them later)
    // description?: string;
    programType: string;
    visibility: "public" | "private";
    activities?: ActivityDataType[];
    timeline?: timeline[];
    classes?: Classes[];
   
}

export type openingProgramCreate = {
    programUuid:string
    title: string;
    generation?:number;  
    thumbnail:string;
    slug?:string;
    originalFee?:number;
    price?:number;
    scholarship?:number;
    duration?:string;
    curriculumPdfUri?:string;
    totalSlot: number;
    qrCodeUrl?: string;
    // extra fields from backend
    telegramGroup?: string;
    status?: "OPEN" | "CLOSED" | "ARCHIVED";
    // image: string;
    // shortcourseimage:string; 
    // template?: string[];

    // optional fields (if backend adds them later)
    // description?: string;
    programType?: string;
    visibility?: "public" | "private";
    activities?: ActivityDataType[];
    timeline?: timeline[];
    classes?: Classes[];
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