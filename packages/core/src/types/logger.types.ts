export enum Status {
  SUCCESS = 1,
  WARN = 2,
  ERROR = 3,
}

export type StatusLogFunctions = {
  [K in keyof typeof Status]: (...args: any[]) => void;
};

export interface EmdLogger extends StatusLogFunctions {
  INFO: (...args: any[]) => void;
}

export interface Diagnostic {
  level: Status;
  message: string;
  line?: number | undefined;
  column?: number | undefined;
  position?: number | undefined;
  namePosition?: number | undefined;
  length?: number | undefined;
  varName?: string;
  stack?: string | undefined;
}
