import { scanVariables } from "../parser/variables.js";
import type { FMContent } from "../types/core.types.js";
import { Status, type Diagnostic } from "../types/logger.types.js";

export function replaceValues(
  body: string,
  EOL: string,
  bodyStartIndex: number,
  variables: FMContent | null,
) {
  const diagnostics: Diagnostic[] = [];

  if (!variables || !Object.keys(variables).length) {
    return { result: body, diagnostics };
  }

  const result = scanVariables(body, EOL, bodyStartIndex, (call) => {
    const value = variables[call.name];
    if (!Object.hasOwn(variables, call.name)) {
      const tempError = new Error();

      diagnostics.push({
        level: Status.WARN,
        message: `Variable ${call.name} is not specified`,
        varName: call.name,
        line: call.line,
        column: call.column,
        position: call.fullOffset,
        stack: tempError.stack || "",
      });
      return undefined;
    }
    if (value === undefined || value === null) {
      return undefined;
    }
    return String(value);
  });

  return { result, diagnostics };
}
