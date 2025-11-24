import { Range, Position } from "vscode";

export type GetVariablesForBraces = {
  variables?: object;
  fmMatch?: RegExpMatchArray | null;
  text?: string;
};
