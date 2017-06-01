'use strict'
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const db = require('../lib/get')
db({
	dir: '../test/data'
}, console.log)
