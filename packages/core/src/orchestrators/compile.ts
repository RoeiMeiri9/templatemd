import * as logger from "../logging/logger.js";
import { getEOL } from "../parser/eol.js";
import { cleanFM, extractFM } from "../parser/front-matter.js";
import { replaceValues } from "../transformers/replacer.js";
import { getBodyAndFM } from "../parser/splitter.js";
import { type Diagnostic } from "../types/logger.types.js";
import { Duration } from "../utils/Duration.js";

export function compile(content: string) {
  const startTime = process.hrtime.bigint();
  const EOL = getEOL(content);

  const {
    fm,
    rawFMBlock,
    body,
    bodyStartIndex,
    fmContentStart,
    diagnostics: splitDiag,
  } = getBodyAndFM(content);

  const { parsedFM, diagnostic } = extractFM(fm, fmContentStart, EOL);
  const finalFM = parsedFM ? cleanFM(parsedFM, EOL) : "";

  const { result: finalBody, diagnostics: replaceDiag } = replaceValues(
    body,
    EOL,
    bodyStartIndex,
    parsedFM?.variables,
  );

  const fmLineOffset = rawFMBlock ? rawFMBlock.split(EOL).length : 0;

  const correctedReplaceDiag = replaceDiag.map((d) => ({
    ...d,
    line: d.line ? d.line + fmLineOffset : d.line,
  }));

  const allDiagnostics: Diagnostic[] = [
    ...splitDiag,
    ...(diagnostic ? [diagnostic] : []),
    ...correctedReplaceDiag,
  ];

  const finalStatus = logger.determineStatus(allDiagnostics);

  return {
    compiled: finalFM + finalBody,
    status: finalStatus,
    diagnostics: allDiagnostics,
    duration: new Duration(process.hrtime.bigint() - startTime),
  };
}
