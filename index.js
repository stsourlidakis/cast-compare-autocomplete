const express = require('express');
const app = express();
const cors = require('cors');
const Autocomplete = require('./Autocomplete');
const port = 3001;

const persons = new Autocomplete('persons', 'persons.tsv');

app.use(cors());
app.disable('x-powered-by');
app.use('/', persons.router);

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
});
