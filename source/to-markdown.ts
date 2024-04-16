import { Options, PseudoNode } from "./index.js"

export function walkTree(
  node: Document | PseudoNode | PseudoNode[],
  options: Options
): string | undefined {
  let barSpacePattern = "^(([^\\S\\n]|\\|)*\\|([^\\S\\n]|\\|)*)$"

  if (!Array.isArray(node) && node.nodeName === "#document") {
    return (
      (walkTree(node.childNodes as unknown as PseudoNode, options) || "")
        .replace(
          new RegExp(barSpacePattern, "m"),
          (match) => match.replace(/\s+/g, "---") + "|"
        )
        .replace(new RegExp(barSpacePattern, "gm"), "")
        .replace(/[^\x00-\x7F]/g, "") // Remove non-Ascii characters
        .trim() + "\n"
    )
  }

  if (Array.isArray(node)) {
    return node //
      .map((nd) => walkTree(nd, options))
      .join("")
  }

  if (node.nodeName === "tr") {
    return (
      "|" + walkTree(node.childNodes as unknown as PseudoNode[], options) + "\n"
    )
  }

  if (node.nodeName === "td") {
    let colspan = (node as unknown as PseudoNode).attrs.find(
      (attr) => attr.name === "colspan"
    )

    return (
      " " +
      walkTree(node.childNodes as unknown as PseudoNode[], options) +
      " " +
      (colspan ? new Array(Number(colspan.value)).fill("|").join("") : "|")
    )
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
      return (node as unknown as PseudoNode).value
    }
  }
}
