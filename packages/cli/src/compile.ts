import { compile, getOutPath, Status } from "@emd/core";
import { writeFile, getContent } from "./fs.js";
import {
  Logger,
  normalizedPath,
  printDiagnostic,
  reportCompilation,
} from "./utils/logger.js";

export async function compileFile(path: string, verbose: boolean) {
  try {
    const content = await getContent(path);
    const { compiled, status, diagnostics, duration } = compile(content);

    diagnostics.forEach((diagnostic) =>
      printDiagnostic(diagnostic, content, verbose),
    );

    const outPath = getOutPath(path);

    if (status !== Status.ERROR) {
      await writeFile(compiled, outPath);
    }

    reportCompilation(
      normalizedPath(status === Status.ERROR ? path : outPath),
      duration,
      status,
    );
  } catch (err) {
    Logger.ERROR(
      `Failed to read or write file: ${path}`,
      err instanceof Error ? err.message : "",
    );
  }
}
