import { Audit } from "..";

export type CertificateType = {
  scholarUuid: string;
  openingProgramUuid: string;
  tempCertificateUrl: string;
  certificateUrl: string;
  isVerified: boolean;
  audit: Audit;
};
