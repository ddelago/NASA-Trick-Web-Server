import { trickData, trickVariablesTree } from '../common/variables';
export { getBatchVariables as default };

function getBatchVariables(router, trickClient) {
    router.post('/data', (req, res) => {

        var oldValue = trickData;

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

        function wait() {
            // If old data, wait
            if(trickData === oldValue) {
                setTimeout(wait, 10);
                return;
            }
            res.send({
                "channel": "",
                "data": trickData,
            });
        }

        // Wait for new value to be updated
        wait();
   });
}