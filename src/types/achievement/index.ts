import { Audit } from "..";

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
