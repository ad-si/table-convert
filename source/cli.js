#! /usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const tableConvert = require('./index.js')

let args = yargs
	.usage('Usage: $0 <html-file>')
	//.demand(1)
	.argv

let commandName = path.basename(args.$0)
let relativeFilePath = args._.pop()
let fileContent = fs.readFileSync(path.resolve(relativeFilePath))


if (commandName === 'html-table2mmd' || /md|markdown/.test(args.to)) {
	process.stdout.write(tableConvert(fileContent, {
		format: 'markdown'
	}))
}
else if (commandName === 'html-table2latex' || /(la)?tex/.test(args.to)) {
	process.stdout.write(tableConvert(fileContent, {
		format: 'latex',
		type: args.type
	}))
}
else
	throw new Error(args.$0 + ' is no available command name.')
