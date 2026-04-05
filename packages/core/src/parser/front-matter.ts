import { load, dump, YAMLException } from "js-yaml";
import type { FMContent } from "../types/core.types.js";
import { Status, type Diagnostic } from "../types/logger.types.js";

export function extractFM(
  fm: string | null,
  fmContentStart: number,
  EOL: string,
): {
  parsedFM: FMContent | null;
  diagnostic: Diagnostic | null;
} {
  if (!fm) return { parsedFM: null, diagnostic: null };

  try {
    const parsedFM = load(fm) as FMContent;
    return { parsedFM, diagnostic: null };
  } catch (err) {
    const yamlError = err as YAMLException;
    const line = yamlError.mark ? yamlError.mark.line + 1 : undefined;
    const column = yamlError.mark ? yamlError.mark.column : undefined;
    const position = calculateOffsetFromLineCol(
      fm,
      fmContentStart,
      line,
      column,
      EOL,
    );
    const length = 1;

    const diagnostic: Diagnostic = {
      level: Status.ERROR,
      message:
        `${yamlError.name}: ${yamlError.reason}` || "Invalid YAML structure",
      line,
      position,
      column,
      length,
      stack: yamlError.stack,
    };
    return { parsedFM: null, diagnostic };
  }
}

function calculateOffsetFromLineCol(
  fullText: string,
  startOffset: number,
  relativeLine: number | undefined,
  relativeCol: number | undefined,
  EOL: string,
): number | undefined {
  if (relativeCol === undefined || relativeLine === undefined) return undefined;

  const lines = fullText.substring(startOffset).split(EOL) ?? [];
  let offset = startOffset;

  for (let i = 0; i < relativeLine; i++) {
    offset += (lines[i]?.length || 0) + (fullText.includes("\r\n") ? 2 : 1); // הוספת ה-EOL
  }

  return offset + relativeCol - 1;
}

export function cleanFM(fm: FMContent, EOL: string) {
  const { variables, ...rest } = fm;
  if (!Object.keys(rest).length) return "";

  const cleanYaml = dump(rest);
  return cleanYaml ? `---${EOL}${cleanYaml}---` : "";
}
