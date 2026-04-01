import { EmdLogger } from "@emd/core";

const COLORS = {
  GREEN: "\x1b[32m",
  AMBER: "\x1b[38;2;204;167;0m",
  RESET: "\x1b[0m",
};

export const Logger: EmdLogger = {
  INFO: (...args: any[]) => console.log("[INFO]", ...args),
  SUCCESS: (...args: any[]) =>
    console.log(...coloredPrint(COLORS.GREEN, "[SUCCESS]", ...args)),
  WARN: (...args: any[]) =>
    console.warn(...coloredPrint(COLORS.AMBER, "[WARN]", ...args)),
  ERROR: (...args: any[]) => console.error("[ERROR]", ...args),
};

function coloredPrint(color: string, status: string, ...args: any[]) {
  const lastArg = args.pop();
  return [color + status, ...args, lastArg + COLORS.RESET];
}
