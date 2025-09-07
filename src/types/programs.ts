import { openingProgramType } from "./openingProgramType";

// shortCourseType.ts
export type HighlightType = {
  label: string;
  value: string;
  desc: string;
};
type Level = "Beginner" | "Intermediate" | "Advanced";
export type programType = {
  id: number;
  program_type:string;
  bg: string;
  title: string;
  subtitle: string;
  description: string;
  level:Level;
  image: string;
  thumbnail:string;
  price: string;
  duration: string;
  scholarship?: number;
  discount: string;
  deadline:string;
  totalslot:number;
  programOverview: programOverviewType[];
  learningOutcome: programLearningOutcomeType[];
  courseRequirement: courseRequirementType[];
  highlights: HighlightType[];   // 👈 new
  // curriculum: curriculumType[]; // 👈 new
  openingprogram: openingProgramType[]; // 👈 new
  faq:FaqDataType[];
  curriculum:curriculumDataType[];
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