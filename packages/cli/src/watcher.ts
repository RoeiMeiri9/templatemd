import { FSWatcher, watch } from "chokidar";
import { Logger } from "./utils/logger.js";
import { compile } from "./compile.js";

let watcher: FSWatcher;

export function watchFile(pathToWatch: string) {
  watcher = watch(pathToWatch, {
    ignored: (filePath, stats) => {
      if (!stats) return false;
      return stats.isFile() && !filePath.endsWith(".emd");
    },
    persistent: true,
  });
  watcher.on("change", compile);
}

export async function clear() {
  await watcher.close().then(() => Logger.INFO("closed"));
}
