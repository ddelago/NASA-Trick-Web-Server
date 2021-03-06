import { trickVariableMap, addChannel, addVariableMap } from '../../common/variables';
export { getVariable as default };

// Get a variable's current value from Trick
function getVariable(router, trickClient) {
    router.get('/data/*', (req, res) => {

        // Extract trick variable from url
        var trickVariableChannel = req.url.substring(6);

        // If not in Map, it was not added to the stream so just fetch directly.
        if(!(trickVariableChannel in trickVariableMap)) {
            // Replace '/' channel notation to dot notation
            var trickVariable = trickVariableChannel.replace(/[/]/g, ".");

            // Send command to Trick
            trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);

            // Update channel list and variable map
            addChannel(trickVariableChannel)
            addVariableMap(trickVariableChannel);
            
            // Skip delay to avoid any errors that may occurr and reduce latency
            // return sendDelayedResponse(res, trickVariableChannel);
        }

        res.send({
            "channel": trickVariableChannel,
            "data": trickVariableMap[trickVariableChannel]
        });
   });
}

// function sendDelayedResponse(res, trickVariableChannel) {
//     if(trickVariableMap[trickVariableChannel] == '') {
//         return setTimeout(sendDelayedResponse, 2, res, trickVariableChannel);
//     }
//     else {
//         res.send({
//             "channel": trickVariableChannel,
//             "data": trickVariableMap[trickVariableChannel]
//         });
//     }
// }