import { FSWatcher, watch } from "chokidar";
import { readFile } from "./parser.js";
let watcher;
export function watchFile(pathToWatch) {
    watcher = watch(pathToWatch, {
        ignored: (filePath, stats) => {
            if (!stats)
                return false;
            return stats.isFile() && !filePath.endsWith(".tmd");
        },
        persistent: true,
    });
    watcher.on("change", (path) => readFile(path));
}
export async function clear() {
    await watcher.close().then(() => console.log("closed"));
}
//# sourceMappingURL=watcher.js.map