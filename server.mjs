// Trick Web Server
// Daniel Delago
// daniel.b.delago@nasa.gov

import http from 'http';
import net from 'net';
import bodyParser from 'body-parser';
import express from 'express';
const router = express.Router();
import { config } from './variables.mjs';

// Stores data received from Trick
var trickData = "";

/************** TRICK CONNECTION START **************/
var client = new net.Socket();

// Command line arguements
var args = process.argv.slice(2);

// Connect to Trick server from command line arguements
client.connect(args[1], args[0], function() {
    console.log(`Connected to Trick server at ${args[0]}:${args[1]}`); 
});

// Gets only the current value of the variable
client.on('data', function(data) {
    console.log('Received: ' + data);

    // Skip leading zero value, and cut off trailing new line character. Split on rest.
    data = data.toString().substring(3,data.length-2).split("\t");

    // Store data
    trickData = data;

    // Get data then clear variables to save resources?
    client.pause();
    client.write('trick.var_clear()\n');
    client.resume();
});

client.on('close', function() {
	console.log('Connection closed');
});
/************** TRICK CONNECTION END **************/

/************** EXPRESS SERVER START **************/
var app = express();
var server = http.createServer(app);
app.use(bodyParser.json());
app.use('/', router);

/*  Commented below is used for LOOPING implementation.
    PUT request will store value to a json object.
    Server will then CONSTANTLY update those values from Trick.
*/
// // Add a variable to track
// router.put('/cmd/addVariable', (req, res) => {
//     // Send command to Trick
//     client.write(`trick.var_add(\"${req.body.variable}\")\n`);

//     // Reply to client
//     res.send(`Now tracking ${req.body.variable}`);
// });

// Get a variable's current value from Trick
router.get('/cmd/getVariable', (req, res) => {
    // Send command to Trick
    client.write(`trick.var_add(\"${req.body.variable}\")\n`);

    res.send({"value": trickData[0]});
});

// Start the server
server.listen(config.api_port, config.ip_addr, () => {
    const serverURL = `http://${server.address().address}:${server.address().port}`;
    console.log(`Trick Web Server running at ${serverURL}`);
});