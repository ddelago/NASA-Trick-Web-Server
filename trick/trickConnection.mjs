/* 
 * Sets up connection to Trick server
 * How will this scale for very large simulations??
 * How to handle batch requests??
 */

import net from 'net';
import fs from 'fs';
import { commandLineArgs as args, setTrickData } from '../common/variables';
export { trickClient, startTrickConn };

var trickClient = new net.Socket();

// Log trick data to file (In order to parse S_sie.resource file)
var log_file = fs.createWriteStream('./trick/trick_output.log', {flags : 'w'});

function startTrickConn(){
    // Connect to Trick server from command line arguements
    trickClient.connect(args[1], args[0], function() {
        console.log(`Connected to Trick server at ${args[0]}:${args[1]}`); 
    });

    // Get response from Trick
    trickClient.on('data', function(data) {
        // Log Trick (used to store very large S_sie.resource file)
        log_file.write(data);
    });

    trickClient.on('close', function() {
        console.log('Connection closed'); 
    });
}