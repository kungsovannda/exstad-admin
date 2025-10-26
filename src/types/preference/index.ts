export type Preference = {
  sidebar?: {
    parent?: {
      defaultOpen?: boolean;
    };
    child?: {
      delay?: number;
    };
  };
  toast?: {
    expand?: boolean;
    duration?: number;
    richColor?: boolean;
    position:
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right"
      | "top-center"
      | "bottom-center";
    closeButton?: boolean;
  };
  theme?: {
    mode?: string;
    variant?: string;
  };
  export?: ExportType;
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
