'use strict'
const db = require('./index')

const data = []
for(let i = 0; i < 50; i++){
	data[i] = {
		id: i,
		content: `Content ${i}`
	}
}

/*
db.save({
	dir: './test',
	data: data
})
*/
db.getLastId({
		dir: './test'
	})
	.then(console.log)
	.catch(console.error)
