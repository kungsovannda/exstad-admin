import { Audit } from "..";

export type openingProgramType = {
  programName: string;
  programUuid: string;
  uuid: string;
  title: string;
  generation: number;
  posterUrl:string;
  thumbnail: string;
  slug: string;
  originalFee: number;
  price: number;
  scholarship: number;
  duration: string;
  deadline: string;
  curriculumPdfUri: string;
  totalSlot: number;
  qrCodeUrl: string;
  // extra fields from backend
  telegramGroup: string;
  status: "OPEN" | "CLOSED" | "ACHIEVED" |"PENDING";
  // image: string;
  // shortcourseimage:string;
  // template?: string[];

  // optional fields (if backend adds them later)
  // description?: string;
  programType: string;
  // templates?: string[];
  visibility: "public" | "private";
  activities?: ActivityType[];
  timeline?: TimelineType[];
  classes?: ClassType[];
  templates?: string[];
  // audit: Audit;
};

export type openingProgramCreate = {
  programUuid: string;
  title: string;
  generation: number;
  thumbnail: string;
  posterUrl:string;
  slug: string;
  originalFee: number;
  price: number;
  scholarship: number;
  duration: string;
  deadline: string;
  curriculumPdfUri?: string; // optional if backend allows
  totalSlot: number;
  qrCodeUrl: string;
  telegramGroup: string;
  status: "OPEN" | "CLOSED" | "ACHIEVED" |"PENDING";
  programType?: string; // optional if backend allows
  visibility?: "public" | "private"; // optional
  activities?: ActivityType[];
  timeline?: TimelineType[];
  classes?: ClassType[];
  templates?: string[];
  // audit: Audit;
};

export type ActivityType = {
  title: string;
  description: string;
  image: string;
};

export type TimelineType = {
  title: string;
  startDate: string;
  endDate: string;
  _clientId: string; // 🔑 local unique id
};

export type ClassPayload = {
  openingProgramUuid: string;
  openingProgramName:string;
  shift: "MORNING" | "AFTERNOON" | "EVENING";
  instructor: string;
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  isWeekend: boolean;
  totalSlot: number;
  room: string;
  classCode: string;
  telegram: string;
};

export type ClassType = {
  uuid: string;
  openingProgramUuid: string;
  shift: string;
  instructor: string;
  startTime: string;
  endTime: string;
  isWeekend: boolean;
  totalSlot: number;
  room: string;
  classCode: string;
  telegram: string;
};
export type ClassCreate = {
  // openingProgramUuid:string;
  shift: string;
  instructor: string;
  startTime: string;
  endTime: string;
  isWeekend: boolean;
  totalSlot: number;
  room: string;
  classCode: string;
  telegram: string;
};

export type ScholarClassPayload = {
  classUuid: string;
  scholarUuid: string;
  isPaid : boolean;
  isReminded:boolean;
  
}
export type ScholarClassType = {
    uuid: string;
    scholarUuid: string;
    scholarName: string;  
    classUuid: string;
    room: string;         
    isReminded: boolean;
    isPaid: boolean;
    audit?: {
        createdBy: string;
        updatedBy: string | null;
        createdAt: string;
        updatedAt: string | null;
    }
}


export type SCholarClassCreate = {
  classUuid: string;
  scholarUuid: string;
  isPaid : boolean;
  isReminded:boolean;
}
// export type RoadmapType = {

// }
