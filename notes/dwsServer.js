"use strict";

// Change Node's process working directory to the current directory
process.chdir(__dirname);

// Import node modules
const fs = require('fs');
const path = require('path');
const expressModule = require('express');
const http2 = require('spdy');
const bodyParser = require('body-parser');
const compression = require('compression');

// Import configuration
const config = require(`./config.json`);
if (fs.existsSync(__dirname + '/config.local.json')) {
    const local_overrides = require('./config.local.json');
    Object.assign(config, local_overrides);
}

// Module import configuration
const localModulesRoot = path.join(__dirname, 'server_modules');
require('app-module-path').addPath(localModulesRoot);
global.__basedir = __dirname.replace(/\\/g, "/");
global.__modroot = `${__basedir}/server_modules`;

// Load server modules
require(`utils/logger.js`);
const displays = require(`user-pages/user-pages.js`);
const tcesUdp = require(`webservices/tces/handlers/udp-handler.js`);
const pubSub = require(`pubsub/pubsub.js`);
const routes = require(`routes/routes.js`);
const assignIpAddress = require(`utils/assign-ip-address.js`);
const setTerminalTitle = require(`utils/set-terminal-title.js`);
const hotkeys = require(`utils/hotkeys.js`);
const projPath = 'views/accounts/default/projects/defaultproj/user_root';

console.log("Initializing Display Web Server\n====================================");

//================<Express Server Setup>===================
const express = expressModule();

// Intialize Express templating engine to EJS and set the default template directory
express.set('view-engine', 'ejs');
express.set('views', path.join(__dirname, 'views'));

// Disable view cache due to clients modifying views live
// Note this is for development purposes only this is a highly unreliable & insecure practice
express.disable('view cache');


// Enable compression
if (config.compression) express.use(compression());

// Set Express static directory
express.use(expressModule.static('public', {
    etag: true,
    maxAge: config.public_cache_max_age,
}));
// Set static directory to project directory/assets
express.use(expressModule.static(projPath));

// Set up logging
const clientReqLog = function(req, res, next) {
    const rEnd = res.end;
    const reqStart = process.hrtime();

    res.end = function(chunk, encoding) {
        // Do the expected response work
        res.end = rEnd;
        res.end(chunk, encoding);

        // Log
        const resEnd = process.hrtime(reqStart);
        const timeInMs = resEnd[0] * 1000 + resEnd[1] / 1000000;
        const timeRounded = timeInMs.toFixed(2);
        log.entry('CLIENT_REQUEST', 2, `${req.method} ${req.url} ${res.statusCode} - ${timeRounded} ms`);
    };
    next(); // Passing the request to the next handler in the stack.
};
express.use(clientReqLog);

// Serve up some configuration
express.get('/config.js', (req, res) => {
    res.send("window.HIMAC_CONFIG = " + JSON.stringify(config.front_end))
})

// Initialize bodyParser middleware
express.use(bodyParser.json({
    limit: '5mb',
}));

// Set API and render routes
routes.setRoutes(express);

// Create the server
let server = null;
const ipAddr = assignIpAddress();
const port = config.port;

// HTTP2 enbaled server
if (config.http2) {
    const options = {
        key: fs.readFileSync('./cert/himac.key'),
        cert: fs.readFileSync('./cert/himac.crt'),
    };
    server = http2.createServer(options, express).listen(443, ipAddr, () => {
        logServerStart();
    });
}
// Standard HTTP server
else {
    server = express.listen(port, ipAddr, () => {
        logServerStart();
    });
}
function logServerStart() {
    const protocol = (server.address().port === 443 ? 'https' : 'http');
    const serverURL = `${protocol}://${server.address().address}:${server.address().port}`;
    console.log(`Listening on ${serverURL}`);
    setTerminalTitle(`=====  Chisel Server: ${serverURL}  =====`);
}
//================</Express Server Setup>===================


//================<Services Setup>===================
tcesUdp.init(ipAddr);
pubSub.init(server);
if (config.hotkeys) {
    hotkeys.init();
}
displays.printPageList();
//================</Services Setup>===================


/*
// Create a server based Faye pub/sub client
const faye = require('faye');
const serverPubsub = new faye.Client('http://' + ipAddr + ':80/faye');

// --- Client Publish Event ---
pubSub.adapter.on('publish', (clientID, channel, data) => {
    //console.log("Publishing to channel " + channel);
    //console.log('Publishing ' + JSON.stringify(data) + ' to ' + channel + ' from: ' + clientID);
});
*/
