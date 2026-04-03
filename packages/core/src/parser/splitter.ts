import { Status, type Diagnostic } from "../types/logger.types.js";

export function getBodyAndFM(content: string): {
  fm: string | null;
  rawFMBlock: string | null;
  body: string;
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
      diagnostics: [warning],
    };
  }
  return {
    fm: match[1] ?? null,
    rawFMBlock: match[0],
    body: content.slice(match[0].length),
    diagnostics: [],
  };
}
