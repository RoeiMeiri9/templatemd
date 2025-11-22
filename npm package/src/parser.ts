import { load, dump } from "js-yaml";
import { readFile as fsReadFile, writeFile as fsWriteFile } from "fs/promises";
import type { VariablesMatcher, FMContent } from "./types.js";

export async function processFile(path: string, benchmark: boolean) {
  const startTime = benchmark ? Date.now() : 0;

  try {
    const content = await fsReadFile(path, "utf-8");

    const processed = orchestrator(content);

    const outPath = path.replace(/\.tmd$/, ".md");
    await fsWriteFile(outPath, processed, "utf-8");

    if (benchmark) console.log(Date.now() - startTime);
  } catch (err) {
    console.error("Error processing file:", err);
  }
}

function orchestrator(content: string): string {
  const vars = extractVariables(content);
  return parseContent(content, vars);
}

function extractVariables(content: string): VariablesMatcher {
  const eolMatch = content.match(/\r\n|\r|\n/);
  const EOL = eolMatch ? eolMatch[0] : "\n";

  const fmMatch = content.match(/^---[\r\n]+([\s\S]*?)^---[\r\n]/m);
  if (!fmMatch || !fmMatch[1]) return { EOL };

  let fmObject: FMContent;
  try {
    fmObject = load(fmMatch[1]) as FMContent;
  } catch {
    return { EOL, fmMatch, newFMContent: fmMatch[1] };
  }

  const variables = fmObject.variables ? { ...fmObject.variables } : undefined;
  delete fmObject.variables;

  const hasOtherKeys = Object.keys(fmObject).length > 0;
  const newFMContent = hasOtherKeys ? dump(fmObject, { indent: 2 }) : "";

  return { variables, newFMContent, fmMatch, EOL };
}

function parseContent(text: string, fm: VariablesMatcher): string {
  let out = "";

  const startIndex = fm.fmMatch ? fm.fmMatch[0].length : 0;
  let body = text.slice(startIndex + 1);

  body = body.replace(/^(\r\n|\n\r|\n|\r)/, "");

  if (fm.newFMContent) {
    out += `---${fm.EOL}${fm.newFMContent}---${fm.EOL}`;
  }

  if (!fm.variables) {
    out += body;
    return out;
  }

  let i = 0;
  while (i < body.length) {
    if (body[i] === "{" && body[i + 1] === "{") {
      i += 2;
      let varName = "";
      while (!(body[i] === "}" && body[i + 1] === "}")) {
        varName += body[i];
        i++;
      }
      i += 2;
      out += fm.variables[varName.trim()] ?? "";
    } else {
      out += body[i];
      i++;
    }
  }

  return out;
}
