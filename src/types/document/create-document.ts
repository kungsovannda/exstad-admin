export type CreateDocument = {
  programSlug: string;
  gen: number;
  documentType: string;
  filename?: string;
  file: File;
};
