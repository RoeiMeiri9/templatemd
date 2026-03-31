export function formatHrTime(nanos: bigint): string {
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

export function normalizedPath(path: string) {
  return path.replace(/\\/g, "/");
}
