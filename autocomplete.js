const fs = require('fs');
const express = require('express');
const router = express.Router();

const RESULTS_LIMIT = 5;
const REQUEST_CHAR_LIMIT = 5;

const personsFilepath = './persons.tsv';

let persons;

fs.readFile(personsFilepath, 'UTF-8', function(err, data){
	if( err ){
		console.log(`Error while reading persons file: ${personsFilepath}`, err);
	} else {
		persons = data.split('\n').map(person => {
			const parts = person.split('\t');
			return {
				name: parts[0],
				id: parts[1]
			};
		});
		console.log(`Persons loaded.`);
	}
});

router.get('/', function(req, res){
	if( !arePersonsLoaded() ){	//check if the file is loaded in memory
		res.status(500);
		res.json( {error: 'Service unavailable'} );
		return;
	}
	if ( req.query.str<1 || req.query.str>REQUEST_CHAR_LIMIT ){	//check if the search param is within bounds
		res.json( {error: 'Invalid string length'} );
		return;
	}
	const matches = getMatches(req.query.str);
	res.json(matches);
});

function getMatches(str){
	let matches = [];
	const escapedStr = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); //https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
	const reg = new RegExp(escapedStr, 'i');

	for ( const person of persons ){
		if( matches.length === RESULTS_LIMIT ){
			break;
		} else if ( reg.test(person.name) ){
			matches.push(person);
		}
	}

	return matches;
}

function arePersonsLoaded(){
	return ( typeof persons !== 'undefined' && persons.length!==0 );
}

module.exports = router;
