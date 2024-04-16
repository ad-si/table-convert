import { parse } from "parse5"
import * as toMarkdown from "./to-markdown.js"
import * as toLatex from "./to-latex.js"

export type Options = {
  format?: "markdown" | "md" | "latex" | "tex"
  type?: "table" | "standalone" | "fragment"
}

export const defaults: Options = {
  format: "markdown",
  type: "table",
}

export type PseudoNode = {
  nodeName: string
  value: string
  attrs: { name: string; value: string }[]
  childNodes: PseudoNode[]
}

export default function tableConvert(
  html: string,
  options?: Options
): string | undefined {
  options = Object.assign(Object.assign({}, defaults), options)

  if (Buffer.isBuffer(html)) {
    html = html.toString()
  }

  const document = parse(html)

  if (/markdown|md/.test(options.format || "")) {
    if (options.type !== "table") {
      throw new Error("Only table type is supported for markdown output")
    }

    if (options.format !== "markdown") {
      console.warn(
        `Please use the canonical value "markdown" instead of "${options.format}"`
      )
    }
    return toMarkdown.walkTree(document as unknown as Document, options)
  } //
  else if (/latex|tex/.test(options.format || "")) {
    if (options.format !== "latex") {
      console.warn(
        `Please use the canonical value "latex" instead of "${options.format}"`
      )
    }
    // Remove non-braking spaces
    return toLatex
      .walkTree(document as unknown as PseudoNode, options)
      ?.replace(/\xA0/g, "")
  } //
  else {
    throw new Error(options.format + " is no supported output format!")
  }
}
