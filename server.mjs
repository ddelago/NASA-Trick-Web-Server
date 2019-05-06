/* 
 * Trick Web Server
 * Daniel Delago
 * daniel.b.delago@nasa.gov
 */

import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import { router, setRoutes } from './router';
import { config, setCommandLineArgs } from './common/variables';
import { trickClient, startTrickConn } from './trick/trickConnection';
import { parseSie } from './trick/sie_parser';

// Command line arguements
setCommandLineArgs( process.argv.slice(2) ); 

// Start connection Trick server
startTrickConn();

// Parse S_sie.resource file from Trick to get variables
// parseSie(trickClient);  

/************** EXPRESS SERVER START **************/
var app = express();
var server = http.createServer(app);
app.use(bodyParser.json({strict: false}));
app.use('/', router);

// Setup routes
setRoutes(trickClient);

// Start the server
server.listen(config.api_port, config.ip_addr, () => {
    const serverURL = `http://${server.address().address}:${server.address().port}`;
    console.log(`Trick Web Server running at ${serverURL}`);
});