import { Gender } from ".";

export type CreateScholar = {
  username: string;
  email: string;
  password: string;
  cfPassword: string;
  phoneNumber: string;
  englishName: string;
  khmerName: string;
  gender: Gender;
  dob: string;
  university: string;
  province: string;
  currentAddress: string;
  isPublic: boolean;
  nickname?: string;
  bio?: string;
  avatar?: string;
  phoneFamilyNumber?: string;
  quote?: string;
};

export type ScholarGeneralInformation = {
  englishName: string;
  khmerName: string;
  gender: string;
  dob: string;
  phoneNumber: string;
  phoneFamilyNumber?: string;
  university: string;
  province: string;
  currentAddress: string;
  isPublic?: boolean;
  avatar?: File;
};

export type ScholarCredentialInformation = {
  username: string;
  email: string;
  password: string;
  cfPassword: string;
};
