import { Audit } from "..";

export type University = {
  uuid: string;
  englishName: string;
  khmerName: string;
  shortName: string;
  scholars: number;
  audit: Audit;
};

export type UniversityUpdate = {
  englishName?: string;
  khmerName?: string;
  shortName?: string;
};

export type UniversityCreate = {
  englishName: string;
  khmerName: string;
  shortName: string;
};
