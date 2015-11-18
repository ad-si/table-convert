#! /usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const tableConvert = require('./index.js')

let args = process.argv
let commandName = path.basename(args[1])
let fileContent = fs.readFileSync(path.resolve(args[2]))

if (commandName === 'html-table2mmd')
	console.log(tableConvert(fileContent, {format: 'markdown'}))

else if (commandName === 'html-table2latex')
	console.log(tableConvert(fileContent, {format: 'latex'}))

else
	throw new Error(args[1] + ' is no available command name.')
