import { trickData, trickVariablesTree } from '../common/variables';
export { getBatchVariables as default };

function getBatchVariables(router, trickClient) {
    router.post('/data', (req, res) => {

        // List of variables to send to Trick
        var trickVarList = "";

        // Send commands to Trick
        req.body.channels.forEach(function(variable) { 
            // Replace '/' channel notation to dot notation
            variable = variable.replace(/[/]/g, ".");
            trickVarList += `trick.var_add(\"${variable}\")\n`;
        });

        // Send list of variables to Trick
        trickClient.write(trickVarList);
        
        function reply() {
            res.send({
                "channel": req.body.channels,
                "data": trickData,
            });
        }

        // Wait for new value to be updated.
        setTimeout(reply, 100);
   });
}