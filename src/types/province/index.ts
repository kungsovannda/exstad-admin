import { Audit } from "..";

export type Province = {
  uuid: string;
  englishName: string;
  khmerName: string;
  scholars: number;
  audit: Audit;
};
