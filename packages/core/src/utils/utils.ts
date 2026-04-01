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

export function getPosition(content: string, index: number) {
  const textBefore = content.slice(0, index);

  const lines = textBefore.split(/\r\n|\r|\n/);
  const line = lines.length;

  const column = lines[lines.length - 1].length + 1;

  return { line, column };
}

export function getEOL(content: string) {
  const endOfLineMatch = content.match(/\r\n|\r|\n/);
  const EOL = endOfLineMatch ? endOfLineMatch[0] : "\n";

  return EOL;
}
