'use strict'

let options = {}

function removeTabs (strings) {

	let values = Array.from(arguments).slice(1)
	let output = ''
	strings.forEach((string, index) => {
		output += string.replace(/^\s+/mg, '')
		output += values[index] ?
			values[index].replace(/^\s+/mg, '') :
			''
	})

	return output
}

function getTabularyTemplate (output, maxNumberOfCells) {
	return removeTabs `
		\\begin{tabulary}{\\textwidth}\
			{${
				('S[' +
					'table-format=5, ' +
					'table-align-uncertainty=false, ' +
					'table-align-exponent=false' +
				']')
				.repeat(maxNumberOfCells)
			}}
			\\toprule
			${output}
			\\bottomrule
		\\end{tabulary}
	`
}

function getStandaloneTemplate (output) {
	return removeTabs `
		\\documentclass{standalone}

		\\usepackage{tabulary}
		\\usepackage{booktabs}
		\\usepackage{siunitx}

		\\begin{document}
		${output}
		\\end{document}
	`
}

module.exports = function walkTree (node, _options) {

	let output

	if (node.nodeName === '#document') {
		options = _options

		let maxNumberOfCells = 0

		output = walkTree(node.childNodes)
					.split('\n')
					.map(line => {
						let numberOfCells = (line.match(/ \& /g) || []).length

						if (numberOfCells > maxNumberOfCells)
							maxNumberOfCells = numberOfCells

						// Remove leading whitespace and '&'
						line = line.replace(/^\s*&\s*/gm, '')

						// Replace rows with only empty cells
						// by horizontal lines
						if (/^([^\S]|\&)+\\\\$/g.test(line))
							line = '\\midrule'

						return line
					})
					.join('\n')

		if (options.type === 'fragment')
			return output

		output = getTabularyTemplate(output, maxNumberOfCells)

		if (options.type === 'standalone')
			return getStandaloneTemplate(output)

		else if (options.type && options.type !== 'table')
			throw new Error(options.type + ' is no valid output type!')

		return output
	}

	if (Array.isArray(node))
		return node
			.map(walkTree)
			.join('')

	if (node.nodeName === 'tr')
		return walkTree(node.childNodes) + ' \\\\\n'

	if (node.nodeName === 'td') {
		let colspan = node.attrs.find(attr => attr.name === 'colspan')
		let cellValue = walkTree(node.childNodes)
		let cellAsNumber = /^\s+$/.test(cellValue) ? '' : Number(cellValue)

		if (colspan)
			return ` & \\multicolumn{${Number(colspan.value)}}` +
					'{c}' +
					`{${cellValue}} `
		else
			return ' & ' + (
				Number.isNaN(cellAsNumber) ?
					`{${cellValue}}` :
					cellAsNumber
			)
	}

	if (node.childNodes &&
		node.nodeName !== 'style' &&
		node.nodeName !== 'title') {

		return walkTree(node.childNodes)
	}
	else if (node.nodeName !== '#comment'){
		return node.value
	}
}
