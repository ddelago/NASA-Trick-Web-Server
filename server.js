// Trick Web Server
// Daniel Delago
// daniel.b.delago@nasa.gov

var http = require('http');
var net = require('net');
const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const config = require('./config.json');
// const routes = require('./routes/index');

// Create Express App and attach it to node.js server
var app = express();
var server = http.createServer(app);


app.use('/', router);

router.get('/', (req, res) => {
    res.send('You made a get request');
});

router.post('/', (req, res) => {
    res.send('You made a post request');
});


/*********** TRICK CONNECTION ***********/
var client = new net.Socket();

// Command line arguements
var args = process.argv.slice(2);

client.connect(args[1], args[0], function() {
    console.log(`Connected to Trick server at ${args[0]}:${args[1]}`); 
});

// client.write("trick.var_pause()\n"); 
client.write("trick.var_add(\"dyn.satellite.pos[1]\") \n");
client.write("trick.var_add(\"dyn.satellite.pos[0]\") \n");
// client.write("trick.var_unpause()\n");

// Gets only the current value of the variable
client.on('data', function(data) {
	console.log('Received: ' + data);
    client.pause();
    client.write('trick.var_clear()\n');
    client.resume();
});

// setTimeout(function () {
// 	client.write('trick.var_clear()\n');
//   }, 1000)

client.on('close', function() {
	console.log('Connection closed');
});


=======
const routes = require('./routes/router');
>>>>>>> 29b03264a7e24832f893544d03188724783d87bb


<<<<<<< HEAD
// Start the server
server.listen(config.api_port, config.ip_addr, () => {
    const serverURL = `http://${server.address().address}:${server.address().port}`;
    console.log(`Trick Web Server running at ${serverURL}`);
});
=======
// Load static files that are in the /public directory
app.use(express.static('public'));

const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
});
>>>>>>> 29b03264a7e24832f893544d03188724783d87bb
