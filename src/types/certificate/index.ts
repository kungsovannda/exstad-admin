import { Audit } from "..";


export type CertificateType = {
  scholarUuid: string;
  openingProgramUuid: string;
  tempCertificateUrl: string;
  certificateUrl: string;
  isVerified: boolean;
  audit: Audit;
};

export type CertificateData = {
  // englishName: string;
  // khmerName: string;
  title: string;
  certificateUrl: string;
  generation: string;
  slug?: string;
};

export type ScholarForCertificateType = {
  uuid: string;
  englishName: string;
  khmerName: string;
  title: string;
};
