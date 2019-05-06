import { trickData } from '../common/variables';
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
        
        function reply() {
            res.send({
                "channel": trickVariableChannel,
                "data": trickData[0],
            });
        }

        // Wait for new value to be updated.
        setTimeout(reply, 25);
   });
}