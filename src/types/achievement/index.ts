import { Audit } from "..";

export type {
  CreateScholarAchievement,
  ScholarAchievementForAchievement,
  ScholarAchievementForScholar,
} from "./scholar-achievement";

export type Achievement = {
  uuid: string;
  title: string;
  description: string;
  icon: string;
  program: string;
  achievementType: string;
  tag: string;
  video: string;
  link: string;
  audit: Audit;
};

export type CreateAchievement = {
  title: string;
  description: string;
  openingProgramUuid: string;
  icon: string;
  achievementType: string;
  tag: string;
  video: string;
  link: string;
};

export type UpdateAchievement = {
  title?: string;
  description?: string;
  icon?: string;
  achievementType?: string;
  tag?: string;
  video?: string;
  link?: string;
};
