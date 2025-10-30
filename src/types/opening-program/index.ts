import { Audit } from "..";
import { Scholar } from "../scholar";

export type Shift = "MORNING" | "AFTERNOON" | "EVENING";
export type status = "OPEN" | "CLOSED" | "ACHIEVED" |"PENDING";
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
  status: status;
  // image: string;
  // shortcourseimage:string;
  // template?: string[];

  // optional fields (if backend adds them later)
  // description?: string;
  programType: string;
  // templates?: string[];
  activities?: ActivityType[];
  timeline?: TimelineType[];
  classes?: ClassType[];
  templates?: string[];
  audit: Audit;
  registerFee:number;
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
  status: status;
  programType?: string; // optional if backend allows
  activities?: ActivityType[];
  timeline?: TimelineType[];
  classes?: ClassType[];
  templates?: string[];
  registerFee:number;
  // audit: Audit;
};

export type ActivityType = {
  title: string;
  description: string;
  image: string;
  _clientId: string;
};

export type TimelineType = {
  title: string;
  startDate: Date;
  endDate: Date;
  _clientId: string; // 🔑 local unique id
};


export type ClassPayload = {
  openingProgramUuid: string;
  openingProgramName:string;
  shift: Shift;
  // instructor: string;
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
  openingProgramName:string;
  shift: Shift;
  // instructor: string;
  startTime: string;
  endTime: string;
  isWeekend: boolean;
  totalSlot: number;
  room: string;
  classCode: string;
  telegram: string;
  audit:Audit;
};
export type ClassCreate = {
  // openingProgramUuid:string;
  shift: Shift;
  // instructor: string;
  startTime: string;
  endTime: string;
  isWeekend?: boolean;
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
    scholar: Scholar;
    classUuid: string;
    room: string;          
    isReminded: boolean;
    isPaid: boolean;
    audit:Audit;
}


export type ScholarClassCreate = {
  classUuid: string;
  scholarUuid: string;
  isPaid : boolean;
  isReminded:boolean;
}
// export type RoadmapType = {

// }
export type ScholarClassUpdate = {
  isReminded: boolean;
  isPaid: boolean
}


export type InstructorClassType = {
    uuid:string;
    instructorUuid: string,
    instructorUsername: string,
    classUuid: string,
    audit?: {
        createdBy: string;
        updatedBy: string | null;
        createdAt: string;
        updatedAt: string | null;
    }
}

export type InstructorType = {
  uuid: string;              
  username: string;
  email: string;
  englishName: string;
  khmerName: string;
  gender: string;
  dob: string;
  role: string;
  audit?: {
    createdBy: string;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string | null;
  };
};
export type InstructorClassCreate = {
  instructorUuid: string;
  classUuid: string;  
}
export type InstructorClassUpdate = {
  instructorUuid: string;
  scholarUuid: string;  
}