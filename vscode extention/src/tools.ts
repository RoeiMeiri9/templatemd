import { Position, Range, TextDocument } from "vscode";
import * as yaml from "js-yaml";
import { GetVariablesForBraces } from "./types";

export function getVariablesForBraces(
  document: TextDocument,
  position: Position
): GetVariablesForBraces {
  let before = document.getText(new Range(new Position(0, 0), position));

  before = before.replace(/{{{+/g, "{");

  const insideText = isInsideDoubleBraces(before);

  if (!insideText || insideText.trim().length === 0) {
    return {};
  }

  const { fmData, fmMatch, text } = getVariables(document);

  return { variables: fmData.variables, fmMatch, text };
}

export function getVariables(document: TextDocument) {
  const text = document.getText();
  const fmMatch = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return { fmData: undefined, fmMatch: null, text };

  let fmData;
  try {
    fmData = yaml.load(fmMatch[1]) as any;
  } catch {
    return { fmData, fmMatch, text };
  }
  return { fmData, fmMatch, text };
}

function isInsideDoubleBraces(textBeforeCursor: string): string {
  const lastOpen = textBeforeCursor.lastIndexOf("{{");
  const lastClose = textBeforeCursor.lastIndexOf("}}");
  if (lastOpen !== -1 && lastOpen > lastClose) {
    return textBeforeCursor.slice(lastOpen + 2);
  }
  return "";
}
