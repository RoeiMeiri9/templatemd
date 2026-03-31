import { load as loadYaml, dump as dumpYaml, YAMLException } from "js-yaml";
import { readFile as fsReadFile, writeFile as fsWriteFile } from "fs/promises";
import type {
  VariablesMatcher,
  FMContent,
  OrchestratorOutput,
} from "./types.js";
import { logger } from "./utils/logger.js";
import { normalizedPath } from "./utils/utils.js";

export async function processFile(path: string) {
  const startTime = process.hrtime.bigint();

  try {
    const content = await fsReadFile(path, "utf-8");
    const processed = await orchestrator(content);

    const outPath = path.replace(/\.emd$/, ".md");

    const endTime = process.hrtime.bigint();
    const time = endTime - startTime;

    await fsWriteFile(outPath, processed.content, "utf-8");
    logger.reportCompilation(normalizedPath(path), time, processed.status);
  } catch (err) {
    logger.error("Error processing file:", err);
  }
}

async function orchestrator(content: string): Promise<OrchestratorOutput> {
  const vars = await extractVariables(content);
  return {
    content: parseContent(content, vars),
    status: vars.encounteredError ? "WARN" : "SUCCESS",
  };
}

async function extractVariables(content: string): Promise<VariablesMatcher> {
  const endOfLineMatch = content.match(/\r\n|\r|\n/);
  const EOL = endOfLineMatch ? endOfLineMatch[0] : "\n";

  const frontMatterMatch = content.match(/^---[\r\n]+([\s\S]*?)^---[\r\n]/m);
  if (!frontMatterMatch || !frontMatterMatch[1]) {
    return { encounteredError: false, EOL };
  }

  try {
    const fmObject = (await loadYaml(frontMatterMatch[1])) as FMContent;

    const variables = fmObject.variables
      ? { ...fmObject.variables }
      : undefined;
    delete fmObject.variables;

    const hasOtherKeys = Object.keys(fmObject).length > 0;
    const newFMContent = hasOtherKeys ? dumpYaml(fmObject, { indent: 2 }) : "";

    return {
      encounteredError: false,
      variables,
      newFMContent,
      fmMatch: frontMatterMatch,
      EOL,
    };
  } catch (err) {
    logger.yamlException(err as YAMLException);
    return {
      encounteredError: true,
      EOL,
      fmMatch: frontMatterMatch,
      newFMContent: frontMatterMatch[1],
    };
  }
}

function parseContent(text: string, fm: VariablesMatcher): string {
  const startIndex = fm.fmMatch ? fm.fmMatch[0].length : 0;
  //Content under the Front Matter
  const body = text
    .slice(startIndex)
    .replace(/^---[\r\n]+/, "")
    .trimStart();

  let newFM = fm.newFMContent
    ? `---${fm.EOL}${fm.newFMContent}---${fm.EOL}${fm.EOL}`
    : "";

  if (!fm.variables) return newFM + body;

  return (
    newFM +
    body.replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, (match, varName) => {
      return fm.variables![varName.trim()] ?? "";
    })
  );
}
