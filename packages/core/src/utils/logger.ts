import type { EmdLogger, Status } from "../types.js";
import { InternalLogger } from "./InternalLogger.js";
import { normalizedPath } from "./utils.js";

export const logger = new InternalLogger();
export function subscribeLogs(loggerAPI: EmdLogger) {
  logger.setAPI(loggerAPI);
}
export function reportCompilation(
  path: string,
  durationNanos: bigint,
  status: Status,
) {
  logger.reportCompilation(normalizedPath(path), durationNanos, status);
}
