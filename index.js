const express = require('express');
const app = express();
const autocomplete = require('./autocomplete');
const port = 3001;

app.use('/', autocomplete);

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
});
