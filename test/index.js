'use strict'

const fs = require('fs')
const path = require('path')
const expect = require('unexpected')
const tableConvert = require('../source/index.js')

{
	let actual = tableConvert(
		fs.readFileSync(path.join(__dirname, './test.html'))
	)
	let expected = fs.readFileSync(path.join(__dirname, './test.tex'), 'utf8')

	expect(actual, 'to be', expected)
}

{
	let actual = tableConvert(
		fs.readFileSync(path.join(__dirname, './test.html')),
		{
			format: 'markdown'
		}
	)
	let expected = fs.readFileSync(path.join(__dirname, './table.md'), 'utf8')

	expect(actual, 'to be', expected)
}
