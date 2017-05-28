'use strict'
const fs = require('fs-extra')
module.exports = opt => {
	return new Promise((resolve, reject) => {
		fs.readJson(`${opt.dir}/info.json`)
			.then(resolve)
			.catch(() => resolve(false))
	})
}
