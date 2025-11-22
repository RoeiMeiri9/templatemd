import { Position, Range, TextDocument } from "vscode";
import * as yaml from "js-yaml";
import { GetVariables } from "./types";

export function getVariables(
  document: TextDocument,
  position: Position
): GetVariables {
  let before = document.getText(new Range(new Position(0, 0), position));

  before = before.replace(/{{{+/g, "{");

  const inside = isInsideDoubleBraces(before);
  if (!inside) return {};

  const insideText = getTextInsideBraces(before);

  if (!insideText || insideText.trim().length === 0) {
    return {};
  }

  const text = document.getText();
  const fmMatch = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return {};

  let fmData;
  try {
    fmData = yaml.load(fmMatch[1]) as any;
  } catch {
    return {};
  }

  return { variables: fmData.variables, fmMatch, text };
}

function isInsideDoubleBraces(textBeforeCursor: string): boolean {
  const lastOpen = textBeforeCursor.lastIndexOf("{{");
  const lastClose = textBeforeCursor.lastIndexOf("}}");
  return lastOpen !== -1 && lastOpen > lastClose;
}

function getTextInsideBraces(before: string): string | null {
  const lastOpen = before.lastIndexOf("{{");
  const lastClose = before.lastIndexOf("}}");

  if (lastOpen === -1 || lastOpen < lastClose) return null;

  return before.slice(lastOpen + 2); // מה שאחרי {{
}
