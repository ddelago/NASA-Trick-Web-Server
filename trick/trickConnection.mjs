/* 
 * Sets up connection to Trick server
 * How will this scale for very large simulations??
 * How to handle batch requests??
 */

import net from 'net';
import log from 'log-to-file';
import { commandLineArgs as args, setTrickData } from '../common/variables';
export { trickClient, startTrickConn };

var trickClient = new net.Socket();

function startTrickConn(){
    // Connect to Trick server from command line arguements
    trickClient.connect(args[1], args[0], function() {
        console.log(`Connected to Trick server at ${args[0]}:${args[1]}`); 
    });

    // Fetch the current value of the variable only
    trickClient.on('data', function(data) {
        console.info('Received: ' + data);
        
        // Skip leading zero value, and cut off trailing new line character. Split on rest.
        data = data.toString().substring(2,data.length-2).split("\t");

        // Log data to file, Used to get S_sie.resource file. 
        log(data[0], './common/trick_output.log');

        // Store data, only sends first value (because this is FETCH method)
        setTrickData(data[0]);

        // Clear Trick stream
        trickClient.pause();
        trickClient.write('trick.var_clear()\n');
        trickClient.resume();
    });

    trickClient.on('close', function() {
        console.log('Connection closed');
    });
}