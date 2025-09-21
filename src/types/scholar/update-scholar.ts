import { ScholarStatus } from ".";

export type UpdateScholar = {
  status?: ScholarStatus;
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
