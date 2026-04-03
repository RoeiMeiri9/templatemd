import type { VariableCall, varPosition } from "../types/core.types.js";
import { getEOL } from "./eol.js";

export function scanVariables(
  body: string,
  EOL: string,
  onMatch: (data: VariableCall) => string | void,
): string {
  const VAR_REGEX = /\{\{\s*([\w.]+)\s*\}\}/g;

  return body.replace(VAR_REGEX, (raw, name, offset) => {
    const nameInsideRawIndex = raw.indexOf(name);
    const exactNameIndex = offset + nameInsideRawIndex;
    const { line, column } = getPosition(body, exactNameIndex, EOL);

    const matchData: VariableCall = { name, line, column, raw, index: offset };
    const result = onMatch(matchData);

    return typeof result === "string" ? result : raw;
  });
}

export function getPosition(
  content: string,
  index: number,
  EOL: string,
): varPosition {
  const textBefore = content.slice(0, index);
  const lines = textBefore.split(EOL);

  const line = lines.length - 1;
  const column = (lines[lines.length - 1]?.length || -1) + 1;

  return { line, column };
}
