export type CreateDocument = {
  programSlug?: string;
  gen: number;
  documentType: string;
  filename?: string;
  file: File;
};

export type CreateLogo = {
  programSlug: string;
  documentType: string;
  filename?: string;
  file: File;
};
