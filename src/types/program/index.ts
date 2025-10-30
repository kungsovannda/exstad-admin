import { Audit } from "..";
import { openingProgramType } from "../opening-program";

export type HighlightPayload = Omit<HighlightType, "id">;
export type Level = "BASIC" | "INTERMEDIATE" | "ADVANCED";
export type visibility = "PUBLIC" | "PRIVATE";
export type programType = "SHORT_COURSE" | "SCHOLARSHIP";
export type status =  "draft" | "active" | "archived";
export type MasterProgramType = {
  uuid: string;
  programType: programType;
  bgColor: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  programLevel: Level;
  logoUrl: string;
  thumbnailUrl:string;
  programOverviews: programOverviewType[];
  learningOutcomes: LearningOutcomeType[];
  requirements: RequirementsType[];
  highlights: HighlightType[]; 
  curriculum: CurriculumType[]; 
  openingprograms: openingProgramType[]; 
  faq: FaqItem[];
  curricula: CurriculumType[];
  visibility: visibility;
  audit: Audit;
};

export type MasterProgramCreate = {
  title: string;
  programType?: programType;
  bgColor: string;
  slug: string;
  subtitle: string;
  description: string;
  programLevel?: Level;
  logoUrl?: string;
  thumbnailUrl:string;
  programOverviews?: programOverviewType[];
  learningOutcomes?: LearningOutcomeType[];
  requirements?: RequirementsType[];
  highlights?: HighlightType[];
  curriculum?: CurriculumType[];
  openingprograms?: openingProgramType[];
  faq?: FaqItem[];
  visibility?: visibility;
  // audit: Audit;
};

export type HighlightType = {
  label: string;
  value: string;
  desc: string;
};

export type programOverviewType = {
  title: string;
  description: string;
};

export type programOverviewsPayload = Omit<programOverviewType, "id">;

export type technologyType = {
  image: string;
  title:string;
  description:string;
  _clientId: string; 
}
export type LearningOutcomeType = {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
};

export type RequirementsType = {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
};

export type FaqSection = {
  id: string;
  question: string;
  answer: string;
};
export type FaqItem = {
  title: string;
  faqs: FaqSection[];
};

export type CurriculumType = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string[];
};
  
