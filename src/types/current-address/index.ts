import { Audit } from "..";

export type CurrentAddress = {
  uuid: string;
  englishName: string;
  khmerName: string;
  province: string;
  scholars: number;
  audit: Audit;
};

export type CreateCurrentAddress = {
  englishName: string;
  khmerName: string;
  province: string;
};

export type UpdateCurrentAddress = {
  englishName?: string;
  khmerName?: string;
  province?: string;
};
