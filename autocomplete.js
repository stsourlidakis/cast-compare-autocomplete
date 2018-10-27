const fs = require('fs');
const express = require('express');

const RESULTS_LIMIT = 5;
const REQUEST_CHAR_LIMIT = 30;

class Autocomplete {
	constructor(name, filename, charLimit = REQUEST_CHAR_LIMIT, resultsLimit = RESULTS_LIMIT) {
		this.data = [];
		this.name = name;
		this.filename = filename;
		this.readFile();

		this.charLimit = charLimit;
		this.resultsLimit = resultsLimit;

		this.router = this.createRouter();
	}

	readFile(){
		fs.readFile(this.filename, 'UTF-8', (err, data) => {
			if( err ){
				console.log(`Error while reading ${this.name} file: ${this.filename}`, err);
			} else {
				this.data = data.split('\n').map(item => {
					const parts = item.split('\t');
					return {
						name: parts[0],
						id: parts[1]
					};
				});
				console.log(`${this.name} data loaded.`);
			}
		});
	}

	createRouter(){
		return express.Router().get('/', (req, res) => {
			if( !this.dataLoaded() ){	//check if the file is loaded in memory
				res.status(500);
				res.json( {error: 'Service unavailable'} );
				return;
			}
			if ( !req.query.name || req.query.name.length<1 || req.query.name.length>this.charLimit ){	//check if the search param exists and is within bounds
				res.status(400);
				res.json( {error: 'Invalid string length or \'name\' parameter missing'} );
				return;
			}

			const matches = this.getMatches(req.query.name);
			res.json(matches);
		});
	}

	dataLoaded(){
		return this.data.length!==0;
	}

	getMatches(name){
		let matches = [];
		const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); //https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
		const reg = new RegExp(escapedName, 'i');

		for ( const item of this.data ){
			if( matches.length === RESULTS_LIMIT ){
				break;
			} else if ( reg.test(item.name) ){
				matches.push(item);
			}
		}

		return matches;
	}
}

module.exports = Autocomplete;
