import { Audit } from "..";
import { BadgeForScholar } from "../badge";
import { ScholarGender, ScholarStatus } from ".";

export type Scholar = {
  uuid: string;
  username: string;
  email: string;
  englishName: string;
  khmerName: string;
  gender: ScholarGender;
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
  quote: string;
  audit: Audit;
  badges: BadgeForScholar[];
};
