'use strict'
function getInfo(opt){
	return new Promise((resolve, reject) => {
		console.log('Getting info...')
		if(opt.info) return resolve(opt)
		getJson(`${opt.dir}/info.json`)
			.then(obj => {
				opt.info = obj
				resolve(opt)
			})
			.catch(reject)
	})
}

function getData(opt){
	return new Promise((resolve, reject) => {
		console.log('Getting data...')
		const found = []
		let cursor = opt.offset
		opt.info.lastFileTotal
		function getBatch(){
			let file
			// Find which file pointer is pointing to
			if(cursor > (opt.info.lastFile * opt.info.entriesPerFile)){
				file = opt.info.lastFile
			}
			else{
				file = Math.floor(opt.info.entriesPerFile / cursor)
			}
			getJson(`${opt.dir}/${file}.json`)
				.then(arr => {
					let inFileCursor = file * opt.info.entriesPerFile
					for(let i = arr.length; i--;){
						if(cursor === inFileCursor){
							if(found.length < opt.limit){
								found.push(arr[i])
							}
							cursor--
						}
						inFileCursor--
					}
					if(found.length < opt.limit){
						file--
						if(file > 0){
							return getBatch()
						}
					}
					resolve(found)
				})
				.catch(reject)
		}
	})
}


function getJson(file){
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.onreadystatechange = function() {
			if(xhr.responseText) console.log(xhr.responseText)
			if(this.readyState == 4 && this.status == 200){
				resolve(JSON.parse(xhr.responseText))
			}
		}
		xhr.open('get', file, true)
		xhr.send()
	})
}


return function(opt, done){
	if(typeof opt !== 'object') opt = {}
	if(typeof opt === 'function') done = opt
	opt = Object.assign({
		dir: 'data',
		limit: 30,
		offset: 0
	}, opt)

	getInfo(opt)
		.then(getData)
		.then(ret => {
			console.log('Done!')
			done(ret)
		})
		.catch(console.error)
}
