// Express App 
const express = require('express');
const routes = require('./routes/index');

const app = express();
app.use('/', routes);

const server = app.listen(3000, () => {
    console.log('Express is running on port ${server.address().port}');
});