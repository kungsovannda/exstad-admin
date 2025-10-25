export type Preference = {
  theme?: {
    mode?: string;
    variant?: string;
  };
  export: ExportType;
};

export type ExportType = {
  header?: {
    font?: string;
    size?: number;
  };
  content?: {
    font?: string;
    size?: number;
  };
};
