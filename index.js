'use strict'

const Parser = require('parse5').Parser

module.exports = function (html) {

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

	return walkTree(document)
		.replace(new RegExp(barSpacePattern, 'm'), (match) =>
			match.replace(/\s+/g, '---') + '|'
		)
		.replace(new RegExp(barSpacePattern, 'gm'), '')
		.replace(/[^\x00-\x7F]/g, '') // Remove non-Ascii characters
}


function walkTree (node) {

	if (Array.isArray(node))
		return node
			.map(walkTree)
			.join('')

	if (node.nodeName === 'tr')
		return '| ' + walkTree(node.childNodes) + '\n'

	if (node.nodeName === 'td') {
		let colspan = node.attrs.find(attr => attr.name === 'colspan')

		return walkTree(node.childNodes) + ' ' +
				(colspan ?
					new Array(Number(colspan.value)).fill('|').join('') :
					' |'
				) +
				' '
	}

	if (node.childNodes &&
		node.nodeName !== 'style' &&
		node.nodeName !== 'title'
	) {
		return walkTree(node.childNodes)
	}
	else if (node.nodeName !== '#comment'){
		return node.value
	}
}
