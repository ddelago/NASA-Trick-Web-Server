/* 
 * Sets up connection to Trick server
 */

import net from 'net';
import fs from 'fs';
import { commandLineArgs as args, trickVariableMap, channelList, sieParsed } from '../common/variables';
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
        if(!sieParsed) {
            log_file.write(data);
        }

        // After sie is parsed, start performing commands below
        else {
            // Skip leading zero value, and cut off trailing new line character. Split on rest.
            var trickData = data.toString().substring(2,data.length-1).split("\t");
    
            // Assign data to Trick map
            for(var i = 0; i < trickData.length; i++) {
                trickVariableMap[channelList[i]] = trickData[i];
            }
        }

        console.log(trickVariableMap)
    });

    trickClient.on('close', function() {
        console.log('Connection closed'); 
    });
}