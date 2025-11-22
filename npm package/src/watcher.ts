import { FSWatcher, watch } from "chokidar";
import { processFile } from "./parser.js";

let watcher: FSWatcher;

export function watchFile(pathToWatch: string, benchmark: boolean) {
  watcher = watch(pathToWatch, {
    ignored: (filePath, stats) => {
      if (!stats) return false;
      return stats.isFile() && !filePath.endsWith(".tmd");
    },
    persistent: true,
  });
  watcher.on("change", (path) => processFile(path, benchmark));
}

export async function clear() {
  await watcher.close().then(() => console.log("closed"));
}
