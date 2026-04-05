import { getEOL } from "../parser/eol.js";
import { extractFM } from "../parser/front-matter.js";
import { getBodyAndFM } from "../parser/splitter.js";
import { scanVariables } from "../parser/variables.js";
import type { FMContent } from "../types/core.types.js";
import { Status, type Diagnostic } from "../types/logger.types.js";

export function validateEmd(content: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  const EOL = getEOL(content);
  const { fm, body, bodyStartIndex, fmContentStart } = getBodyAndFM(content);
  // TODO: Add support for yamlException
  const { parsedFM } = extractFM(fm, fmContentStart, EOL);

  const variables: FMContent = parsedFM?.variables || {};

  scanVariables(body, EOL, bodyStartIndex, (call) => {
    if (!Object.hasOwn(variables, call.name)) {
      diagnostics.push({
        level: Status.WARN,
        message: "Unrecognized variable",
        length: call.name.length,
        line: call.line,
        position: call.fullOffset,
        namePosition: call.fullNameOffset,
        column: call.column,
      });
    }
    return undefined;
  });

  return diagnostics;
}
