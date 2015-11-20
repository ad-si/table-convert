'use strict'

const parse5 = require('parse5')
const toMarkdown = require('./to-markdown.js')
const toLatex = require('./to-latex.js')

const Parser = parse5.Parser

const defaults = {
	format: 'latex', // or markdown
	type: 'table' // standalone or fragment
}


module.exports = function (html, options) {

	options = Object.assign(Object.assign({}, defaults), options)

	const parser = new Parser()

	if (Buffer.isBuffer(html))
		html = html.toString()

	let document = parser.parse(html)

	let test = {}

	if (options.format === 'markdown')
		return toMarkdown(document, options)

	else if (options.format === 'latex')
		return toLatex(document, options)
			.replace(/\xA0/g, '') // Remove non-braking spaces

	else
		throw new Error(options.format + ' is no supported output format!')
}
