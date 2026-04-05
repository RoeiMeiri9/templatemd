import { Status, Duration } from "@emd/core";
import type { Diagnostic, EmdLogger, StatusLogFunctions } from "@emd/core";

import { codeFrameColumns } from "@babel/code-frame";
import chalk from "chalk";

const amber = chalk.rgb(204, 167, 0);

export const Logger: EmdLogger = {
  INFO: (...args: any[]) => console.log(chalk.blue("[INFO]"), ...args),
  SUCCESS: (...args: any[]) => console.log(chalk.green("[SUCCESS]"), ...args),
  WARN: (...args: any[]) => console.warn(amber("[WARN]"), ...args),
  ERROR: (...args: any[]) => console.error(chalk.red("[ERROR]"), ...args),
};

export function normalizedPath(path: string) {
  return path.replace(/\\/g, "/");
}

export function reportCompilation(
  path: string,
  durationNanos: Duration,
  status: Status,
) {
  const statusMessages = {
    [Status.SUCCESS]: `Compiled successfully`,
    [Status.WARN]: `Compiled with warnings`,
    [Status.ERROR]: `Compilation of .emd file failed with errors`,
  };

  const statusName = Status[status] as keyof StatusLogFunctions;
  const baseMessage = statusMessages[status];
  const timeInfo = `(${durationNanos})`;

  const finalMessage = `${baseMessage}: ${path} ${timeInfo}`;

  Logger[statusName](finalMessage);
}

export function printDiagnostic(
  diagnostic: Diagnostic,
  source: string,
  verbose = false,
) {
  const { level, message, line: rawLine, column: rawColumn } = diagnostic;
  const line = zeroToOneCounter(rawLine);
  const column = zeroToOneCounter(rawColumn);

  const position = line ? ` (${line}:${column})` : "";
  const frame = line
    ? `\n${codeFrameColumns(source, { start: { line, column: column || 1 } }, { highlightCode: true })}`
    : "";
  const finalOutput = `${message}${position}${frame}`;

  const logMap: Record<Status, (...args: any[]) => void> = {
    [Status.SUCCESS]: Logger.SUCCESS,
    [Status.WARN]: Logger.WARN,
    [Status.ERROR]: Logger.ERROR,
  };

  const logFn = logMap[level] || Logger.INFO;
  logFn(finalOutput);

  if (verbose && diagnostic.stack) {
    console.log(diagnostic.stack);
  }
}

function zeroToOneCounter(rawNumber: number | undefined) {
  return rawNumber ? rawNumber + 1 : undefined;
}
