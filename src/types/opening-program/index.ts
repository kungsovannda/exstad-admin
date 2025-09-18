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
    activities?: ActivityType[];
    timeline?: TimelineType[];
    classes?: ClassType[];
   
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
    programType?: string;
    visibility?: "public" | "private";
    activities?: ActivityType[];
    timeline?: TimelineType[];
    classes?: ClassType[];
}

export type ActivityType = {
    title:string;
    description:string;
    image:string;
}

export type TimelineType = {
  title:string;
  startDate:string;
  endDate:string;
_clientId: string; // 🔑 local unique id

};

export type ClassPayload = {
  openingProgramUuid: string;
  shift: "MORNING" | "AFTERNOON" | "EVENING";
  instructor: string;
  startTime: string;  // HH:mm:ss
  endTime: string;    // HH:mm:ss
  isWeekend: boolean;
  totalSlot: number;
  room: string;
  classCode: string;
  telegram: string;
};

export type ClassType = {
    uuid:string;
    shift:string;
    instructor:string;
    startTime:string;
    endTime:string;
    isWeekend:boolean;
    totalSlot:number;
    room:string;
    classCode:string;
    telegram:string
}
export type ClassCreate = {
    // openingProgramUuid:string;
    shift:string;
    instructor:string;
    startTime:string;
    endTime:string;
    isWeekend:boolean;
    totalSlot:number;
    room:string;
    classCode:string;
    telegram:string;
}



// export type RoadmapType = {

// }