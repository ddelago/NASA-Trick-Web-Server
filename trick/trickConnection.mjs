/* 
 * Sets up connection to Trick server
 * How will this scale for very large simulations??
 * How to handle batch requests??
 */

import net from 'net';
import fs from 'fs';
import { commandLineArgs as args, trickVariableMap, channelList } from '../common/variables';
export { trickClient, startTrickConn };

var trickClient = new net.Socket();

// Log trick data to file (In order to parse S_sie.resource file)
var log_file = fs.createWriteStream('./trick/trick_output.log', {flags : 'w'});

function startTrickConn(){
    // Connect to Trick server from command line arguements
    trickClient.connect(args[1], args[0], function() {
        console.log(`Connected to Trick server at ${args[0]}:${args[1]}`); 
    });

    // Get data from Trick, set polling frequency later
    trickClient.on('data', function(data) {
        // Log Trick (used to store very large S_sie.resource file)
        log_file.write(data);

        // Skip leading zero value, and cut off trailing new line character. Split on rest.
        var trickData = data.toString().substring(2,data.length-1).split("\t");

        // Assign data to Trick map
        for(var i = 0; i < trickData.length; i++) {
            trickVariableMap[channelList[i]] = trickData[i];
        }

        console.log(trickVariableMap)
    });

    trickClient.on('close', function() {
        console.log('Connection closed'); 
    });
}