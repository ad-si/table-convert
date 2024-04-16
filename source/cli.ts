#! /usr/bin/env node

import fs from "fs"
import path from "path"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import tableConvert from "./index.js"

const argv = yargs(hideBin(process.argv)) //
  .usage(
    "$0 <file-path>",
    // @ts-expect-error  No overload matches this call
    "Convert HTML tables to MMD or LaTeX",
    (yargs) => {
      yargs
        .positional("file-path", {
          describe: "The path to the file containing the HTML table",
          type: "string",
        })
        .option("to", {
          describe: "The format to convert the table to",
          choices: ["markdown", "md", "latex", "tex"],
          default: "markdown",
        })
        .option("type", {
          describe: "Conversion type",
          choices: ["table", "standalone", "fragment"],
          default: "table",
        })
    }
  ).argv
// @ts-expect-error  Property 'filePath' does not exist on type
const relativeFilePath = argv.filePath
const fileContent = fs.readFileSync(path.resolve(relativeFilePath))

process.stdout.write(
  // @ts-expect-error  No overload matches this call.
  tableConvert(fileContent, {
    // @ts-expect-error  Property 'to' does not exist on type
    format: argv.to,
    // @ts-expect-error  Property 'type' does not exist on type
    type: argv.type,
  })
)
