import { Audit } from "..";
import { BadgeForScholar } from "../badge";

export type Scholar = {
  uuid: string;
  username: string;
  email: string;
  englishName: string;
  khmerName: string;
  gender: "Male" | "Female";
  status: "Active" | "Suspended" | "Graduated" | "Dropped";
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

export type UpdateScholar = {
  status?: "Active" | "Suspended" | "Graduated" | "Dropped";
  university?: string;
  province?: string;
  currentAddress?: string;
  nickname?: string;
  bio?: string;
  avatar?: string;
  phoneFamilyNumber?: string;
  isPublic?: boolean;
  quote?: string;
};

export type CreateScholar = {
  username: string;
};
