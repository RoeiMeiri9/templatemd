import { processFile } from "@emd/core";
import { writeFile, getContent } from "./fs.js";

export async function compile(path: string) {
  await processFile(await getContent(path), path, writeFile);
}
