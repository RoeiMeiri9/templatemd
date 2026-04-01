import { load as loadYaml, dump as dumpYaml, YAMLException } from "js-yaml";
import { logger } from "./utils/logger.js";
import { Status, type FMContent, type VariableCall } from "./types.js";
import { getEOL, getPosition } from "./utils/utils.js";
import { getMaxStatus } from "./utils/InternalLogger.js";

export function getBodyAndFM(content: string): {
  fm: string | null;
  body: string;
  status: Status;
} {
  const fmRegex = /^---[\r\n]+([\s\S]*?)[\r\n]+---([\r\n]+|$)/m;
  const match = content.match(fmRegex);

  if (!match) {
    logger.warn("Front Matter is missing in this file!");
    return { fm: null, body: content, status: Status.WARN };
  }

  const body = content.slice(match[0].length);
  return {
    fm: match[1],
    body,
    status: Status.SUCCESS,
  };
}

export async function extractFM(fm: string): Promise<FMContent | undefined> {
  try {
    return (await loadYaml(fm)) as FMContent;
  } catch (err) {
    logger.yamlException(err as YAMLException);
    return undefined;
  }
}

export function cleanFM(fm: FMContent) {
  const { variables, ...rest } = fm;

  if (!Object.keys(rest).length) return null;

  return dumpYaml(rest);
}

export function extractVariableCalls(body: string): VariableCall[] {
  const regex = /\{\{\s*([\w.]+)\s*\}\}/g;
  const matches = body.matchAll(regex);
  const calls: VariableCall[] = [];

  for (const match of matches) {
    const varName = match[1];
    const index = match.index!;

    const { line, column } = getPosition(body, index);

    calls.push({
      name: varName,
      line,
      column,
      raw: match[0],
      index,
    });
  }

  return calls;
}

export function replaceValues(
  body: string,
  variableCalls: VariableCall[],
  variables: FMContent,
): { result: string; status: Status } {
  let result = body;

  if (!Object.keys(variables).length) {
    logger.warn(
      "Variables either has no keys or it's missing in the Front Matter",
    );
    return { result, status: Status.WARN };
  }

  let status: Status = 1;

  for (const call of variableCalls) {
    const value = variables[call.name] ?? call.raw;
    if (value === call.raw) {
      logger.warn("Variable", call.name, "is not specified");
      status = 2;
    }
    result = result.replace(call.raw, value);
  }

  return { result, status };
}

export async function getVariableAndCleanFM(fm: string | null, EOL: string) {
  let variables = {};
  let finalFM = "";

  if (!fm) {
    return { variables, finalFM, status: Status.WARN };
  }

  const fmContent = await extractFM(fm);
  if (!fmContent) {
    return { variables, finalFM, status: Status.ERROR };
  }

  variables = fmContent.variables || {};
  const cleaned = cleanFM(fmContent);
  finalFM = cleaned ? `---${EOL}${cleaned}---${EOL}` : "";

  return { variables, finalFM, status: Status.SUCCESS };
}

export async function orchestrate(
  content: string,
  path: string,
  writeFile: (content: string, path: string) => Promise<void>,
) {
  const startTime = process.hrtime.bigint();
  let status: Status = Status.SUCCESS;

  try {
    const EOL = getEOL(content);
    const { fm, body, status: fmStatus } = getBodyAndFM(content);
    status = getMaxStatus(status, fmStatus);

    const {
      variables,
      finalFM,
      status: extractStatus,
    } = await getVariableAndCleanFM(fm, EOL);
    status = getMaxStatus(status, extractStatus);

    if (status === Status.ERROR) return;

    const calls = extractVariableCalls(body);
    const { result: parsedBody, status: replaceStatus } = replaceValues(
      body,
      calls,
      variables,
    );
    status = getMaxStatus(status, replaceStatus);

    await writeFile(finalFM + parsedBody, path);
  } catch (err) {
    status = Status.ERROR;
    throw err;
  } finally {
    const time = process.hrtime.bigint() - startTime;
    logger.reportCompilation(path, time, status);
  }
}
