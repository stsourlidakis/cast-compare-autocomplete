const express = require('express');
const app = express();
const cors = require('cors');
const Autocomplete = require('./Autocomplete');
const port = 3001;

const person = new Autocomplete('person', 'person.tsv');
const movie = new Autocomplete('movie', 'movie.tsv');

app.use(cors());
app.disable('x-powered-by');
app.use('/person', person.router);
app.use('/movie', movie.router);

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
});
