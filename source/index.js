'use strict'

const parse5 = require('parse5')
const toMarkdown = require('./to-markdown.js')
const toLatex = require('./to-latex.js')

const Parser = parse5.Parser


module.exports = function (html, options) {

	const parser = new Parser()

	if (Buffer.isBuffer(html))
		html = html.toString()

	let document = parser.parse(html)

	let tree = require('util').inspect(
		document,
		{depth: null, colors: true}
	)

	let test = {}
	let barSpacePattern = '^(([^\\S\\n]|\\|)*\\|([^\\S\\n]|\\|)*)$'

	if (options.format === 'markdown')
		return toMarkdown(document)
			.replace(new RegExp(barSpacePattern, 'm'), (match) =>
				match.replace(/\s+/g, '---') + '|'
			)
			.replace(new RegExp(barSpacePattern, 'gm'), '')
			.replace(/[^\x00-\x7F]/g, '') // Remove non-Ascii characters

	else if (options.format === 'latex')
		return toLatex(document)

	else
		throw new Error(options.format + ' is no supported output format!')

}
