import { YAMLException } from "js-yaml";
import os from "os";
import { Status, type EmdLogger, type StatusLogFunctions } from "../types.js";

export class InternalLogger {
  private _api?: EmdLogger;
  public api: EmdLogger;

  constructor() {
    this.api = new Proxy({} as EmdLogger, {
      get: (target, p: string | symbol) => {
        if (!this._api) {
          console.warn(
            `[InternalLogger]: API not set! Tried to call "${String(p)}".`,
          );
          return () => {};
        }

        const prop = p as keyof EmdLogger;
        const value = this._api[prop];

        if (typeof value === "function") {
          return value.bind(this._api);
        }

        return value;
      },
    });
  }

  setAPI(loggerAPI: EmdLogger) {
    this._api = loggerAPI;
  }

  info(msg: string, ...args: any[]) {
    this.api.INFO(msg, ...args);
  }

  reportCompilation(path: string, durationNanos: bigint, status: Status) {
    const statusMessages = {
      [Status.SUCCESS]: `Compiled successfully`,
      [Status.WARN]: `Compiled with warnings`,
      [Status.ERROR]: `Compilation of failed with errors`,
    };

    const statusName = Status[status] as keyof StatusLogFunctions;
    const baseMessage = statusMessages[status];
    const timeInfo = `(${formatHrTime(durationNanos)})`;

    const finalMessage = `${baseMessage}: ${path} ${timeInfo}`;

    this.api[statusName](finalMessage);
  }

  warn(...args: any[]) {
    this.api.WARN(...args);
  }

  error(...args: any[]) {
    this.api.ERROR(...args);
  }

  yamlException(err: YAMLException) {
    this.api.ERROR("Parsing failed:", os.EOL, err.reason, os.EOL, err.stack);
  }
}

function formatHrTime(nanos: bigint): string {
  const ms = Number(nanos) / 1_000_000;

  if (ms < 1) {
    return `${Number(nanos).toLocaleString()} ns`;
  }
  if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  }

  const seconds = (ms / 1000).toFixed(2);
  return `${seconds}s`;
}

export function getMaxStatus(current: Status, incoming: Status): Status {
  return Math.max(current, incoming) as Status;
}
