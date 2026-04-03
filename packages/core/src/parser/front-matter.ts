import { load, dump, YAMLException } from "js-yaml";
import type { FMContent } from "../types/core.types.js";
import { Status, type Diagnostic } from "../types/logger.types.js";

export function extractFM(fm: string | null): {
  parsedFM: FMContent | null;
  diagnostic: Diagnostic | null;
} {
  if (!fm) return { parsedFM: null, diagnostic: null };

  try {
    const parsedFM = load(fm) as FMContent;
    return { parsedFM, diagnostic: null };
  } catch (err) {
    const yamlError = err as YAMLException;
    const diagnostic: Diagnostic = {
      level: Status.ERROR,
      message:
        `${yamlError.name}: ${yamlError.reason}` || "Invalid YAML structure",
      line: yamlError.mark ? yamlError.mark.line + 1 : undefined,
      column: yamlError.mark ? yamlError.mark.column + 1 : undefined,
      stack: yamlError.stack,
    };
    return { parsedFM: null, diagnostic };
  }
}

export function cleanFM(fm: FMContent, EOL: string) {
  const { variables, ...rest } = fm;
  if (!Object.keys(rest).length) return "";

  const cleanYaml = dump(rest);
  return cleanYaml ? `---${EOL}${cleanYaml}---` : "";
}
