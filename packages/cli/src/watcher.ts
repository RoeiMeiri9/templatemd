import { FSWatcher, watch } from "chokidar";
import { processFile } from "@emd/core";
import { Logger } from "./utils/logger.js";

let watcher: FSWatcher;

export function watchFile(pathToWatch: string) {
  watcher = watch(pathToWatch, {
    ignored: (filePath, stats) => {
      if (!stats) return false;
      return stats.isFile() && !filePath.endsWith(".emd");
    },
    persistent: true,
  });
  watcher.on("change", (path) => processFile(path));
}

export async function clear() {
  await watcher.close().then(() => Logger.info("closed"));
}
