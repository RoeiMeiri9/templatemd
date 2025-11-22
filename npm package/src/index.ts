#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { watchFile, clear } from "./watcher.js";

async function init() {
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: tmd --watch <file|folder>")
    .option("watch", {
      alias: "w",
      type: "string",
      description: "File or folder to watch",
    })
    .option("benchmark", {
      alias: "b",
      type: "boolean",
      description: "Prints length of operation in ms",
    })
    .help("help") // enables --help
    .alias("help", "h").argv; // alias -h

  const { watch: path, benchmark } = await argv;

  if (!path) {
    throw new Error("No file/folder specified. Use --help for usage.");
  }
  if (benchmark) {
    console.log("Benchmark mode enabled — parsing times will be logged.");
  }
  console.log("Watching:", path);

  watchFile(path, benchmark ?? false);
  process.stdin.resume();
  process.on("beforeExit", clear);
}

init();
