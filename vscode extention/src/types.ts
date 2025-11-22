import { Range, Position } from "vscode";

export type GetVariables = {
  variables?: object;
  fmMatch?: RegExpMatchArray | null;
  text?: string;
};
