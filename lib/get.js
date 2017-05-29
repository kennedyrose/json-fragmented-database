'use strict'

function getInfo(opt){
	return new Promise((resolve, reject) => {
		if(opt.info) return resolve(opt)
		const xhr = new XMLHttpRequest()
		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200){
				opt.info = JSON.parse(xhr.responseText)
				resolve(opt)
			}
		}
		xhr.open('get', `${opt.dir}/info.json`, true)
		xhr.send()
	})
}

function getData(opt){
	return new Promise((resolve, reject) => {

	})
}


module.exports = opt => {
	opt = Object.assign({
		dir: 'data',
		limit: 30,
		offset: 0
	}, opt)

	getInfo(opt)
		.then(getData)
}
