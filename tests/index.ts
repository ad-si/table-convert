import fs from "fs"
import path from "path"
import expect from "unexpected"
import tableConvert from "../source/index.js"
import { execFileSync } from "child_process"

{
  process.stdout.write("It converts a HTML table to a Multimarkdown table")

  let actual = tableConvert(
    fs.readFileSync(path.join(__dirname, "./test.html"), { encoding: "utf8" }),
    { format: "markdown" }
  )
  let expected = fs.readFileSync(path.join(__dirname, "./table.md"), {
    encoding: "utf8",
  })

  expect(actual, "to be", expected)
  console.log(" ✔")
}

{
  let expectedLatex = fs.readFileSync(path.join(__dirname, "./table.tex"), {
    encoding: "utf8",
  })

  {
    process.stdout.write("It converts a HTML table to a Latex table")

    let actual = tableConvert(
      fs.readFileSync(path.join(__dirname, "./test.html"), {
        encoding: "utf8",
      }),
      { format: "latex" }
    )
    expect(actual, "to be", expectedLatex)
    console.log(" ✔")
  }

  {
    process.stdout.write("It has a command line interface")

    let actual = execFileSync(
      "source/cli.js",
      [
        ["--to", "latex"], //
        "tests/test.html",
      ].flat(),
      { cwd: path.join(__dirname, "../") }
    )

    expect(actual.toString(), "to be", expectedLatex)
    console.log(" ✔")
  }
}

{
  process.stdout.write("Command line interface accepts type parameter")

  let expectedLatexFragment = fs.readFileSync(
    path.join(__dirname, "./table-fragment.tex"),
    { encoding: "utf8" }
  )
  let actual = execFileSync(
    "source/cli.js",
    [
      ["--to", "latex"], //
      ["--type", "fragment"],
      "tests/test.html",
    ].flat(),
    { cwd: path.join(__dirname, "../") }
  )

  expect(actual.toString(), "to be", expectedLatexFragment)
  console.log(" ✔")
}
