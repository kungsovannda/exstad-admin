import { openingProgramType } from "../opening-program";
// shortCourseType.ts
export type HighlightType = {
  label: string;
  value: string;
  desc: string;
};
export type HighlightPayload = Omit<HighlightType, "id">;
type Level = "BASIC" | "INTERMEDIATE" | "ADVANCED";
type  visibility="public" | "private";
type programType= "SHORT_COURSE" |"SCHOLARSHIP"


export type MasterProgramType = {
  uuid: string;
  programType:programType;
  bgColor: string;
  title: string;
  slug:string;
  subtitle: string;
  description: string;
  programLevel:Level;
 posterUrl:string;
  thumbnailUrl:string;
  price: string;
  duration: string;
  scholarship?: number;
  discount: string;
  deadline:string;
  totalslot:number;
  programOverviews: programOverviewType[];
  learningOutcomes: LearningOutcomeType[];
  requirements: RequirementsType[];
  highlights: HighlightType[];   // 👈 new
  curriculum: CurriculumType[]; // 👈 new
  openingprograms: openingProgramType[]; // 👈 new
  faq:FaqItem[];
  curricula:CurriculumType[];
  visibility: visibility
  status: "draft" | "active" | "archived"
};

export type MasterProgramCreate = {
  title: string;
  programType: string;
  bgColor?: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  programLevel?: Level;
  posterUrl:string;
  // image?: string;
  thumbnailUrl?: string;
  price?: number;
  duration?: string;
  scholarship?: number;
  discount?: string;
  deadline?: string;
  totalslot?: number;
  programOverviews?: programOverviewType[];
  learningOutcomes?: LearningOutcomeType[];
  requirements?: RequirementsType[];
  highlights?: HighlightType[];
  curriculum?: CurriculumType[];
  openingprograms?: openingProgramType[];
  faq?: FaqItem[];
  // curricula?: CurriculumDataType[];
  visibility?: "public" | "private";
  status?: "draft" | "active" | "archived";
};


export type programOverviewType = {
    id: number;
    title: string;
    description: string;
}

export type LearningOutcomeType = {
    id:string;
    title:string;
    subtitle:string;
    description:string[];
}


export type  RequirementsType = {
    id:string;
    title:string;
    subtitle:string;
    description:string[];
}


export type FaqSection = {
    id:string;
    question:string;
    answer:string;
}
export type FaqItem = {
  title:string;
  faqs:FaqSection[];
}

export type CurriculumType = {
    id:string;
    order:number;
    title:string;
    subtitle:string;
    description:string[];
}

// export  type CurriculumDataType = {
//   id:number;
//   title:string;
//   curriculumType:CurriculumType[];
// }













