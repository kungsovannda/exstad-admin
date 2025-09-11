import { openingProgramType } from "../opening-program";
// shortCourseType.ts
export type HighlightType = {
  label: string;
  value: string;
  desc: string;
};
type Level = "Beginner" | "Intermediate" | "Advanced";
export type programType = {
  uuid: string;
  programType:string;
  bgColor: string;
  title: string;
  slug:string;
  // subtitle: string;
  description: string;
  programLevel:Level;
  // image: string;
  thumbnailUrl:string;
  price: string;
  duration: string;
  scholarship?: number;
  discount: string;
  deadline:string;
  totalslot:number;
  programOverviews: programOverviewType[];
  learningOutcomes: programLearningOutcomeType[];
  requirements: courseRequirementType[];
  highlights: HighlightType[];   // 👈 new
  // curriculum: curriculumType[]; // 👈 new
  openingprograms: openingProgramType[]; // 👈 new
  faq:FaqDataType[];
  curricula:curriculumDataType[];
  visibility: "public" | "private";
  status: "draft" | "active" | "archived"
};

export type programOverviewType = {
    id: number;
    title: string;
    description: string;
}

export type programLearningOutcomeType = {
    id:number;
    title:string;
    subtitle:string;
    description:string[];
}


export type courseRequirementType = {
    id:number;
    title:string;
    subtitle:string;
    description:string[];
}


export type FaqType = {
    id:number;
    question:string;
    answer:string;
}
export type FaqDataType = {
  id:number;
  title:string;
  faqs:FaqType[];
}

export type curriculumType = {
    id:number;
    order:number;
    title:string;
    subtitle:string;
    description:string[];
}

export  type curriculumDataType = {
  id:number;
  title:string;
  curriculumType:curriculumType[];
}













