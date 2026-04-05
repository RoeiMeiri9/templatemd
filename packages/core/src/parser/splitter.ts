import { Status, type Diagnostic } from "../types/logger.types.js";

export function getBodyAndFM(content: string): {
  fm: string | null;
  rawFMBlock: string | null;
  body: string;
  bodyStartIndex: number;
  fmContentStart: number;
  diagnostics: Diagnostic[];
} {
  const FM_REGEX = /^---[\r\n]+([\s\S]*?)[\r\n]+---/m;
  const match = content.match(FM_REGEX);

  if (!match) {
    const tempError = new Error();

    const warning: Diagnostic = {
      level: Status.ERROR,
      message: "Front Matter is missing in this file!",
      stack: tempError.stack,
    };

    return {
      fm: null,
      rawFMBlock: null,
      body: content,
      bodyStartIndex: 0,
      fmContentStart: 0,
      diagnostics: [warning],
    };
  }

  const rawFMBlock = match[0];
  const bodyStartIndex = match.index! + rawFMBlock.length;
  const body = content.slice(bodyStartIndex);
  const fmContentStart = match.index! + rawFMBlock.indexOf(rawFMBlock);

  return {
    fm: match[1] ?? null,
    rawFMBlock,
    body,
    bodyStartIndex,
    fmContentStart,
    diagnostics: [],
  };
}
