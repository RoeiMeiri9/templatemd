export type OrchestratorOutput = {
  content: string;
  status: Status;
  reportCompilation: (
    path: string,
    durationNanos: bigint,
    status: Status,
  ) => void;
};

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

export type FMContent = Record<string, any>;

export type VariableCall = {
  name: string;
  line: number;
  column: number;
  raw: string;
  index: number;
  error?: string; // TODO: Make an actual error in a different commit
};
