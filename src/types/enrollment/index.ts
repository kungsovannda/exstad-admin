import { Gender } from "../scholar";

export type Enrollment = {
  uuid: string;
  englishName: string;
  khmerName: string;
  program: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  phoneNumber: string;
  email: string;
  avatar: string;
  province: string;
  currentAddress: string;
  university: string;
  educationQualification: string;
  extra: Record<string, string>;
  isPaid: boolean;
  isInterviewed: boolean;
  isAchieved: boolean;
  isPassed: boolean;
};

export type UpdateEnrollment = {
  englishName?: string;
  khmerName?: string;
  gender?: Gender;
  dob?: string;
  email?: string;
  avatar?: string;
  province?: string;
  currentAddress?: string;
  university?: string;
  educationQualification?: string;
  isPaid?: boolean;
  isInterviewed?: boolean;
  isPassed?: boolean;
  isAchieved?: boolean;
};

export type CreateEnrollment = {
  englishName: string;
  khmerName: string;
  openingProgramUuid: string;
  gender: Gender;
  dob: string;
  phoneNumber: string;
  email: string;
  province: string;
  currentAddress: string;
  university: string;
  educationQualification: string;
  avatar?: string;
  extra?: Record<string, string>;
};
