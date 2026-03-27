#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { watchFile, clear } from "./watcher.js";
import { Logger } from "./utils/logger.js";

async function init() {
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: tmd --watch <file|folder>")
    .option("watch", {
      alias: "w",
      type: "string",
      description: "File or folder to watch",
    })
    .help("help") // enables --help
    .alias("help", "h").argv; // alias -h

  const { watch: path, benchmark } = await argv;

  if (!path) {
    throw new Error("No file/folder specified. Use --help for usage.");
  }
  Logger.info("Watching:", path);

  watchFile(path);
  process.stdin.resume();
  process.on("beforeExit", clear);
}

init();
