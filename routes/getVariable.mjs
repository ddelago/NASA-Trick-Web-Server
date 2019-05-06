// import {  } from '../common/variables';
export { getVariable as default };

// Get a variable's current value from Trick
function getVariable(router, trickClient) {
    router.get('/data/*', (req, res) => {

        // Extract trick variable from url
        var trickVariableChannel = req.url.substring(6);

        // Replace '/' channel notation to dot notation
        var trickVariable = trickVariableChannel.replace(/[/]/g, ".");

        // List of variables to send to Trick
        var trickVarList = "";
        trickVarList += `trick.var_add(\"${trickVariable}\")\n`;
        trickClient.write(trickVarList);

        var trickData = "";

        // Get response from Trick. MODIFY THIS LATER TO WAIT FOR RESPONSE FROM TRICK RATHER THAN LOOPING WAITING FOR VARIABLE TO CHANGE
        trickClient.on('data', function(data) {
            
            // Skip leading zero value, and cut off trailing new line character. Split on rest.
            trickData = data.toString().substring(2,data.length-1).split("\t");

            // Clear Trick stream
            trickClient.pause();
            trickClient.write('trick.var_clear()\n');
            trickClient.resume();
        });

        function reply() {
            // Wait for new value to be updated.
            if(trickData == "") {
                setTimeout(reply, 1)
            }
            else {
                res.send({
                    "channel": trickVariableChannel,
                    "data": trickData,
                });
            }
        }

        reply();
   });
}