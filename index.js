const express = require('express');
const app = express();
const cors = require('cors');
const autocomplete = require('./autocomplete');
const port = 3001;

app.use(cors());
app.disable('x-powered-by');
app.use('/', autocomplete);

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
});
