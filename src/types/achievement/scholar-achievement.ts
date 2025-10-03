import { Achievement } from ".";
import { Audit } from "..";
import { Scholar } from "../scholar";

export type CreateScholarAchievement = {
  achievementUuid: string;
};

export type ScholarAchievementForScholar = {
  uuid: string;
  achievement: Achievement;
  audit: Audit;
};

export type ScholarAchievementForAchievement = {
  uuid: string;
  scholar: Scholar;
  audit: Audit;
};
