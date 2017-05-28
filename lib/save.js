'use strict'
/*
	db.save({
		dir: './json'
	})
*/

function getInfo(opt){
	return new Promise((resolve, reject) => {
		fs.readJson(`${opt.dir}/info.json`)
			.then(obj => {
				opt.info = obj
				resolve(opt)
			})
			.catch(() => {
				opt.info = {
					lastId: false,
					uniqueId: opt.uniqueId,
					entriesPerFile: opt.entriesPerFile,
					lastFile: 1
				}
				resolve(opt)
			})
	})
}

function getLastFile(opt){
	return new Promise((resolve, reject) => {
		fs.readJson(`${opt.dir}/${opt.info.lastFile}.json`)
			.then(arr => {
				opt.lastFile = arr
				resolve(opt)
			})
			.catch(() => {
				opt.lastFile = []
				resolve(opt)
			})
	})
}

function createFileContents(opt){
	opt.files = {}
	opt.files[opt.info.lastFile] = opt.lastFile
	let cursor = opt.lastFile.length
	// Populate opt.files
}

function saveFiles(){

}


module.exports = opt => {
	opt = Object.assign({
		entriesPerFile: 30,
		uniqueId: 'id'
	})

	getInfo(opt)
		.then(getLastFile)
		.then(createFileContents)
		.then(saveFiles)
}
