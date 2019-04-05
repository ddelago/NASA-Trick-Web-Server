// Express App 
const express = require('express');
const routes = require('./routes/router');

const app = express();
app.use('/', routes);

// Load static files that are in the /public directory
app.use(express.static('public'));

const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
});