import type { VariableCall, varPosition } from "../types/core.types.js";

export function scanVariables(
  body: string,
  EOL: string,
  bodyStartIndex: number,
  onMatch: (data: VariableCall) => string | void,
): string {
  const VAR_REGEX = /\{\{\s*([\w.]+)\s*\}\}/g;

  const matches = [...body.matchAll(VAR_REGEX)];

  for (const match of matches) {
    const raw = match[0];
    const name = match[1];
    if (!name) continue;
    const offset = match.index;

    const nameInsideRawIndex = raw.indexOf(name);
    const exactNameIndexInBody = offset + nameInsideRawIndex;

    const fullOffset = bodyStartIndex + offset;
    const fullNameOffset = bodyStartIndex + exactNameIndexInBody;

    const { line, column } = getPosition(
      body,
      bodyStartIndex > 0,
      exactNameIndexInBody,
      EOL,
    );

    const matchData: VariableCall = {
      name,
      line,
      column,
      raw,
      bodyOffset: offset,
      bodyNameOffset: exactNameIndexInBody,
      fullOffset,
      fullNameOffset: fullNameOffset,
    };

    onMatch(matchData);
  }

  return body;
}

export function getPosition(
  content: string,
  hasFM: boolean,
  index: number,
  EOL: string,
): varPosition {
  const textBefore = content.slice(0, index);
  const lines = textBefore.split(EOL);

  // Note - first line is not counted, if it has something before the EOL.
  // For that reason, we need to drop the first line if it has content that is not part of the body.
  const line = lines.length - (hasFM ? 2 : 1);
  const column = lines[lines.length - 1]?.length || 0;

  return { line, column };
}
