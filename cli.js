#! /usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const htmlTable2mmd = require('./index.js')

let fileContent = fs.readFileSync(path.resolve(process.argv[2]))

console.log(htmlTable2mmd(fileContent))
