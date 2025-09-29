import { Audit } from "..";

export type Document = {
  name: string;
  mimeType: string;
  programSlug: string;
  gen: number;
  documentType: string;
  fileSize: number;
  uri: string;
  audit: Audit;
};
