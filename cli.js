#! /usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const tableConvert = require('./index.js')

let fileContent = fs.readFileSync(path.resolve(process.argv[2]))

console.log(tableConvert(fileContent))
