import type { Status } from "./logger.types.js";

export type OrchestratorOutput = {
  content: string;
  status: Status;
  reportCompilation: (
    path: string,
    durationNanos: bigint,
    status: Status,
  ) => void;
};

export type FMContent = Record<string, any>;

export type VariableCall = {
  name: string;
  line: number;
  column: number;
  raw: string;

  //Position in relation to body
  bodyOffset: number;
  bodyNameOffset: number;

  //Position in relation to full document
  fullOffset: number;
  fullNameOffset: number;
};

export type varPosition = { line: number; column: number };
