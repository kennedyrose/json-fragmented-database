'use strict'
const getInfo = require('./get-info')
module.exports = opt => {
	return new Promise((resolve, reject) => {
		getInfo(opt)
			.then(obj => resolve((typeof obj === 'object' && 'lastId' in obj) ? obj.lastId : false))
			.catch(() => resolve(false))
	})
}
