export type University = {
  uuid: string;
  englishName: string;
  khmerName: string;
  shortName: string;
  scholars: number;
  audit: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  };
};

export type UniversityUpdate = {
  englishName?: string;
  khmerName?: string;
  shortName?: string;
};

export type UniversityCreate = {
  englishName: string;
  khmerName: string;
  shortName: string;
};
