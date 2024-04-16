import { PseudoNode, Options } from "./index.js"

function removeTabs(strings: TemplateStringsArray, ...values: string[]) {
  let output = ""
  strings.forEach((string, index) => {
    output += string.replace(/^\s+/gm, "")
    output += values[index] ? values[index].replace(/^\s+/gm, "") : ""
  })

  return output
}

function getTabularyTemplate(output: string, maxNumberOfCells: number) {
  const header = (
    "S[" +
    "table-format=5, " +
    "table-align-uncertainty=false, " +
    "table-align-exponent=false" +
    "]"
  ).repeat(maxNumberOfCells)

  return removeTabs`
		\\begin{tabulary}{\\textwidth}\
			{${header}}
			\\toprule
			${output}
			\\bottomrule
		\\end{tabulary}
	`
}

function getStandaloneTemplate(output: string) {
  return removeTabs`
		\\documentclass{standalone}

		\\usepackage{tabulary}
		\\usepackage{booktabs}
		\\usepackage{siunitx}

		\\begin{document}
		${output}
		\\end{document}
	`
}

export function walkTree(
  node: Document | PseudoNode | PseudoNode[],
  options: Options
): string | undefined {
  let output: string | undefined = ""

  if (!Array.isArray(node) && node.nodeName === "#document") {
    let maxNumberOfCells = 0

    output = walkTree(node.childNodes as unknown as PseudoNode[], options)
      ?.split("\n")
      .map((line) => {
        let numberOfCells = (line.match(/ \& /g) || []).length

        if (numberOfCells > maxNumberOfCells) maxNumberOfCells = numberOfCells

        // Remove leading whitespace and '&'
        line = line.replace(/^\s*&\s*/gm, "")

        // Replace rows with only empty cells
        // by horizontal lines
        if (/^([^\S]|\&)+\\\\$/g.test(line)) line = "\\midrule"

        return line
      })
      .join("\n")

    if (options.type === "fragment") {
      return output
    }

    output = getTabularyTemplate(output || "", maxNumberOfCells)

    if (options.type === "standalone") {
      return getStandaloneTemplate(output)
    } //
    else if (options.type && options.type !== "table") {
      throw new Error(options.type + " is no valid output type!")
    }

    return output
  }

  if (Array.isArray(node)) {
    return node //
      .map((nd) => walkTree(nd, options))
      .join("")
  }

  if (!Array.isArray(node) && node.nodeName === "tr") {
    return (
      walkTree(node.childNodes as unknown as PseudoNode[], options) + " \\\\\n"
    )
  }

  if (!Array.isArray(node) && node.nodeName === "td") {
    let colspan = (node as unknown as PseudoNode).attrs.find(
      (attr) => attr.name === "colspan"
    )
    let cellValue = walkTree(
      node.childNodes as unknown as PseudoNode[],
      options
    )
    let cellAsNumber = /^\s+$/.test(cellValue || "") ? "" : Number(cellValue)

    if (colspan) {
      return (
        ` & \\multicolumn{${Number(colspan.value)}}` + "{c}" + `{${cellValue}} `
      )
    } else {
      return (
        " & " + (Number.isNaN(cellAsNumber) ? `{${cellValue}}` : cellAsNumber)
      )
    }
  }
  if (!Array.isArray(node)) {
    if (
      node.childNodes &&
      node.nodeName !== "style" &&
      node.nodeName !== "title"
    ) {
      return walkTree(node.childNodes as unknown as PseudoNode[], options)
    } //
    else if (node.nodeName !== "#comment") {
      // @ts-expect-error Property 'value' does not exist on type
      return node.value
    }
  }
}
