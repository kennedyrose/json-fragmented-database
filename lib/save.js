'use strict'
const fs = require('fs-extra')

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
	return new Promise((resolve, reject) => {
		opt.files = {}
		opt.files[opt.info.lastFile] = opt.lastFile
		let fileCursor = opt.info.lastFile
		let dataCursor = opt.lastFile.length
		// Populate opt.files
		for(let i = 0; i < opt.data.length; i++){
			if(dataCursor >= opt.info.entriesPerFile){
				dataCursor = 0
				fileCursor++
				opt.files[fileCursor] = []
			}
			opt.files[fileCursor].push(opt.data[i])
			dataCursor++
		}
		// Save status to info
		opt.info.lastFile = fileCursor
		opt.info.lastId = opt.data[opt.data.length - 1][opt.info.uniqueId]
		resolve(opt)
	})
}

function saveFiles(opt){
	return new Promise((resolve, reject) => {
		const promises = [new Promise((resolve, reject) => {
			fs.outputJson(`${opt.dir}/info.json`, opt.info)
				.then(resolve)
				.catch(reject)
		})]
		for(let i = opt.files.length; i--;){
			promises.push(new Promise((resolve, reject) => {
				fs.outputJson(`${opt.dir}/${i}.json`, opt.files[i])
					.then(resolve)
					.catch(reject)
			}))
		}
		Promise.all(promises)
			.then(() => resolve(opt))
			.catch(reject)
	})
}


module.exports = opt => {
	opt = Object.assign({
		entriesPerFile: 30,
		uniqueId: 'id'
	}, opt)

	getInfo(opt)
		.then(getLastFile)
		.then(createFileContents)
		.then(saveFiles)
		.then(() => {
			if(opt.done) opt.done(opt)
		})
		.catch(console.error)
}
