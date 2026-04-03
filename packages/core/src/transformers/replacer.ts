import { getEOL } from "../parser/eol.js";
import { scanVariables } from "../parser/variables.js";
import type { FMContent } from "../types/core.types.js";
import { Status, type Diagnostic } from "../types/logger.types.js";

export function replaceValues(
  body: string,
  EOL: string,
  variables: FMContent | null,
) {
  const diagnostics: Diagnostic[] = [];

  if (!variables || !Object.keys(variables).length) {
    return { result: body, diagnostics };
  }

  const result = scanVariables(body, EOL, (call) => {
    const value = variables[call.name];
    if (value === undefined) {
      const tempError = new Error();

      diagnostics.push({
        level: Status.WARN,
        message: `Variable ${call.name} is not specified`,
        varName: call.name,
        line: call.line,
        column: call.column,
        stack: tempError.stack || "",
      });
      return undefined;
    }
    return String(value);
  });

  return { result, diagnostics };
}
