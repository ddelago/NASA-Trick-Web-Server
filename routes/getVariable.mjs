import { trickData } from '../common/variables';
export { getVariable as default };

// Get a variable's current value from Trick
function getVariable(router, trickClient) {
    router.get('/data/*', (req, res) => {

        var oldValue = trickData;

        // Extract trick variable from url
        var trickVariable = req.url.split("/");
        trickVariable = trickVariable[trickVariable.length - 1];

        // Send command to Trick
        trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);

        // THERE IS A CASE FOR WHEN THE TRICK SERVER IS FROZEN!! WILL BE STUCK HERE
        // Needed for FETCH version of server in order to get most updated values from Trick
        // Otherwise server will return old values since it is waiting for Trick to respond.
        // FETCH version is much less taxing on the server side but at a sacrifice of minor latency with the client.
        function wait() {
            if(trickData === oldValue) {
                // Modify wait time if it is an issue.
                // Decreasing will increase processes per variable request but reduce latency.
                // Issue may arrise (possibly) if client is requesting very large amounts of variables in succession. Will need to test
                setTimeout(wait, 10);
                return;
            }
            // Trick Variable will be changed to channel format later
            res.send({
                "channel": trickVariable,
                "data": trickData,
            });
        }

        // Wait for new value to be updated
        wait();
   });
}