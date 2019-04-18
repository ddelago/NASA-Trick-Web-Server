// Trick Web Server
// Daniel Delago
// daniel.b.delago@nasa.gov

import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import { trickClient, startTrickConn } from './trick/trickConnection';
import { router, getVariable } from './routes/router';
import { config, setCommandLineArgs } from './common/variables';

// Command line arguements
setCommandLineArgs( process.argv.slice(2) ); 

// Start connection Trick server
startTrickConn();

/************** EXPRESS SERVER START **************/
var app = express();
var server = http.createServer(app);
app.use(bodyParser.json());
app.use('/', router);

// routes
getVariable(trickClient);

// Start the server
server.listen(config.api_port, config.ip_addr, () => {
    const serverURL = `http://${server.address().address}:${server.address().port}`;
    console.log(`Trick Web Server running at ${serverURL}`);
});