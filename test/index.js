'use strict'

const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const expect = require('unexpected')
const tableConvert = require('../source/index.js')


{
	process.stdout.write('It converts a HTML table to a Multimarkdown table')

	let actual = tableConvert(
		fs.readFileSync(path.join(__dirname, './test.html')),
		{
			format: 'markdown'
		}
	)
	let expected = fs.readFileSync(path.join(__dirname, './table.md'), 'utf8')

	expect(actual, 'to be', expected)
	console.log(' ✔')
}

{
	let expectedLatex = fs.readFileSync(
		path.join(__dirname, './table.tex'),
		'utf8'
	)

	{
		process.stdout.write('It converts a HTML table to a Latex table')

		let actual = tableConvert(
			fs.readFileSync(path.join(__dirname, './test.html'))
		)
		expect(actual, 'to be', expectedLatex)
		console.log(' ✔')
	}

	{
		process.stdout.write('It has a command line interface')

		let actual = child_process.execFileSync(
			'source/cli.js',
			[
				'--to',
				'latex',
				'test/test.html'
			],
			{
				cwd: path.join(__dirname, '../')
			}
		)

		expect(actual.toString(), 'to be', expectedLatex)
		console.log(' ✔')
	}
}


{
	process.stdout.write('Command line interface accepts type parameter')

	let expectedLatexFragment = fs.readFileSync(
		path.join(__dirname, './table-fragment.tex'),
		'utf8'
	)
	let actual = child_process.execFileSync(
		'source/cli.js',
		[
			'--to',
			'latex',
			'--type',
			'fragment',
			'test/test.html'
		],
		{
			cwd: path.join(__dirname, '../')
		}
	)

	expect(actual.toString(), 'to be', expectedLatexFragment)
	console.log(' ✔')
}
