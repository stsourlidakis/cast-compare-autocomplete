import express from 'express';
import cors from 'cors';
import Autocomplete from './autocomplete.js';

const app = express();
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
