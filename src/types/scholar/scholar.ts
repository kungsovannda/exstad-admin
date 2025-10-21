import { Audit } from "..";
import { BadgeForScholar } from "../badge";
import { Gender, ScholarStatus } from ".";

export type Scholar = {
  uuid: string;
  username: string;
  email: string;
  englishName: string;
  khmerName: string;
  gender: Gender;
  status: ScholarStatus;
  dob: string;
  role: string;
  university: string;
  province: string;
  currentAddress: string;
  nickname: string;
  bio: string;
  avatar: string;
  phoneFamilyNumber: string;
  isPublic: boolean;
  isAbroad: boolean;
  isEmployed: boolean;
  quote: string;
  audit: Audit;
  badges: BadgeForScholar[];
};
