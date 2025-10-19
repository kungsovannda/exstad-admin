export type Audit = {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};

export type State = {
  total: number;
  male?: number;
  female?: number;
};
